'use client';
import { createContext, useRef, useState, useEffect, useCallback } from "react";
import { SearchSongSuggestionAction } from "@/app/actions";
import { songFormat, songs } from "@/utils/cachedSongs";
import { shuffleArray } from "@/utils/extraFunctions";
import { createPlaylistFromSuggestions } from "@/utils/playListUtils";

export const UserContext = createContext(null);

export default function UserState({ children }) {
    // --- State Definitions ---
    const [songList, setSongList] = useState([songFormat]);
    const [currentSong, setCurrentSong] = useState(songFormat);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLooping, setIsLooping] = useState(false);
    const [manualQuality, setManualQuality] = useState("very_high");
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isJamChecked, setIsJamChecked] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const audioRef = useRef(null);

    // --- Core Playback Logic ---

    const playSongAtIndex = useCallback((index) => {
        if (index >= 0 && index < songList.length) {
            setCurrentIndex(index);
            setCurrentSong(songList[index]);
            setPlaying(true);
        }
    }, [songList]);

    // in index.js

    const playSongAndCreateQueue = useCallback(async (song) => {
        // First, check if the song is already in the current song list
        const existingSongIndex = songList.findIndex(s => s.id === song.id);

        if (existingSongIndex !== -1) {
            // --- SONG ALREADY EXISTS ---
            // The song is in the queue, so just play it at its current position.
            playSongAtIndex(existingSongIndex);

        } else {
            // --- SONG IS NEW ---
            setLoading(true);
            const newPlaylist = await createPlaylistFromSuggestions(song, songList);
            setSongList(newPlaylist);
            setCurrentSong(song);
            setPlaying(true);
            setLoading(false);
            // The new song is now at the top of the new list
            setCurrentIndex(0);
        }
    }, [songList, playSongAtIndex]);

    const handleNext = useCallback(() => {
        const nextIndex = (currentIndex + 1) % songList.length;
        playSongAtIndex(nextIndex);
    }, [currentIndex, songList.length, playSongAtIndex]);

    const handlePrev = useCallback(() => {
        const prevIndex = (currentIndex - 1 + songList.length) % songList.length;
        playSongAtIndex(prevIndex);
    }, [currentIndex, songList.length, playSongAtIndex]);

    const togglePlayPause = () => {
        setPlaying(!playing);
    };

    const handleSeek = (e) => {
        const seekTime = e[0];
        if (audioRef.current) {
            audioRef.current.currentTime = seekTime;
            setCurrentTime(seekTime);
        }
    };

    // --- useEffect Hooks for Side Effects ---

    // Effect 1: Initialize state from LocalStorage on mount
    useEffect(() => {
        try {
            const storedSongList = JSON.parse(localStorage.getItem("songList"));
            const storedCurrentSong = JSON.parse(localStorage.getItem("currentSong"));

            let initialSongs = Array.isArray(storedSongList) && storedSongList.length > 0 ? storedSongList : songs;
            let initialCurrentSong = storedCurrentSong?.id ? storedCurrentSong : initialSongs[0];

            // Ensure the current song is at the start of a potentially oversized list
            if (initialSongs.length > 20) {
                const otherSongs = initialSongs.filter(s => s.id !== initialCurrentSong.id);
                initialSongs = [initialCurrentSong, ...otherSongs.slice(0, 19)];
            }

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
        document.title = playing ? `${currentSong.name} - Musica NextGen` : `Musica NextGen Music`;

        // Update Media Session API
        if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentSong.name,
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

        audioElement.addEventListener("timeupdate", handleTimeUpdate);
        audioElement.addEventListener("ended", handleSongEnd);

        return () => {
            audioElement.removeEventListener("timeupdate", handleTimeUpdate);
            audioElement.removeEventListener("ended", handleSongEnd);
        };
    }, [handleNext]);


    // Effect 5: Fetch related songs when nearing the end of the playlist
    useEffect(() => {

        const addRelatedSongs = async () => {
            console.log("start", currentSong, currentIndex, songList.length)

            if (currentIndex >= songList.length - 2 && currentSong?.id) {
                console.log("inside if", currentSong, currentIndex)

                setLoading(true);
                const response = await SearchSongSuggestionAction(currentSong.id);
                if (response.success) {
                    const newSongs = response.data.filter(
                        relatedSong => !songList.some(song => song.id === relatedSong.id)
                    );
                    setSongList(prevList => [...prevList, ...shuffleArray(newSongs)]);
                }
                setLoading(false);
            }
        };
        addRelatedSongs();
    }, [currentIndex, songList, currentSong]);


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
    }, []); // Empty dependency to only attach once

    // --- Setup Media Session Action Handlers ---
    useEffect(() => {
        if ("mediaSession" in navigator) {
            navigator.mediaSession.setActionHandler("play", () => setPlaying(true));
            navigator.mediaSession.setActionHandler("pause", () => setPlaying(false));
            navigator.mediaSession.setActionHandler("nexttrack", handleNext);
            navigator.mediaSession.setActionHandler("previoustrack", handlePrev);
        }
    }, [handleNext, handlePrev]);


    // --- Context Value ---
    const value = {
        currentSong, setCurrentSong, playing, setPlaying, currentTime, setCurrentTime,
        duration, setDuration, isLooping, setIsLooping, audioRef, handleSeek,
        currentIndex, setCurrentIndex, songList, setSongList, loading, setLoading,
        handleNext, handlePrev, manualQuality, setManualQuality, togglePlayPause,
        searchResults, setSearchResults, isJamChecked, setIsJamChecked, searchQuery, setSearchQuery,
        playSongAndCreateQueue, playSongAtIndex
    };

    return (
        <UserContext.Provider value={value}>
            {children}
            <audio ref={audioRef} loop={isLooping} />
        </UserContext.Provider>
    );
}