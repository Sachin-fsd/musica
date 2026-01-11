import { create } from 'zustand';

export const useLyricsStore = create((set, get) => ({
    lyricsCache: {}, // songId -> lyrics object
    getLyrics: (songId) => get().lyricsCache[songId],
    setLyrics: (songId, lyrics) => set({
        lyricsCache: { [songId]: lyrics } // Only keep current song's lyrics
    }),
    clearLyrics: () => set({ lyricsCache: {} }),
}));