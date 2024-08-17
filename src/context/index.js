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

    const handleSeek = (e) => {
        const seekTime = e[0];
        audioRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
    };

    // Function to get the appropriate quality URL based on internet speed
    const getQualityUrl = (song) => {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        // console.log("connection",connection)
        const speed = connection ? connection.downlink : 10; // Assume 10 Mbps if unable to detect
        // console.log("speed",speed)
        if (speed > 3) {
            return song.downloadUrl[4].url; // 320kbps
        } else if (speed > 1.5) {
            return song.downloadUrl[3].url; // 160kbps
        } else if (speed > 0.75) {
            return song.downloadUrl[2].url; // 96kbps
        } else if (speed > 0.3) {
            return song.downloadUrl[1].url; // 48kbps
        } else {
            return song.downloadUrl[0].url; // 12kbps
        }
    };

    useEffect(() => {
        const handleTimeUpdate = () => {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration);
        };

        audioRef?.current?.addEventListener('timeupdate', handleTimeUpdate);

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

    useEffect(() => {
        if (currentSong) {
            try {
                const qualityUrl = getQualityUrl(currentSong);
                audioRef.current.src = qualityUrl;
                if (playing) {
                    audioRef.current.play();
                } else {
                    audioRef.current.pause();
                }
            } catch (error) {
                console.error("Error playing the song:", error);
                setPlaying(false);
            }
        }
    }, [currentSong]);

    useEffect(() => {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

        const updateSongQuality = () => {
            if (currentSong && connection) {
                let qualityUrl;
                if (connection.downlink > 2) { // High speed
                    qualityUrl = currentSong.downloadUrl.find(urlObj => urlObj.quality === "320kbps")?.url;
                } else if (connection.downlink > 1) { // Medium speed
                    qualityUrl = currentSong.downloadUrl.find(urlObj => urlObj.quality === "160kbps")?.url;
                } else if (connection.downlink > 0.5) { // Low speed
                    qualityUrl = currentSong.downloadUrl.find(urlObj => urlObj.quality === "96kbps")?.url;
                } else { // Very low speed
                    qualityUrl = currentSong.downloadUrl.find(urlObj => urlObj.quality === "12kbps")?.url;
                }

                if (qualityUrl) {
                    audioRef.current.src = qualityUrl;
                    if (playing) {
                        audioRef.current.play();
                    }
                }
            }
        };

        // Initial quality adjustment
        updateSongQuality();

        // Listen for changes in the connection
        if (connection) {
            connection.addEventListener('change', updateSongQuality);
        }

        // Cleanup listener on component unmount
        return () => {
            if (connection) {
                connection.removeEventListener('change', updateSongQuality);
            }
        };
    }, [currentSong, playing, audioRef]);


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
        setLoading
    };

    return (
        <UserContext.Provider value={value}>
            {children}
            <audio
                ref={audioRef}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onLoadedData={() => setDuration(audioRef.current.duration)}
                loop={isLooping}
            />
        </UserContext.Provider>
    );
}
