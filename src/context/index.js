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
    const [loading, setLoading] = useState(false)

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
                audioRef.current.src = currentSong.downloadUrl[4].url;
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
