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

export const FetchAllAlbums = async () => {
    const { BACKEND_URL } = process.env;
    if (!BACKEND_URL) {
        throw new Error("BACKEND_URL environment variable is not set.");
    }

    // Construct the query string from the params object
    const url = `${BACKEND_URL}/jiosaavn-data`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            // Catches HTTP errors like 404 or 500
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        return data; // Returns the full successful data object
    } catch (error) {
        console.error(`Error fetching from ${url}:`, error.message);
        return { success: false, message: error.message || 'An unknown error occurred.' };
    }
}

export const SearchSongsAction = (query, page, limit) =>
    apiFetch('/search/songs', { query: encodeURIComponent(query), page, limit });

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

export const fetchArtistSongsAction = (id) =>
    apiFetch(`/artists/${id}/songs`);

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

const tryFetchLyrics = async (artistName, trackName, albumName, duration, lyricsApiUrl) => {
    const params = new URLSearchParams({
        artist_name: artistName,
        track_name: trackName,
        album_name: albumName,
        duration: duration.toString()
    });

    const url = `${lyricsApiUrl}/get?${params}`;
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Musica-App/1.0',
            'Accept': 'application/json'
        }
    });

    if (response.ok) {
        const data = await response.json();
        if (!data.syncedLyrics) return null;
        const parsedSynced = parseSyncedLyrics(data.syncedLyrics);
        return { synced: parsedSynced };
    }

    return null;
};

const searchLyrics = async (currentSong, lyricsApiUrl) => {
    const trackName = currentSong.name || '';
    const albumName = currentSong.album?.name || '';

    try {
        // Attempt 1: Search with song name only
        let searchQuery = encodeURIComponent(trackName);
        let url = `${lyricsApiUrl}/search?q=${searchQuery}`;
        let response = await fetch(url, {
            headers: {
                'User-Agent': 'Musica-App/1.0',
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            const results = await response.json();
            if (Array.isArray(results) && results.length > 0) {
                // Find result with synced lyrics that matches album name
                const matchedByAlbum = results.find(result =>
                    result.syncedLyrics &&
                    result.album &&
                    result.album.toLowerCase() === albumName.toLowerCase()
                );
                if (matchedByAlbum) return matchedByAlbum;
            }
        }

        // Attempt 2: Search with song name + album name
        if (albumName) {
            searchQuery = encodeURIComponent(`${trackName} ${albumName}`);
            url = `${lyricsApiUrl}/search?q=${searchQuery}`;
            response = await fetch(url, {
                headers: {
                    'User-Agent': 'Musica-App/1.0',
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const results = await response.json();
                if (Array.isArray(results) && results.length > 0) {
                    // Find first result with synced lyrics
                    const withSyncedLyrics = results.find(result => result.syncedLyrics);
                    if (withSyncedLyrics) return withSyncedLyrics;
                }
            }
        }

        return null;
    } catch (error) {
        console.error('Error searching lyrics:', error.message);
        return null;
    }
};

export async function fetchLyricsAction(currentSong) {
    const { LYRICS_API_URL } = process.env;
    if (!LYRICS_API_URL) {
        throw new Error("LYRICS_API_URL environment variable is not set.");
    }

    if (!currentSong) {
        throw new Error("No song provided");
    }

    const trackName = currentSong.name || '';
    const albumName = currentSong.album?.name || '';
    const duration = currentSong.duration || 0;
    const primaryArtists = currentSong.artists?.all || [];
    const artistNames = primaryArtists.map(a => a?.name).filter(Boolean);

    try {
        // Try 1: Search API with AI agent filtering
        // console.log('Attempting search API with AI agent...');
        const searchResult = await searchLyrics(currentSong, LYRICS_API_URL);

        if (searchResult && searchResult.syncedLyrics) {
            const parsedSynced = parseSyncedLyrics(searchResult.syncedLyrics);
            return { synced: parsedSynced, id: currentSong.id };
        }

        // Try 2: Fall back to /get with exact match and duration tolerance
        if (artistNames.length > 0) {
            const artistName = artistNames[0];
            const result = await tryFetchLyrics(artistName, trackName, albumName, duration, LYRICS_API_URL);
            if (result) return { ...result, id: currentSong.id };

            // With duration tolerance (±5 seconds)
            for (let durOffset of [-5, 5]) {
                const adjustedDuration = duration + durOffset;
                const result = await tryFetchLyrics(artistName, trackName, albumName, adjustedDuration, LYRICS_API_URL);
                if (result) return { ...result, id: currentSong.id };
            }

            // Try with each additional artist
            if (artistNames.length > 1) {
                for (let i = 1; i < artistNames.length; i++) {
                    const altArtistName = artistNames[i];
                    const result = await tryFetchLyrics(altArtistName, trackName, albumName, duration, LYRICS_API_URL);
                    if (result) return { ...result, id: currentSong.id };

                    // Try with duration tolerance for alternative artists too
                    for (let durOffset of [-5, 5]) {
                        const adjustedDuration = duration + durOffset;
                        const result = await tryFetchLyrics(altArtistName, trackName, albumName, adjustedDuration, LYRICS_API_URL);
                        if (result) return { ...result, id: currentSong.id };
                    }
                }
            }
        }

        throw new Error('Lyrics not found');
    } catch (error) {
        console.error('Error fetching lyrics:', error.message);
    }
}