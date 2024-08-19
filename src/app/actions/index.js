
export async function SearchGlobalAction(song) {
    // console.log("song",song)
    try {
        const response = await fetch(`https://saavn.dev/api/search?query=${encodeURIComponent(song)}`);

        if (!response.ok) {
            throw new Error('Failed to fetch songs');
        }

        const data = await response.json(); // Parse JSON data from response
        if (!data.success) {
            return null
        }
        // console.log("data",data)

        return data; // Return the parsed data
    } catch (error) {
        console.error('Error fetching songs:', error);
        return {
            msg: "Song Not Found",
            ok: false
        } // Return null or handle error state as needed
    }
}


export async function SearchSongsAction(songId) {
    // console.log("local env",process.env.FETCH_SONG_URL)
    try {
        const response = await fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(songId)}`);

        if (!response.ok) {
            throw new Error('Failed to fetch songs');
        }

        const data = await response.json(); // Parse JSON data from response
        if (!data.success) {
            return null
        }
        // console.log("data",data)

        return data; // Return the parsed data
    } catch (error) {
        console.error('Error fetching songs:', error);
        return {
            msg: "Song Not Found",
            ok: false
        } // Return null or handle error state as needed
    }
}
export async function SearchSongSuggestionAction(songId) {
    try {
        const cacheKey = `songSuggestions_${songId}`;
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        const response = await fetch(`https://saavn.dev/api/songs/${songId}/suggestions`);
        if (!response.ok) {
            throw new Error('Failed to fetch songs');
        }
        const data = await response.json();

        if (data.success) {
            localStorage.setItem(cacheKey, JSON.stringify(data));
            return data;
        }
        return null;
    } catch (error) {
        console.error('Error fetching songs:', error);
        return {
            msg: "Song Not Found",
            ok: false
        }
    }
}