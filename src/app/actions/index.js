'use server'

/**
 * A centralized API fetch helper to handle requests, responses, and errors.
 * @param {string} endpoint - The API endpoint to hit (e.g., '/search/songs').
 * @param {object} [params] - An object of query parameters to be added to the URL.
 * @returns {Promise<object>} - The JSON data from the API or a standard error object.
 */
async function apiFetch(endpoint, params = {}) {
    const { FETCH_URL } = process.env;
    if (!FETCH_URL) {
        throw new Error("FETCH_URL environment variable is not set.");
    }

    // Construct the query string from the params object
    const queryString = new URLSearchParams(params).toString();
    const url = `${FETCH_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            // Catches HTTP errors like 404 or 500
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
            // Handles cases where the API itself returns a failure message
            return { success: false, message: data.msg || 'API returned an unsuccessful response.' };
        }

        return data; // Returns the full successful data object
    } catch (error) {
        console.error(`Error fetching from ${url}:`, error.message);
        return { success: false, message: error.message || 'An unknown error occurred.' };
    }
}

// --- Action Functions ---

export const SearchGlobalAction = (query) =>
    apiFetch('/search', { query: encodeURIComponent(query) });

export const SearchSongsAction = (query) =>
    apiFetch('/search/songs', { query: encodeURIComponent(query) });

export const SearchSongSuggestionAction = (songId) =>
    apiFetch(`/songs/${songId}/suggestions`);

export const GetAlbumSongsByIdAction = (albumId) =>
    apiFetch('/albums', { id: albumId });

export const GetSongsByIdAction = (type, id) => {
    // This action has special URL formatting based on type
    if (type === 'song') {
        return apiFetch(`/songs/${id}`);
    }
    return apiFetch(`/${type}s`, { id: id });
};

export const fetchArtistsByPermaLinkAction = (link) =>
    apiFetch('/artists', { link });

export const fetchPlaylistsByIdAction = (playlistId) =>
    apiFetch('/playlists', { id: playlistId });

/**
 * Fetches data directly from a full URL. Use for external or pre-signed URLs.
 * @param {string} link - The full URL to fetch.
 * @returns {Promise<object|null>}
 */
export async function fetchByLinkAction(link) {
    try {
        const response = await fetch(link, {
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Request to link failed with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching by link:', error);
        return null;
    }
}

// Parse synced lyrics into array of {time, text}
const parseSyncedLyrics = (syncedLyrics) => {
    if (!syncedLyrics) return null;
    const lines = syncedLyrics.split('\n').filter(line => line.trim());
    return lines.map(line => {
        const match = line.match(/\[(\d+):(\d+\.\d+)\]\s*(.*)/);
        if (match) {
            const minutes = parseInt(match[1]);
            const seconds = parseFloat(match[2]);
            const time = minutes * 60 + seconds;
            return { time, text: match[3] };
        }
        return null;
    }).filter(Boolean);
};

// Simple string similarity score (0-1)
const calculateSimilarity = (str1, str2) => {
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();

    if (s1 === s2) return 1;

    // Remove common punctuation and extra spaces
    const clean1 = s1.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
    const clean2 = s2.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');

    if (clean1 === clean2) return 0.95;

    // Levenshtein distance approach for partial matches
    const longer = clean1.length > clean2.length ? clean1 : clean2;
    const shorter = clean1.length > clean2.length ? clean2 : clean1;

    if (longer.length === 0) return 1;

    const editDistance = getEditDistance(shorter, longer);
    return (longer.length - editDistance) / longer.length;
};

// Calculate edit distance for fuzzy matching
const getEditDistance = (s1, s2) => {
    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0) {
                costs[j] = j;
            } else if (j > 0) {
                let newValue = costs[j - 1];
                if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                    newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                }
                costs[j - 1] = lastValue;
                lastValue = newValue;
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
};

// Calculate match score for a song result
const calculateMatchScore = (result, artistName, trackName, albumName, duration) => {
    let score = 0;

    // Track name match (40% weight)
    const trackSimilarity = calculateSimilarity(result.trackName, trackName);
    score += trackSimilarity * 40;

    // Artist name match (35% weight)
    const artistSimilarity = calculateSimilarity(result.artistName, artistName);
    score += artistSimilarity * 35;

    // Album name match (15% weight) - optional
    let albumSimilarity = 0;
    if (albumName && result.albumName) {
        albumSimilarity = calculateSimilarity(result.albumName, albumName);
    } else if (!albumName && !result.albumName) {
        albumSimilarity = 1;
    }
    score += albumSimilarity * 15;

    // Duration match (10% weight) - allow 3 second tolerance
    const durationDiff = Math.abs(result.duration - duration);
    const durationSimilarity = durationDiff <= 3 ? 1 : Math.max(0, 1 - (durationDiff / 10));
    score += durationSimilarity * 10;

    return score;
};

export async function fetchLyricsAction(artistName, trackName, albumName, duration) {
    const { LYRICS_API_URL } = process.env;
    if (!LYRICS_API_URL) {
        throw new Error("LYRICS_API_URL environment variable is not set.");
    }

    try {
        // Step 1: Try exact match first
        const exactParams = new URLSearchParams({
            artist_name: artistName,
            track_name: trackName,
            album_name: albumName,
            duration: duration.toString()
        });

        const exactUrl = `${LYRICS_API_URL}/get?${exactParams}`;
        const exactResponse = await fetch(exactUrl, {
            headers: {
                'User-Agent': 'Musica-App/1.0',
                'Accept': 'application/json'
            }
        });

        if (exactResponse.ok) {
            const data = await exactResponse.json();
            const parsedSynced = parseSyncedLyrics(data.syncedLyrics);
            return {
                synced: parsedSynced,
                plain: data.plainLyrics,
                instrumental: data.instrumental
            };
        }

        // Step 2: Fall back to search with fuzzy matching
        console.log('Exact match failed, attempting fuzzy search...');

        const searchParams = new URLSearchParams({
            query: `${artistName} ${trackName}`
        });

        const searchUrl = `${LYRICS_API_URL}/search?${searchParams}`;
        const searchResponse = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'Musica-App/1.0',
                'Accept': 'application/json'
            }
        });

        if (!searchResponse.ok) {
            throw new Error(`Lyrics search failed (${searchResponse.status})`);
        }

        const results = await searchResponse.json();

        if (!Array.isArray(results) || results.length === 0) {
            throw new Error('No search results found');
        }

        // Find best match based on scoring algorithm
        const scoredResults = results.map(result => ({
            ...result,
            matchScore: calculateMatchScore(result, artistName, trackName, albumName, duration)
        }));

        // Sort by score descending
        scoredResults.sort((a, b) => b.matchScore - a.matchScore);

        const bestMatch = scoredResults[0];

        console.log(`Fuzzy match found with score ${bestMatch.matchScore.toFixed(2)}:`, {
            track: bestMatch.trackName,
            artist: bestMatch.artistName,
            album: bestMatch.albumName,
            duration: bestMatch.duration
        });

        const parsedSynced = parseSyncedLyrics(bestMatch.syncedLyrics);
        return {
            synced: parsedSynced,
            plain: bestMatch.plainLyrics,
            instrumental: bestMatch.instrumental
        };

    } catch (error) {
        console.error('Error fetching lyrics:', error.message);
    }
}