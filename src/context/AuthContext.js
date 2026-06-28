'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getCurrentUserAction, logoutAction } from '@/app/actions/auth';
import { getLikedSongIdsAction, persistLikeAction } from '@/app/actions/interactions';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    // Client-side Set of liked songIds — the single source of truth for the UI.
    // Never read from DB on each song; read from this Set instantly.
    const [likedSongIds, setLikedSongIds] = useState(new Set());

    // ── Hydrate user on mount — liked IDs load separately, don't block this ─
    useEffect(() => {
        getCurrentUserAction().then((res) => {
            if (res.success && res.user) setUser(res.user);
        }).finally(() => setAuthLoading(false));
        // NOTE: liked IDs are fetched by the effect below, which watches user.id.
        // authLoading becomes false as soon as we know who the user is (or isn't).
    }, []);

    // ── Re-fetch liked IDs whenever user changes (login / logout) ───────────
    useEffect(() => {
        if (!user) {
            setLikedSongIds(new Set()); // clear on logout
            return;
        }
        getLikedSongIdsAction().then(({ songIds }) => {
            setLikedSongIds(new Set(songIds));
        });
    }, [user?.id]);

    // ── Toggle like — instant UI, fire-and-forget DB sync ───────────────────
    const toggleLike = useCallback((song) => {
        if (!song?.id) return;

        const isLiked = likedSongIds.has(song.id);
        const newLiked = !isLiked;

        // 1. Update client Set immediately — UI reacts to this
        setLikedSongIds((prev) => {
            const next = new Set(prev);
            if (newLiked) next.add(song.id);
            else next.delete(song.id);
            return next;
        });

        // 2. Fire and forget — DB catches up in the background
        const meta = {
            name: song.name || '',
            image: song.image?.[0]?.url || '',
            primaryArtist: song.artists?.primary?.[0]?.name || '',
            duration: song.duration || 0,
        };
        persistLikeAction(song.id, newLiked, meta).catch((err) =>
            console.error('persistLikeAction failed silently:', err)
        );

        return newLiked; // so LikeButton can show a toast
    }, [likedSongIds]);

    const logout = useCallback(async () => {
        await logoutAction();
        setUser(null);
        // likedSongIds cleared by the user effect above
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, authLoading, logout, likedSongIds, toggleLike }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}