import { SearchSongSuggestionAction } from "@/app/actions";


export async function playAndFetchSuggestions(song, context) {
    try {
        const { setCurrentIndex, setCurrentSong, setSongList, songList, setPlaying, audioRef, setCurrentId } = context;

        const songExists = songList.find(s => s.id === song.id);

        // Step 1: Play the clicked song
        if (!songExists) {
            setSongList(prevList => [...prevList, song]);
            setCurrentIndex(songList.length);
            setCurrentSong(song);
            setPlaying(true);
            setCurrentId(song.id);
            // audioRef.current.play();
        } else {
            const existingIndex = songList.findIndex(s => s.id === song.id);
            setCurrentIndex(existingIndex);
            setCurrentSong(songList[existingIndex]);
            setPlaying(true);
            // audioRef.current.play();
        }
        // Step 2: Fetch related songs in the background
        const response = await SearchSongSuggestionAction(song.id);
        // console.log("response related songs",response)
        if (response.success) {
            setSongList(prevList => [song, ...response.data]);
            setCurrentIndex(0)
        }
        // console.log("songList",songList)

    } catch (error) {
        console.log(error);
        return {
            msg: "Songs Not Found",
            ok: false
        }
    }
}
