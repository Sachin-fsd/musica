'use server'

export async function SearchGlobalAction(song) {
    // console.log("song",song)
    try {
        const response = await fetch(`https://saavn-api-two.vercel.app/api/search?query=${encodeURIComponent(song)}`);

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
        const response = await fetch(`https://saavn-api-two.vercel.app/api/search/songs?query=${encodeURIComponent(songId)}`);

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


        const response = await fetch(`https://saavn-api-two.vercel.app/api/songs/${songId}/suggestions`);
        if (!response.ok) {
            throw new Error('Failed to fetch songs');
        }
        const data = await response.json();

        if (data.success) {
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


export async function GetAlbumSongsByIdAction(albumId) {
    try {

        const response = await fetch(`https://saavn-api-two.vercel.app/api/albums?id=${albumId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch songs');
        }
        const data = await response.json();

        if (data.success) {
            return data;
        }
        return {
            msg: "Not Found",
            ok: false
        };
    } catch (error) {
        console.error('Error fetching songs:', error);
        return {
            msg: "Song Not Found",
            ok: false
        }
    }
}


export async function GetSongsByIdAction(type, id) {
    try {
        if (type === "song") {
            const response = await fetch(`https://saavn-api-two.vercel.app/api/${type}s/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch songs');
            }
            const data = await response.json();

            if (data.success) {
                return data;
            }
            return {
                msg: "Not Found",
                ok: false
            };
        }

        // console.log("server",type,id)
        const response = await fetch(`https://saavn-api-two.vercel.app/api/${type}s?id=${id}`);
        // console.log(response)
        if (!response.ok) {
            throw new Error('Failed to fetch songs');
        }
        const data = await response.json();

        if (data.success) {
            return data;
        }
        return {
            msg: "Not Found",
            ok: false
        };
    } catch (error) {
        console.error('Error fetching songs:', error);
        return {
            msg: "Song Not Found",
            ok: false
        }
    }
}



export async function fetchAlbumsByLinkAction(link) {
    try {
        // const response = await fetch(`${BASE_URL}/api/trending-albums?link=${link}`);
        const response = await fetch(link)
        // const contentType = response.headers.get("content-type");
        // if (!response.ok || !contentType || !contentType.includes("application/json")) {
        //     console.error('Unexpected response format:', await response.text());
        //     return null;
        // }
        // console.log(response)
        const data = await response.json();
        // console.log("data",data)

        return data;
    } catch (error) {
        console.error('Error fetching trending albums:', error);
        return null;
    }
}