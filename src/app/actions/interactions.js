'use server';

import { connectDB } from '@/lib/mongodb';
import Interaction from '@/models/Interaction';
import Song from '@/models/Song';
import { getAuthToken, verifyAuthToken } from './auth';

const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;

/**
 * Stores or updates song metadata in DB with a TTL expiration set to 6 months from now.
 *
 * @param {object} songData - { songId, id, name, image, primaryArtists, duration, language }
 */
export async function touchSongAction(songMeta) {
    if (!songMeta) return { success: false };
    const songId = songMeta.songId;
    if (!songId) return { success: false };

    try {
        await connectDB();

        const expireAt = new Date(Date.now() + SIX_MONTHS_MS);

        await Song.findOneAndUpdate(
            { songId },
            {
                $set: {
                    songId,
                    name: songMeta.name || '',
                    image: songMeta.image || '',
                    primaryArtists: songMeta.primaryArtists || [],
                    duration: songMeta.duration || 0,
                    language: songMeta.language || '',
                    expireAt,
                },
            },
            { upsert: true, new: true }
        );

        return { success: true };
    } catch (error) {
        console.error('touchSongAction error:', error);
        return { success: false };
    }
}

// ─── Helper ──────────────────────────────────────────────────────────────────

async function getAuthenticatedUserId() {
    const token = await getAuthToken();
    if (!token) return null;
    const decoded = await verifyAuthToken(token);
    return decoded?.id || null;
}

// ─── Boot-time fetch: all liked song IDs ─────────────────────────────────────

/**
 * Called ONCE when the user session hydrates.
 * Returns only the songId strings — lightweight, fast.
 * The client stores these in a Set for O(1) lookups.
 *
 * @returns {{ success: boolean, songIds: string[] }}
 */
export async function getLikedSongIdsAction() {
    const userId = await getAuthenticatedUserId();
    if (!userId) return { success: false, songIds: [] };

    try {
        await connectDB();
        const rows = await Interaction.find({ userId, type: 'liked' })
            .select('songId')
            .lean();
        return { success: true, songIds: rows.map((r) => r.songId) };
    } catch (error) {
        console.error('getLikedSongIdsAction error:', error);
        return { success: false, songIds: [] };
    }
}

// ─── Fire-and-forget toggle ───────────────────────────────────────────────────

/**
 * Persists a like or unlike to the DB.
 * The caller has already updated the UI — this just syncs the DB.
 * Returns { success } only; the caller ignores the return value.
 *
 * @param {string}  songId    - JioSaavn song ID
 * @param {boolean} liked     - the NEW intended state (true = like, false = unlike)
 * @param {object}  songMeta  - { name, image, primaryArtists, duration }
 */
export async function persistLikeAction(liked, songMeta = {}) {
    const userId = await getAuthenticatedUserId();
    if (!userId) return { success: false };

    try {
        await connectDB();

        if (liked) {
            // Upsert — safe to call multiple times; increments count on repeat
            await Interaction.updateOne(
                { userId, songId: songMeta.songId, type: 'liked' },
                {
                    $setOnInsert: {
                        userId,
                        songId: songMeta.songId,
                        type: 'liked',
                    },
                    $inc: { count: 1 },
                },
                { upsert: true }
            );

            await touchSongAction(songMeta);
        } else {
            await Interaction.deleteOne({ userId, songId: songMeta.songId, type: 'liked' });
        }

        return { success: true };
    } catch (error) {
        console.error('persistLikeAction error:', error);
        return { success: false };
    }
}

// ─── Skipped interaction (user changed song within 10 s of play) ─────────────

/**
 * Records that the user skipped a song within 10 seconds of playback.
 * Increments count each time so repeated skips carry more negative weight.
 *
 * @param {string} songId - JioSaavn song ID
 * @param {object} songMeta - { name, image, primaryArtists, duration }
 */
