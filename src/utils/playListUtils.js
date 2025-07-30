import { GetSongsByIdAction, SearchSongSuggestionAction } from "@/app/actions";
import { shuffleArray } from "./extraFunctions";

/**
 * Creates a new playlist based on a selected song and its suggestions.
 * @param {object} song - The song to play and get suggestions for.
 * @param {Array} currentSongList - The current list of songs.
 * @returns {Promise<Array>} A new playlist array.
 */
export async function createPlaylistFromSuggestions(song, currentSongList) {
    if (!song?.id) return currentSongList;

    // Start with the selected song.
    let newPlaylist = [song];

    // Fetch and add related suggestions.
    const response = await SearchSongSuggestionAction(song.id);
    if (response?.success) {
        const existingIds = new Set(currentSongList.map(s => s.id));
        const suggestions = shuffleArray(response.data).filter(
            (relatedSong) => relatedSong.id !== song.id && !existingIds.has(relatedSong.id)
        );
        newPlaylist.push(...suggestions);
    }

    // Add remaining unique songs from the original list.
    currentSongList.forEach(existingSong => {
        if (existingSong.id !== song.id && !newPlaylist.some(s => s.id === existingSong.id)) {
            newPlaylist.push(existingSong);
        }
    });

    return newPlaylist;
}

/**
 * Creates a new playlist from an album or artist.
 * @param {string} type - The type of entity (e.g., 'album', 'artist').
 * @param {string} id - The ID of the entity.
 * @returns {Promise<{playlist: Array, songToPlay: object}|null>} An object with the new playlist and the first song to play.
 */
export async function createPlaylistFromEntity(type, id) {
    const response = await GetSongsByIdAction(type, id);
    if (response?.success) {
        const songs = response.data.songs || response.data.topSongs || response.data;
        if (Array.isArray(songs) && songs.length > 0) {
            return { playlist: songs, songToPlay: songs[0] };
        }
    }
    return null;
}
