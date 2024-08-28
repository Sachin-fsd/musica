import { SearchSongSuggestionAction } from "@/app/actions";


export async function playAndFetchSuggestions(song, context) {
    try {
        const { setCurrentIndex, setCurrentSong, setSongList, songList, setPlaying, audioRef, setCurrentId, currentSong,currentIndex } = context;

        // const currentSongIndex = songList.findIndex(s=>s.id===currentSong.id);


            setSongList((prevList)=>[...prevList.slice(0,currentIndex+1), song])
            setCurrentIndex(currentIndex+1);
            setCurrentSong(song);
            setPlaying(true);
            setCurrentId(song.id);

        

        return { msg: "ok", ok: true }

    } catch (error) {
        console.log(error);
        return {
            msg: "Songs Not Found",
            ok: false
        }
    }
}
