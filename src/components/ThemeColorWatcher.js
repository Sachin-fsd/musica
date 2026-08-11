'use client';

import { useContext, useEffect } from 'react';
import { UserContext } from '@/context';
import { useThemeColorStore } from '@/store/useThemeColorStore';
import { extractThemeColor } from '@/utils/themeColor';

// Cache extracted colors per artwork URL — no re-work when a song is replayed.
const colorCache = new Map();

// Watches the currently playing song and derives a theme color from its
// artwork. Renders nothing; it only feeds the theme color store + CSS vars.
const ThemeColorWatcher = () => {
    const { currentSong } = useContext(UserContext);
    const setThemeColor = useThemeColorStore((s) => s.setThemeColor);

    const imageUrl = currentSong?.image?.[1]?.url || currentSong?.image?.[2]?.url;

    useEffect(() => {
        if (!imageUrl) return;

        if (colorCache.has(imageUrl)) {
            setThemeColor(colorCache.get(imageUrl));
            return;
        }

        let cancelled = false;
        const img = new Image();
        img.crossOrigin = 'anonymous'; // needed for canvas pixel reads
        img.onload = () => {
            if (cancelled) return;
            const hex = extractThemeColor(img);
            if (!hex) return; // no vivid pixel found — keep previous theme
            colorCache.set(imageUrl, hex);
            setThemeColor(hex);
        };
        img.onerror = () => {}; // CORS/load failure — keep previous theme
        img.src = imageUrl;

        return () => {
            cancelled = true;
        };
    }, [imageUrl, setThemeColor]);

    return null;
};

export default ThemeColorWatcher;
