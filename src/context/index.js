'use client'
import { songs } from "@/utils/cachedSongs";
import { createContext, useRef, useState, useEffect } from "react";

export const UserContext = createContext(null);

export default function UserState({ children }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentSong, setCurrentSong] = useState(null);
    const [currentId, setCurrentId] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLooping, setIsLooping] = useState(false);
    const audioRef = useRef(null);
    const [songList, setSongList] = useState(songs);
    const [loading, setLoading] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState("")


    const handleSeek = (e) => {
        const seekTime = e[0];
        audioRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
    };

    useEffect(() => {
        const handleTimeUpdate = () => {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration);
        };

        audioRef?.current?.addEventListener('timeupdate',handleTimeUpdate );

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
            }
        };
    }, [audioRef.current]);


    useEffect(() => {
        const handleSongEnd = () => {
            if (!isLooping) {
                const nextIndex = (currentIndex + 1) % songList.length;
                setCurrentIndex(nextIndex);
                setCurrentSong(songList[nextIndex]);
                setPlaying(true);
            }
        };

        audioRef?.current?.addEventListener('ended', handleSongEnd);

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('ended', handleSongEnd);
            }
        };
    }, [isLooping, currentIndex, songList, setCurrentIndex, setCurrentSong]);


    const determineConnectionStatus = (speed) => {
        if (speed > 3) return "Great";
        if (speed > 1.5) return "Best";
        if (speed > 0.75) return "Good";
        if (speed > 0.3) return "Poor";
        return "Worst";
    };

    const adjustQuality = () => {
        if (!currentSong || !navigator.connection) return;
        const speed = navigator.connection.downlink;
        const qualityUrl = speed > 3 ? currentSong.downloadUrl[4].url
            : speed > 1.5 ? currentSong.downloadUrl[3].url
                : speed > 0.75 ? currentSong.downloadUrl[2].url
                    : speed > 0.3 ? currentSong.downloadUrl[1].url
                        : currentSong.downloadUrl[0].url;

        setConnectionStatus(determineConnectionStatus(speed));
        return qualityUrl;
    };

    useEffect(() => {
        if (!currentSong) return;

        //chnage the title as song changes;

        // Adjust quality only when the song changes
        const qualityUrl = adjustQuality();
        if (qualityUrl) audioRef.current.src = qualityUrl;
        if (navigator.connection) {
            setConnectionStatus(determineConnectionStatus(navigator.connection.downlink));
        }

        // Prevent song from auto-playing when paused
        if (playing) {
            audioRef.current.play();
        }

    }, [currentSong]);

    useEffect(() => {
        if (currentSong && playing) {
            document.title = `${currentSong?.name} - Musica NextGen`;
        } else {
            document.title = `Musica NextGen Music`;
        }

        if ("mediaSession" in navigator) {
            navigator.mediaSession.playbackState = playing ? "playing" : "paused";
          }
    }, [playing])

    useEffect(() => {
        if ("mediaSession" in navigator && currentSong) {

            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentSong.name,
                artist: currentSong.artists.primary[0].name,
                album: currentSong.album?.name,
                artwork: [
                    {
                        src: currentSong.image[2].url, // URL to the song's image
                        sizes: "500x500", // Image size
                        type: "image/jpg", // Or image/jpeg depending on your file
                    },
                ],
            });

            // Set media controls for play, pause, etc.
            navigator.mediaSession.setActionHandler("play", () => {
                audioRef.current.play();
                setPlaying(true);
            });
            navigator.mediaSession.setActionHandler("pause", () => {
                audioRef.current.pause();
                setPlaying(false);
            });
            navigator.mediaSession.setActionHandler("seekbackward", () => {
                audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
            });
            navigator.mediaSession.setActionHandler("seekforward", () => {
                audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, audioRef.current.duration);
            });
        }
    }, [currentSong]);

    let value = {
        currentSong,
        setCurrentSong,
        playing,
        setPlaying,
        currentTime,
        setCurrentTime,
        duration,
        setDuration,
        isLooping,
        setIsLooping,
        audioRef,
        handleSeek,
        currentIndex,
        setCurrentIndex,
        setSongList,
        songList,
        currentId,
        setCurrentId,
        loading,
        setLoading,
        connectionStatus,
        setConnectionStatus,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
            <audio
                ref={audioRef}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onLoadedData={() => {
                    // audioRef.current.currentTime = currentTime;
                    setDuration(audioRef.current.duration)}}
                loop={isLooping}
            />
        </UserContext.Provider>
    );
}
