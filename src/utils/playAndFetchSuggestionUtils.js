import { GetSongsByIdAction, SearchSongSuggestionAction } from "@/app/actions";
import { shuffleArray } from "./extraFunctions";
import { songFormat } from "./cachedSongs";

async function fetchRelatedSongs(songId, existingSongs) {
    try {
        const response = await SearchSongSuggestionAction(songId);
        if (response?.success) {
            return shuffleArray(response.data).filter(
                (relatedSong) => !existingSongs.some((existing) => existing.id === relatedSong.id)
            );
        }
    } catch (error) {
        console.warn("Error fetching related songs:", error);
    }
    return [];
}

export async function playAndFetchSuggestions(song, context) {
    const { setCurrentIndex, setCurrentSong, setSongList, songList, setPlaying, setCurrentId, audioRef } = context;

    try {
        audioRef.current.src = song.downloadUrl[4].url;
        audioRef.current.play();

        const isNewSong = !songList.some((s) => s.id === song.id);
        let updatedSongList = isNewSong ? songList.filter(s => !s.old) : songList;

        let blankArr = Array.from({ length: 10 }, () => songFormat);
        if (isNewSong) {
            setSongList([song, ...blankArr, ...updatedSongList]);
        }

        const relatedSongs = isNewSong ? await fetchRelatedSongs(song.id, updatedSongList) : [];
        updatedSongList = isNewSong ? [song, ...relatedSongs, ...updatedSongList] : updatedSongList;

        setSongList(updatedSongList);
        setCurrentIndex(updatedSongList.findIndex((s) => s.id === song.id));
        setCurrentSong(song);
        setPlaying(true);
        setCurrentId(song.id);

        return { msg: "ok", ok: true };
    } catch (error) {
        console.error("Error in playAndFetchSuggestions:", error);
        return { msg: "Songs Not Found", ok: false };
    }
}

export async function fetchAlbumSongs(type, id, context) {
    const { setSongList, setCurrentIndex, setCurrentSong, setPlaying, setCurrentId, songList } = context;

    try {
        const response = await GetSongsByIdAction(type, id);
        if (!response.success) return;

        let albumSongs = response.data.songs || response.data.topSongs || response.data;
        let updatedSongList = songList.filter(s => !s.old);

        albumSongs = albumSongs.filter(song => !updatedSongList.some(existing => existing.id === song.id));
        updatedSongList = [...albumSongs, ...updatedSongList];

        let blankArr = Array.from({ length: 10 }, () => songFormat);
        if (type === "song" && albumSongs.length > 0) {
            setSongList([...albumSongs, ...blankArr, ...updatedSongList]);
        }

        if (type === "song" && albumSongs.length > 0) {
            const relatedSongs = await fetchRelatedSongs(albumSongs[0].id, updatedSongList);
            updatedSongList = [...albumSongs, ...relatedSongs, ...updatedSongList];
        }

        setSongList(updatedSongList);
        setCurrentIndex(0);
        setCurrentSong(albumSongs[0]);
        setPlaying(true);
        setCurrentId(albumSongs[0].id);
    } catch (error) {
        console.error("Error fetching album songs:", error);
    }
}