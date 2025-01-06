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
        // Play the song immediately
        // audioRef.current.src = song.downloadUrl[4].url;
        // audioRef.current.play();
        setPlaying(true); // Update playing state
        setCurrentSong(song);
        setCurrentId(song?.id);

        // Update song index
        const clickedSongIndex = songList?.findIndex((s) => s.id === song?.id);
        const isNewSong = clickedSongIndex === -1;
        setCurrentIndex(isNewSong ? 0 : clickedSongIndex);

        // Fetch and update the song list asynchronously
        const relatedSongsPromise = SearchSongSuggestionAction(song?.id);

        let updatedSongList = songList.filter((s) => !s.old);
        if (isNewSong) {
            updatedSongList = [song, ...Array(10).fill(songFormat), ...updatedSongList];
        }

        setSongList(updatedSongList); // Update song list with placeholder items

        // Process suggestions when available
        const response = await relatedSongsPromise;
        if (response.success) {
            const relatedSongs = shuffleArray(response.data).filter(
                (relatedSong) => !updatedSongList.some((existingSong) => existingSong.id === relatedSong.id)
            );
            setSongList([...updatedSongList, ...relatedSongs]);
        }

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
