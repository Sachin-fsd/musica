'use server'

export async function SearchGlobalAction(query) {
    try {
        const response = await fetch(`${process.env.FETCH_URL}/search?query=${encodeURIComponent(query)}`);

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
    // console.log("local env",process.env.FETCH_URL)
    try {
        const response = await fetch(`${process.env.FETCH_URL}/search/songs?query=${encodeURIComponent(songId)}`);

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


        const response = await fetch(`${process.env.FETCH_URL}/songs/${songId}/suggestions`);
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

        const response = await fetch(`${process.env.FETCH_URL}/albums?id=${albumId}`);
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
            const response = await fetch(`${process.env.FETCH_URL}/${type}s/${id}`);
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
        const response = await fetch(`${process.env.FETCH_URL}/${type}s?id=${id}`);
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

export async function fetchByLinkAction(link) {
    try {
        const response = await fetch(link, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
        // const contentType = response.headers.get("content-type");
        // if (!response.ok || !contentType || !contentType.includes("application/json")) {
        //     console.error('Unexpected response format:', await response.text());
        //     return null;
        // }
        // console.log(response)
        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error fetching trending albums:', error);
        return null;
    }
}

export async function fetchArtistsByPermaLinkAction(link) {
    try {

        const response = await fetch(`${process.env.FETCH_URL}/artists?link=${link}`);
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

//for playlists

export async function fetchPlaylistsByIdAction(playlistId) {
    try {

        const response = await fetch(`${process.env.FETCH_URL}/playlists?id=${playlistId}`);
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

// export async function fetchPlaylistsByIdAction(id) {
//     try {
//         const response = await fetch(id, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json',
//             }
//         })
//         // const contentType = response.headers.get("content-type");
//         // if (!response.ok || !contentType || !contentType.includes("application/json")) {
//         //     console.error('Unexpected response format:', await response.text());
//         //     return null;
//         // }
//         // console.log(response)
//         const data = await response.json();

//         return data;
//     } catch (error) {
//         console.error('Error fetching trending albums:', error);
//         return null;
//     }
// }