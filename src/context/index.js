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

    // Function to get the appropriate quality URL based on internet speed
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


    const adjustQualityAndPlay = () => {
        if (currentSong && navigator.connection) {
            const speed = navigator.connection.downlink;
            let qualityUrl;

            if (speed > 3) {
                qualityUrl = currentSong.downloadUrl[4].url;
                setConnectionStatus("Great")
            }
            else if (speed > 1.5) {
                qualityUrl = currentSong.downloadUrl[3].url;
                setConnectionStatus("Best")
            }
            else if (speed > 0.75) {
                qualityUrl = currentSong.downloadUrl[2].url;
                setConnectionStatus("Good")
            
            }
            else if (speed > 0.3) {
                qualityUrl = currentSong.downloadUrl[1].url;
                setConnectionStatus("Poor")
            }
            else {
                qualityUrl = currentSong.downloadUrl[0].url;
                setConnectionStatus("Worst")
            }

            audioRef.current.src = qualityUrl;
            if (playing) audioRef.current.play();
        }
    };

    useEffect(() => {
        if (!currentSong) return;
    
        const handleConnectionChange = () => adjustQualityAndPlay();
    
        // Adjust quality and play when the song changes or the connection changes
        adjustQualityAndPlay();
    
        if (navigator.connection) {
            navigator.connection.addEventListener('change', handleConnectionChange);
            return () => navigator.connection.removeEventListener('change', handleConnectionChange);
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
        setConnectionStatus
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
