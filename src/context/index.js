'use client';
import { createContext, useRef, useState, useEffect, useCallback, useMemo } from "react";
import { songFormat, songs } from "@/utils/cachedSongs";
import { fetchSuggestions, mergeUniqueSongs, shuffleArray } from "@/utils/extraFunctions";
import { useCurrentTimeStore } from "@/store/useCurrentTimeStore";
import { decode } from "he";

export const UserContext = createContext(null);

export default function UserState({ children }) {
    // --- State Definitions ---
    const [songList, setSongList] = useState([songFormat, songFormat, songFormat]);
    const [currentSong, setCurrentSong] = useState(songFormat);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentId, setCurrentId] = useState("");
    const [playing, setPlaying] = useState(false);
    // const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLooping, setIsLooping] = useState(false);
    const [manualQuality, setManualQuality] = useState("very_high");
    const [loading, setLoading] = useState(false);
    // const [searchResults, setSearchResults] = useState([]);
    const [isJamChecked, setIsJamChecked] = useState(false);
    // const [searchQuery, setSearchQuery] = useState("");
    const audioRef = useRef(null);

    const { currentTime, setCurrentTime } = useCurrentTimeStore()

    // --- Core Playback Logic ---

    const playSongAtIndex = useCallback((index) => {
        if (index >= 0 && index < songList.length) {
            setCurrentIndex(index);
            setCurrentSong(songList[index]);
            setPlaying(true);
        }
    }, [songList]);

    const playSongAndCreateQueue = useCallback(async (song) => {
        try {
            if (loading) return;
            const existingSongIndex = songList.findIndex(s => s.id === song.id);

            setLoading(true);

            if (existingSongIndex !== -1) {
                // --- SONG ALREADY EXISTS ---
                playSongAtIndex(existingSongIndex);
                const suggestions = await fetchSuggestions(song.id);
                if (suggestions.length > 0) {
                    setSongList(mergeUniqueSongs(songList, suggestions));
                }
            } else {
                // --- SONG IS NEW ---
                setCurrentIndex(0);
                setCurrentSong(song);
                setPlaying(true);
                const suggestions = await fetchSuggestions(song.id);
                if (suggestions.length > 1) {
                    setSongList([song, ...suggestions]);
                } else {
                    setSongList([song, ...songList.reverse()]); // Kept your original fallback logic
                }
            }
        } catch (error) {
            console.error("Error in playSongAndCreateQueue:", error);
        } finally {
            setLoading(false);
        }

    }, [songList, playSongAtIndex, loading]);

    const handleNext = useCallback(async () => {
        const nextIndex = (currentIndex + 1) % songList.length;
        playSongAtIndex(nextIndex);
        const suggestions = await fetchSuggestions(songList[nextIndex]?.id);
        if (suggestions.length > 0) {
            setSongList(mergeUniqueSongs(songList, suggestions));
        }
    }, [currentIndex, songList.length, playSongAtIndex]);

    const handlePrev = useCallback(() => {
        const prevIndex = (currentIndex - 1 + songList.length) % songList.length;
        playSongAtIndex(prevIndex);
    }, [currentIndex, songList.length, playSongAtIndex]);

    const togglePlayPause = useCallback(() => {
        setPlaying(prevPlaying => !prevPlaying);
    }, []);

    const handleSeek = useCallback((e) => {
        const seekTime = e;
        if (audioRef.current) {
            audioRef.current.currentTime = seekTime;
            setCurrentTime(seekTime);
        }
    }, [setCurrentTime]);

    // --- useEffect Hooks for Side Effects ---

    // Effect 1: Initialize state from LocalStorage on mount
    useEffect(() => {
        try {
            const storedSongList = JSON.parse(localStorage.getItem("songList"));
            const storedCurrentSong = JSON.parse(localStorage.getItem("currentSong"));

            let initialSongs = Array.isArray(storedSongList) && (storedSongList.length > 0) && storedSongList[0]?.id ? storedSongList : songs;
            let initialCurrentSong = storedCurrentSong?.id ? storedCurrentSong : initialSongs[0];
            setSongList(initialSongs);
            setCurrentSong(initialCurrentSong);
            const initialIndex = initialSongs.findIndex(s => s.id === initialCurrentSong.id);
            setCurrentIndex(Math.max(0, initialIndex));

        } catch (error) {
            console.error("Error initializing state from localStorage", error);
            setSongList(songs);
            setCurrentSong(songs[0]);
        }
    }, []);

    // Effect 2: Persist state to LocalStorage
    useEffect(() => {
        if (currentSong?.id) {
            localStorage.setItem("currentSong", JSON.stringify(currentSong));
        }
        if (songList.length > 1) { // Avoid saving the initial placeholder
            localStorage.setItem("songList", JSON.stringify(songList));
        }
    }, [currentSong, songList]);

    // Effect 3: Main audio element and Media Session handler
    useEffect(() => {
        const audioElement = audioRef.current;
        if (!audioElement || !currentSong?.id) return;

        // Determine audio quality
        const qualityMap = { low: 0, medium: 1, average: 2, high: 3, very_high: 4 };
        const qualityIndex = qualityMap[manualQuality] ?? 4;
        const qualityUrl = currentSong.downloadUrl?.[qualityIndex]?.url;

        // Update audio source only if it has changed
        if (audioElement.src !== qualityUrl) {
            audioElement.src = qualityUrl;
            audioElement.load();
        }

        // Handle play/pause state
        if (playing) {
            audioElement.play().catch(e => console.error("Playback error:", e));
        } else {
            audioElement.pause();
        }

        // Update document title
        document.title = playing ? `${decode(currentSong.name)} - Musica NextGen` : `Musica NextGen Music`;

        // Update Media Session API
        if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: decode(currentSong.name),
                artist: currentSong.artists?.primary[0]?.name,
                album: currentSong.album?.name,
                artwork: [{ src: currentSong.image?.[2]?.url, sizes: "500x500", type: "image/jpeg" }],
            });
            navigator.mediaSession.playbackState = playing ? "playing" : "paused";
        }

    }, [currentSong, playing, manualQuality]);


    // Effect 4: Attach audio event listeners
    useEffect(() => {
        const audioElement = audioRef.current;
        if (!audioElement) return;

        const handleTimeUpdate = () => {
            setCurrentTime(audioElement.currentTime);
            setDuration(audioElement.duration || 0);
        };
        const handleSongEnd = () => handleNext();
        const handleLoadedMetadata = () => {
            setDuration(audioElement.duration || 0);
        };
        const handleDurationChange = () => {
            setDuration(audioElement.duration || 0);
        };

        audioElement.addEventListener("timeupdate", handleTimeUpdate);
        audioElement.addEventListener("ended", handleSongEnd);
        audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
        audioElement.addEventListener("durationchange", handleDurationChange);

        return () => {
            audioElement.removeEventListener("timeupdate", handleTimeUpdate);
            audioElement.removeEventListener("ended", handleSongEnd);
            audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audioElement.removeEventListener("durationchange", handleDurationChange);
        };
    }, [handleNext]);

    // Effect 6: Handle spacebar play/pause
    useEffect(() => {
        const handleSpacebar = (e) => {
            if (e.code === "Space" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
                e.preventDefault();
                togglePlayPause();
            }
        };
        window.addEventListener("keydown", handleSpacebar);
        return () => window.removeEventListener("keydown", handleSpacebar);
    }, [togglePlayPause]); // Empty dependency to only attach once

    // --- Setup Media Session Action Handlers ---
    useEffect(() => {
        if ("mediaSession" in navigator) {
            navigator.mediaSession.setActionHandler("play", () => setPlaying(true));
            navigator.mediaSession.setActionHandler("pause", () => setPlaying(false));
            navigator.mediaSession.setActionHandler("nexttrack", handleNext);
            navigator.mediaSession.setActionHandler("previoustrack", handlePrev);
        }
    }, [handleNext, handlePrev]);


    // --- Context Value with useMemo to prevent unnecessary re-renders ---
    const value = useMemo(() => ({
        currentSong, setCurrentSong, playing, setPlaying, currentTime, setCurrentTime,
        duration, setDuration, isLooping, setIsLooping, audioRef, handleSeek,
        currentIndex, setCurrentIndex, songList, setSongList, loading, setLoading,
        handleNext, handlePrev, manualQuality, setManualQuality, togglePlayPause,
        isJamChecked, setIsJamChecked,
        playSongAndCreateQueue, playSongAtIndex, currentId, setCurrentId
    }), [
        currentSong, playing, currentTime, duration, isLooping, audioRef, handleSeek,
        currentIndex, songList, loading, handleNext, handlePrev, manualQuality,
        isJamChecked, playSongAndCreateQueue, playSongAtIndex, currentId
    ]);

    return (
        <UserContext.Provider value={value}>
            {children}
            <audio ref={audioRef} loop={isLooping} preload="metadata" />
        </UserContext.Provider>
    );
}