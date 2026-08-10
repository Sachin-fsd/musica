'use server';

import { connectDB } from '@/lib/mongodb';
import Interaction from '@/models/Interaction';
import Song from '@/models/Song';
import { getAuthToken, verifyAuthToken } from './auth';

const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;

/**
 * Stores or updates song metadata in DB with a TTL expiration set to 6 months from now.
 *
 * @param {object} songData - { songId, id, name, image, primaryArtist, duration, language }
 */
export async function touchSongAction(songData) {
    if (!songData) return { success: false };
    const songId = songData.songId || songData.id;
    if (!songId) return { success: false };

    try {
        await connectDB();

        const name = songData.name || '';
        const image = typeof songData.image === 'string'
            ? songData.image
            : (songData.image?.[2]?.url || songData.image?.[0]?.url || '');
        const primaryArtist = songData.primaryArtist || songData.artists?.primary?.[0]?.name || songData.artists?.all?.[0]?.name || '';
        const duration = songData.duration || 0;
        const language = songData.language || '';
        const expireAt = new Date(Date.now() + SIX_MONTHS_MS);

        await Song.findOneAndUpdate(
            { songId },
            {
                $set: {
                    songId,
                    name,
                    image,
                    primaryArtist,
                    duration,
                    language,
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
 * @param {object}  songMeta  - { name, image, primaryArtist, duration }
 */
export async function persistLikeAction(songId, liked, songMeta = {}) {
    const userId = await getAuthenticatedUserId();
    if (!userId) return { success: false };

    try {
        await connectDB();

        if (liked) {
            // Upsert — safe to call multiple times
            await Interaction.updateOne(
                { userId, songId, type: 'liked' },
                {
                    $setOnInsert: {
                        userId,
                        songId,
                        type: 'liked',
                        songMeta: {
                            name: songMeta.name || '',
                            image: songMeta.image || '',
                            primaryArtist: songMeta.primaryArtist || '',
                            duration: songMeta.duration || 0,
                        },
                    },
                },
                { upsert: true }
            );

            await touchSongAction({ songId, ...songMeta });
        } else {
            await Interaction.deleteOne({ userId, songId, type: 'liked' });
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
 * No metadata is stored; upserted once per (user, song) so replays don't spam.
 *
 * @param {string} songId - JioSaavn song ID
 * @param {object} songMeta - { name, image, primaryArtist, duration }
 */
export async function persistSkippedAction(songId, songMeta = {}) {
    const userId = await getAuthenticatedUserId();
    if (!userId || !songId) return { success: false };

    try {
        await connectDB();

        await Interaction.updateOne(
            { userId, songId, type: 'skipped' },
            {
                $setOnInsert: { userId, songId, type: 'skipped' },
            },
            { upsert: true }
        );

        if (songMeta && (songMeta.name || songMeta.image || songMeta.primaryArtist)) {
            await touchSongAction({ songId, ...songMeta });
        }

        return { success: true };
    } catch (error) {
        console.error('persistSkippedAction error:', error);
        return { success: false };
    }
}

// ─── Completed interaction (listened to ≥90 % of a song) ──────────────────────

/**
 * Records that the user listened to a song past the 90 % completion mark.
 * No metadata is stored; upserted once per (user, song) so replays don't spam.
 *
 * @param {string} songId - JioSaavn song ID
 * @param {object} songMeta - { name, image, primaryArtist, duration }
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
            },
            { upsert: true }
        );

        if (songMeta && (songMeta.name || songMeta.image || songMeta.primaryArtist)) {
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