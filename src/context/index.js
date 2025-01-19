'use client';

import { SearchSongSuggestionAction } from "@/app/actions";
import { songs } from "@/utils/cachedSongs";
import { shuffleArray } from "@/utils/extraFunctions";
import { createContext, useRef, useState, useEffect, useCallback } from "react";

export const UserContext = createContext(null);

export default function UserState({ children }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentSong, setCurrentSong] = useState(songs[0]);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLooping, setIsLooping] = useState(false);
    const [songList, setSongList] = useState(songs);
    const [manualQuality, setManualQuality] = useState("very_high");
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const audioRef = useRef(null);

    const updateAudioSource = useCallback(() => {
        if (!currentSong) return;

        const qualityIndex = {
            low: 0,
            medium: 1,
            average: 2,
            high: 3,
            very_high: 4,
        }[manualQuality];
        const qualityUrl = currentSong?.downloadUrl[qualityIndex]?.url;

        if (audioRef.current && qualityUrl) {
            const wasPlaying = playing;
            const prevTime = audioRef.current.currentTime;

            audioRef.current.src = qualityUrl;
            audioRef.current.load();
            audioRef.current.currentTime = prevTime;

            if (wasPlaying) {
                audioRef.current.play();
            }
        }
    }, [currentSong, manualQuality, playing]);

    // Play/Pause toggle
    const togglePlayPause = useCallback(() => {
        if (playing) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play();
        }
        setPlaying(!playing);
    }, [playing]);

    // Seek functionality
    const handleSeek = useCallback((e) => {
        const seekTime = e[0];
        if (audioRef.current) {
            audioRef.current.currentTime = seekTime;
            setCurrentTime(seekTime);
        }
    }, []);

    // Handle song change
    const changeSong = useCallback((index) => {
        setCurrentIndex(index);
        setCurrentSong(songList[index]);
    }, [songList]);

    // Previous and Next song handlers
    const handlePrev = useCallback(() => {
        const prevIndex = currentIndex === 0 ? songList.length - 1 : currentIndex - 1;
        changeSong(prevIndex);
    }, [currentIndex, songList, changeSong]);

    const handleNext = useCallback(() => {
        const nextIndex = (currentIndex + 1) % songList.length;
        changeSong(nextIndex);
    }, [currentIndex, songList, changeSong]);

    // Auto-fetch related songs when the current song is the last in the list
    useEffect(() => {
        const addRelatedSongs = async () => {
            const currentIndex = songList.findIndex((song) => song.id === currentSong.id);

            if (currentIndex === songList.length - 1) {
                const response = await SearchSongSuggestionAction(currentSong.id);
                if (response.success) {
                    const newSongs = shuffleArray(response.data).filter(
                        (song) => !songList.some((existing) => existing.id === song.id)
                    );
                    setSongList((prev) => [...prev, ...newSongs]);
                }
            }
        };

        if (currentSong) {
            addRelatedSongs();
        }
    }, [currentSong, songList]);

    // Manage media session for play, pause, and metadata
    useEffect(() => {
        if ("mediaSession" in navigator && currentSong) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentSong.name,
                artist: currentSong?.artists?.primary[0]?.name,
                album: currentSong?.album?.name,
                artwork: [{ src: currentSong?.image[2]?.url, sizes: "500x500", type: "image/jpg" }],
            });

            navigator.mediaSession.setActionHandler("play", togglePlayPause);
            navigator.mediaSession.setActionHandler("pause", togglePlayPause);
            navigator.mediaSession.setActionHandler("previoustrack", handlePrev);
            navigator.mediaSession.setActionHandler("nexttrack", handleNext);
        }
    }, [currentSong, togglePlayPause, handlePrev, handleNext]);

    // Update audio element on quality or song change
    useEffect(() => {
        updateAudioSource();
    }, [updateAudioSource]);

    // Update the site title based on current song and playing state
    useEffect(() => {
        document.title = playing && currentSong ? `${currentSong.name} - Musica NextGen` : "Musica NextGen Music";
    }, [playing, currentSong]);

    // Spacebar controls play/pause
    useEffect(() => {
        const handleSpacebar = (e) => {
            if (e.code === "Space" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
                e.preventDefault();
                togglePlayPause();
            }
        };

        window.addEventListener("keydown", handleSpacebar);
        return () => window.removeEventListener("keydown", handleSpacebar);
    }, [togglePlayPause]);

    const value = {
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
        loading,
        setLoading,
        handleNext,
        handlePrev,
        manualQuality,
        setManualQuality,
        togglePlayPause,
        searchResults,
        setSearchResults,
        searchQuery,
        setSearchQuery,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
            <audio
                ref={audioRef}
                loop={isLooping}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onLoadedData={() => setDuration(audioRef.current?.duration || 0)}
                onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
                onEnded={handleNext}
            />
        </UserContext.Provider>
    );
}