export async function persistSkippedAction(songMeta = {}) {
    const userId = await getAuthenticatedUserId();
    if (!userId || !songMeta.songId) return { success: false };

    try {
        await connectDB();

        await Interaction.updateOne(
            { userId, songId: songMeta.songId, type: 'skipped' },
            {
                $setOnInsert: { userId, songId: songMeta.songId, type: 'skipped' },
                $inc: { count: 1 },
            },
            { upsert: true }
        );

        if (songMeta && (songMeta.name || songMeta.image)) {
            await touchSongAction(songMeta);
        }

        return { success: true };
    } catch (error) {
        console.error('persistSkippedAction error:', error);
        return { success: false };
    }
}

// ─── Replayed interaction (user played an already-listened song again) ─────────

/**
 * Records that the user played a song again that they had already listened to.
 * Increments count each time so replays carry more weight.
 *
 * @param {string} songId - JioSaavn song ID
 * @param {object} songMeta - { name, image, primaryArtists, duration }
 */
export async function persistReplayedAction(songMeta = {}) {
    const userId = await getAuthenticatedUserId();
    if (!userId || !songMeta.songId) return { success: false };

    try {
        await connectDB();

        await Interaction.updateOne(
            { userId, songId: songMeta.songId, type: 'replayed' },
            {
                $setOnInsert: { userId, songId: songMeta.songId, type: 'replayed' },
                $inc: { count: 1 },
            },
            { upsert: true }
        );

        if (songMeta && (songMeta.name || songMeta.image)) {
            await touchSongAction(songMeta);
        }

        return { success: true };
    } catch (error) {
        console.error('persistReplayedAction error:', error);
        return { success: false };
    }
}

// ─── Searched interaction (user played a song from search results) ────────────

/**
 * Records that the user played a song directly from search results, signalling
 * interest in that song. Increments count each time so repeated plays carry more weight.
 *
 * @param {string} songId - JioSaavn song ID
 * @param {object} songMeta - { name, image, primaryArtists, duration }
 */
export async function persistSearchedAction(songId, songMeta = {}) {
    const userId = await getAuthenticatedUserId();
    if (!userId || !songId) return { success: false };

    try {
        await connectDB();

        await Interaction.updateOne(
            { userId, songId, type: 'searched' },
            {
                $setOnInsert: { userId, songId, type: 'searched' },
                $inc: { count: 1 },
            },
            { upsert: true }
        );

        if (songMeta && (songMeta.name || songMeta.image)) {
            await touchSongAction({ songId, ...songMeta });
        }

        return { success: true };
    } catch (error) {
        console.error('persistSearchedAction error:', error);
        return { success: false };
    }
}

// ─── Completed interaction (listened to ≥90 % of a song) ──────────────────────

/**
 * Records that the user listened to a song past the 90 % completion mark.
 * Increments count each time so repeated completions carry more weight.
 *
 * @param {string} songId - JioSaavn song ID
 * @param {object} songMeta - { name, image, primaryArtists, duration }
 */
export async function persistCompletedAction(songId, songMeta = {}) {
    const userId = await getAuthenticatedUserId();
    if (!userId || !songId) return { success: false };

    try {
        await connectDB();

        await Interaction.updateOne(
            { userId, songId, type: 'completed' },
            {
                $setOnInsert: { userId, songId, type: 'completed' },
                $inc: { count: 1 },
            },
            { upsert: true }
        );

        if (songMeta && (songMeta.name || songMeta.image)) {
            await touchSongAction({ songId, ...songMeta });
        }

        return { success: true };
    } catch (error) {
        console.error('persistCompletedAction error:', error);
        return { success: false };
    }
}

// ─── Liked songs list (for a future "Liked Songs" page) ──────────────────────

/**
 * Returns full metadata for all liked songs, newest first.
 *
 * @returns {{ success: boolean, songs: Array }}
 */
export async function getLikedSongsAction() {
    const userId = await getAuthenticatedUserId();
    if (!userId) return { success: false, songs: [] };

    try {
        await connectDB();
        const interactions = await Interaction.find({ userId, type: 'liked' })
            .sort({ createdAt: -1 })
            .lean();

        return {
            success: true,
            songs: interactions.map((i) => ({
                songId: i.songId,
                ...i.songMeta,
                likedAt: i.createdAt,
            })),
        };
    } catch (error) {
        console.error('getLikedSongsAction error:', error);
        return { success: false, songs: [] };
    }
}