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

export async function fetchLyricsAction(artistName, trackName, albumName, duration) {
    const { LYRICS_API_URL } = process.env;
    if (!LYRICS_API_URL) {
        throw new Error("LYRICS_API_URL environment variable is not set.");
    }

    const params = new URLSearchParams({
        artist_name: artistName,
        track_name: trackName,
        album_name: albumName,
        duration: duration.toString()
    });

    const url = `${LYRICS_API_URL}/get?${params}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Lyrics not found');
        }

        const data = await response.json();
        const parsedSynced = parseSyncedLyrics(data.syncedLyrics);

        return {
            synced: parsedSynced,
            plain: data.plainLyrics,
            instrumental: data.instrumental
        };
    } catch (error) {
        console.error('Error fetching lyrics:', error);
        throw new Error(error.message || 'Failed to fetch lyrics');
    }
}