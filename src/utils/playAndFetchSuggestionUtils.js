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
        setCurrentId,
        audioRef
    } = context;

    try {
        audioRef.current.src = song.downloadUrl[4].url;
        audioRef.current.play();
        const clickedSongIndex = songList?.findIndex((s) => s.id === song?.id);
        const isNewSong = clickedSongIndex === -1;
        let NewSongList = songList.filter(s => !s.old);
        // console.log("NewSongList",NewSongList)
        let blankArr = Array.from({ length: 10 }, (el) => el = songFormat);

        // Handle new song addition to the list
        if (isNewSong) {
            let updatedSongList = [song, ...blankArr, ...NewSongList];
            setSongList(updatedSongList);
            setCurrentIndex(0);
        } else {
            setCurrentIndex(songList?.findIndex((s) => s.id === song?.id));
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
            let updatedSongListCurrent = songList.filter(s => !s.old);

            // Remove duplicates from album songs
            updatedSongListCurrent = updatedSongListCurrent.filter(
                (existingSong) => !albumSongs?.some((albumSong) => existingSong.id === albumSong.id)
            );

            // Update the song list with album songs
            const updatedSongList = [...albumSongs, ...updatedSongListCurrent];

            setSongList(updatedSongList);
            setCurrentIndex(0);
            setCurrentSong(albumSongs[0]);
            setPlaying(true);
            setCurrentId(albumSongs[0].id);

            // console.log("Updated Song List with Album Songs:", updatedSongList);
        }
    } catch (error) {
        console.error("Error fetching album songs:", error);
    }
}
