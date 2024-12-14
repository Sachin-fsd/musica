import { GetSongsByIdAction, SearchSongSuggestionAction } from "@/app/actions";
import { shuffleArray } from "./extraFunctions";
import { songFormat } from "./cachedSongs";

export async function playAndFetchSuggestions(song, context) {
    const {
        setCurrentIndex,
        setCurrentSong,
        setSongList,
        songList,
        setPlaying,
        setCurrentId
    } = context;

    try {
        const clickedSongIndex = songList?.findIndex((s) => s.id === song?.id);
        const isNewSong = clickedSongIndex === -1;
        let NewSongList = songList.filter(s => !s.old );
        console.log("NewSongList",NewSongList)
        let blankArr = Array.from({ length: 10 }, (el) => el = songFormat);

        // Handle new song addition to the list
        if (isNewSong) {
            let updatedSongList = [song, ...blankArr, ...NewSongList];
            setSongList(updatedSongList);
            setCurrentIndex(0);
        } else {
            setCurrentIndex(clickedSongIndex);
        }

        // Set up the current song to play
        setCurrentSong(song);
        setPlaying(true);
        setCurrentId(song?.id);

        // Fetch and add related song suggestions
        const response = await SearchSongSuggestionAction(song?.id);
        if (response.success) {
            const relatedSongs = shuffleArray(response.data).filter(
                (relatedSong) => !songList?.some((existingSong) => existingSong.id === relatedSong.id)
            );
            setSongList(isNewSong ? [song, ...relatedSongs, ...NewSongList] : [...NewSongList, ...relatedSongs]);
        }

        // console.log("Updated Song List:", updatedSongList);
        return { msg: "ok", ok: true };

    } catch (error) {
        console.error("Error in playAndFetchSuggestions:", error);
        return { msg: "Songs Not Found", ok: false };
    }
}

export async function fetchAlbumSongs(type, id, context) {
    const {
        currentSong,
        songList,
        setSongList,
        setCurrentIndex,
        setCurrentSong,
        setPlaying,
        setCurrentId
    } = context;

    try {
        const response = await GetSongsByIdAction(type, id);
        if (response.success) {
            let albumSongs = response.data.songs || response.data.topSongs || response.data;
            const currentSongIndex = songList?.findIndex((s) => s.id === currentSong?.id);

            console.log("Initial Song List:", songList);

            // Remove duplicates from album songs
            albumSongs = albumSongs.filter(
                (albumSong) => !songList?.some((existingSong) => existingSong.id === albumSong.id)
            );

            // Update the song list with album songs
            const updatedSongList = [
                ...songList?.slice(0, currentSongIndex + 1),
                ...albumSongs
            ];
            const firstAlbumSong = albumSongs[0];
            const newIndex = updatedSongList.findIndex((s) => s.id === firstAlbumSong.id);

            setSongList(updatedSongList);
            setCurrentIndex(newIndex);
            setCurrentSong(firstAlbumSong);
            setPlaying(true);
            setCurrentId(firstAlbumSong.id);

            console.log("Updated Song List with Album Songs:", updatedSongList);
        }
    } catch (error) {
        console.error("Error fetching album songs:", error);
    }
}
