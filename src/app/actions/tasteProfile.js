'use server';

import { connectDB } from '@/lib/mongodb';
import Interaction from '@/models/Interaction';
import Song from '@/models/Song';
import TasteProfile from '@/models/TasteProfile';
import User from '@/models/User';
import { getAuthToken, verifyAuthToken } from './auth';

const WEIGHTS = {
    liked: 3,
    completed: 2,
    replayed: 4,
    downloaded: 3,
    searched: 1,
    skipped: -2,
};

// ─── Pure aggregation helpers (no DB calls, easy to unit test) ───────────────

function buildTopArtists(interactions, songMap) {
    const artistMap = {}; // artistId -> { artistId, artist, image, score }

    for (const i of interactions) {
        const song = songMap[i.songId];
        if (!song?.primaryArtists?.length) continue;

        const weight = WEIGHTS[i.type] || 0;
        for (const pa of song.primaryArtists) {
            if (!pa.artistId || !pa.name) continue;
            if (!artistMap[pa.artistId]) {
                artistMap[pa.artistId] = { artistId: pa.artistId, artist: pa.name, image: pa.thumbnailUrl, score: 0 };
            }
            artistMap[pa.artistId].score += weight;
        }
    }

    return Object.values(artistMap)
        .filter((a) => a.score > 0 && a.image)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
}

function buildTopSongs(interactions, songMap) {
    const songScoreMap = {}; // songId -> { songId, name, image, artist, score }

    for (const i of interactions) {
        const song = songMap[i.songId];
        if (!song) continue;

        const weight = WEIGHTS[i.type] || 0;
        if (!songScoreMap[i.songId]) {
            songScoreMap[i.songId] = {
                songId: i.songId,
                name: song.name,
                image: song.image,
                artist: song.primaryArtists?.[0]?.name || '',
                duration: song.duration || 0,
                score: 0,
            };
        }
        songScoreMap[i.songId].score += weight;
    }

    return Object.values(songScoreMap)
        .filter((s) => s.score > 0 && s.image)
        .sort((a, b) => b.score - a.score)
        .slice(0, 20);
}

// ─── Orchestrator: fetch once, delegate to pure helpers, persist ─────────────

/**
 * Aggregates all interactions + song metadata for the given user and persists
 * both their top-artist and top-song taste profiles.  Called by the daily cron.
 *
 * @param  {string} userId - MongoDB ObjectId of the user
 * @returns {Promise<{ topArtists: Array, topSongs: Array } | null>}
 */
export async function computeTasteProfile(userId) {
    await connectDB();

    const interactions = await Interaction.find({ userId }).lean();
    if (interactions.length < 5) return null;

    const songIds = [...new Set(interactions.map((i) => i.songId))];
    const songs = await Song.find({ songId: { $in: songIds } }).lean();
    const songMap = Object.fromEntries(songs.map((s) => [s.songId, s]));

    const topArtists = buildTopArtists(interactions, songMap);
    const topSongs = buildTopSongs(interactions, songMap);

    if (!topArtists.length && !topSongs.length) return null;

    await TasteProfile.findOneAndUpdate(
        { userId },
        { $set: { topArtists, topSongs, computedAt: new Date() } },
        { upsert: true }
    );

    return { topArtists, topSongs };
}

// ─── Server action: fetch the logged-in user's taste profile ──────────────────

/**
 * Returns the current user's cached taste profile from the DB.
 * If the profile doesn't exist, returns empty arrays.
 *
 * @returns {{ success: boolean, topArtists: Array, topSongs: Array }}
 */
export async function getUserTasteProfileAction() {
    const token = await getAuthToken();
    if (!token) return { success: false, topArtists: [], topSongs: [] };

    try {
        const decoded = await verifyAuthToken(token);
        if (!decoded?.id) return { success: false, topArtists: [], topSongs: [] };

        await connectDB();

        const profile = await TasteProfile.findOne({ userId: decoded.id }).lean();
        if (!profile?.topArtists?.length && !profile?.topSongs?.length) {
            return { success: true, topArtists: [], topSongs: [] };
        }

        return {
            success: true,
            topArtists: profile.topArtists || [],
            topSongs: profile.topSongs || [],
        };
    } catch (error) {
        console.error('getUserTasteProfileAction error:', error);
        return { success: false, topArtists: [], topSongs: [] };
    }
}

// ─── Recompute all users (called by cron route) ──────────────────────────────

/**
 * Iterates every user and recomputes their taste profile.
 * Returns a count of profiles updated.
 *
 * @returns {Promise<{ updated: number }>}
 */
export async function recomputeAllTasteProfiles() {
    await connectDB();

    const userIds = await User.distinct('_id');
    let updated = 0;

    for (const userId of userIds) {
        try {
            const result = await computeTasteProfile(userId);
            if (result) updated++;
        } catch (err) {
            console.error('recomputeAllTasteProfiles error for user', userId, err);
        }
    }

    return { updated };
}
