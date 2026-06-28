'use server';

import { connectDB } from '@/lib/mongodb';
import Interaction from '@/models/Interaction';
import { getAuthToken, verifyAuthToken } from './auth';

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
        } else {
            await Interaction.deleteOne({ userId, songId, type: 'liked' });
        }

        return { success: true };
    } catch (error) {
        console.error('persistLikeAction error:', error);
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