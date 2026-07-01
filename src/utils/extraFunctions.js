import { SearchSongSuggestionAction } from "@/app/actions";

const QUALITY_ORDER = { low: 0, medium: 1, average: 2, high: 3, very_high: 4 };

export function getQualityUrl(song, manualQuality) {
    const urls = song?.downloadUrl;
    if (!Array.isArray(urls) || urls.length === 0) return null;

    const preferredIndex = QUALITY_ORDER[manualQuality] ?? urls.length - 1;
    const clampedIndex = Math.min(preferredIndex, urls.length - 1);

    // Prefer the requested tier, walking down to a lower one if it's missing
    for (let i = clampedIndex; i >= 0; i--) {
        if (urls[i]?.url) return urls[i].url;
    }
    // As a last resort, walk up to whatever higher tier is available
    for (let i = clampedIndex + 1; i < urls.length; i++) {
        if (urls[i]?.url) return urls[i].url;
    }
    return null;
}

export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index from 0 to i
        const randomIndex = Math.floor(Math.random() * (i + 1));

        // Swap the current element with the random element
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
}

export const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const fetchSuggestions = async (songId, { retries = 2, retryDelayMs = 1500 } = {}) => {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await SearchSongSuggestionAction(songId);
            if (response?.success && response.data?.length > 0) {
                return shuffleArray(response.data);
            }
        } catch (error) {
            console.error("fetchSuggestions attempt failed:", error);
        }
        if (attempt < retries) {
            await new Promise((resolve) => setTimeout(resolve, retryDelayMs * (attempt + 1)));
        }
    }
    return [];
};

// Merges lists and removes duplicates using Map
export const mergeUniqueSongs = (baseList, newSongs) => {
    return [
        ...new Map(
            [...baseList, ...newSongs].map(s => [s.id, s])
        ).values()
    ];
};