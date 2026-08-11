import { create } from 'zustand';
import { withAlpha, mixColor } from '@/utils/themeColor';

export const DEFAULT_THEME_COLOR = '#d946ef'; // existing brand fuchsia until a song plays

// Apply the theme color + its derived shades as CSS variables on <html>.
// This is what makes the color reusable anywhere (hero, search, artists,
// and later backgrounds) without recomputing rgba() variants.
function applyThemeVars(hex) {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.style.setProperty('--song-theme', hex);
    root.style.setProperty('--song-theme-strong', withAlpha(hex, 0.85));
    root.style.setProperty('--song-theme-mid', withAlpha(hex, 0.5));
    root.style.setProperty('--song-theme-soft', withAlpha(hex, 0.3));
    root.style.setProperty('--song-theme-faint', withAlpha(hex, 0.12));
    root.style.setProperty('--song-theme-light', mixColor(hex, '#ffffff', 0.4));
    root.style.setProperty('--song-theme-dark', mixColor(hex, '#000000', 0.5));
}

export const useThemeColorStore = create((set) => ({
    themeColor: DEFAULT_THEME_COLOR,
    setThemeColor: (hex) => {
        if (!hex) return;
        applyThemeVars(hex);
        set({ themeColor: hex });
    },
}));
