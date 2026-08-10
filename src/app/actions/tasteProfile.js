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

// ─── Compute taste profile for a single user ─────────────────────────────────

/**
 * Aggregates all interactions + song metadata for the given user and persists
 * the top-artist taste profile.  Called by the daily cron API route.
 *
 * @param  {string} userId - MongoDB ObjectId of the user
 * @returns {Promise<{ topArtists: Array } | null>}
 */
export async function computeTasteProfile(userId) {
    await connectDB();

    const interactions = await Interaction.find({ userId }).lean();
    if (interactions.length < 5) return null;
    // Fetch all songs the user has interacted with
    const songIds = [...new Set(interactions.map((i) => i.songId))];
    const songs = await Song.find({ songId: { $in: songIds } }).lean();
    const songMap = Object.fromEntries(songs.map((s) => [s.songId, s]));

    // Accumulate score per artist (identified by artistId).
    // Also track the best thumbnailUrl seen so far for each artist.
    const artistMap = {}; // artistId -> { artist, image, score }

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
    console.log(artistMap);
    const topArtists = Object.values(artistMap)
        .filter((a) => a.score > 0 && a.image)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

    if (!topArtists.length) return null;

    await TasteProfile.findOneAndUpdate(
        { userId },
        { $set: { topArtists, computedAt: new Date() } },
        { upsert: true }
    );

    return { topArtists };
}

// ─── Server action: fetch the logged-in user's taste profile ──────────────────

/**
 * Returns the current user's cached taste profile from the DB.
 * If the profile doesn't exist or has no topArtists, returns an empty array.
 *
 * @returns {{ success: boolean, topArtists: Array }}
 */
export async function getUserTasteProfileAction() {
    const token = await getAuthToken();
    if (!token) return { success: false, topArtists: [] };

    try {
        const decoded = await verifyAuthToken(token);
        if (!decoded?.id) return { success: false, topArtists: [] };

        await connectDB();

        const profile = await TasteProfile.findOne({ userId: decoded.id }).lean();
        if (!profile?.topArtists?.length) return { success: true, topArtists: [] };

        return { success: true, topArtists: profile.topArtists };
    } catch (error) {
        console.error('getUserTasteProfileAction error:', error);
        return { success: false, topArtists: [] };
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
