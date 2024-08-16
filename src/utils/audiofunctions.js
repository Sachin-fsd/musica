

export const togglePlayPause = ({playing, audioRef, setPlaying}) => {
    if (playing) {
        audioRef.current.pause();
    } else {
        audioRef.current?.play();
    }
    setPlaying(!playing);
};