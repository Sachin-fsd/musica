import { GetSongsByIdAction } from "@/app/actions";

export async function playAndFetchSuggestions(song, context) {
    try {
        const { setCurrentIndex, setCurrentSong, setSongList, songList, setPlaying, audioRef, setCurrentId, currentSong, currentIndex } = context;

        const clickedSongIndex = songList.findIndex(s => s.id === song.id)

        if (clickedSongIndex !== -1) {
            let updatedList = [...songList];
            updatedList.splice(clickedSongIndex, 1);
            const currentSongIndex = updatedList.findIndex(s => s.id === currentSong.id);
            updatedList = [...updatedList.slice(0, currentSongIndex + 1), song];
            setSongList(updatedList);
            setCurrentIndex(updatedList.length - 1);
            setCurrentSong(song);
            setPlaying(true);
            setCurrentId(song.id);
        } else {
            setSongList((prevList) => [...prevList.slice(0, currentIndex + 1), song])
            setCurrentIndex(currentIndex + 1);
            setCurrentSong(song);
            setPlaying(true);
            setCurrentId(song.id);
        }

        return { msg: "ok", ok: true }

    } catch (error) {
        console.log(error);
        return {
            msg: "Songs Not Found",
            ok: false
        }
    }
}


export const fetchAlbumSongs = async (type, id, context) => {
    try {
        const {currentSong,currentIndex ,songList, setSongList, setCurrentIndex, setCurrentSong, setPlaying, setCurrentId} = context
        const data = await GetSongsByIdAction(type, id);

        if (data.success) {
            let albumSongs = data.data.songs || data.data.topSongs || data.data;
            const currentSongIndex = songList.findIndex(s=>s.id===currentSong.id);

            console.log("updatedList1",songList,currentIndex, currentSongIndex)
            let updatedList = songList.slice(0,currentSongIndex+1);
            console.log("updatedList2",updatedList)
            console.log("albumSongs1",albumSongs, data)
            albumSongs = albumSongs.filter(
                albumSong => !updatedList.some(song=>song.id===albumSong.id)
            )
            console.log("albumSongs2",albumSongs)
            let firstAlbumSong = albumSongs[0];
            updatedList = [...updatedList, ...albumSongs]
            
            let currentSongIndextoPlay = updatedList.findIndex(s=>s.id===firstAlbumSong.id);
            console.log("last",updatedList,currentSongIndextoPlay)
            setSongList(updatedList);
            setCurrentIndex(currentSongIndextoPlay);
            setCurrentSong(updatedList[currentSongIndextoPlay]);
            setPlaying(true);
            setCurrentId(updatedList[currentSongIndextoPlay].id);

        }
    } catch (error) {
        console.error("Error fetching album songs:", error);
    }
};