'use client';
import { createContext, useRef, useState, useEffect, useCallback, useMemo } from "react";
import { songFormat, songs } from "@/utils/cachedSongs";
import { fetchSuggestions, mergeUniqueSongs, shuffleArray, getQualityUrl } from "@/utils/extraFunctions";
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
    const currentSongRef = useRef(null);
    const manualQualityRef = useRef(manualQuality);
    const lastKnownTimeRef = useRef(0);
    const retryCountRef = useRef(0);
    const stallTimerRef = useRef(null);
    const handleNextRef = useRef(null);
    const prefetchInFlightRef = useRef(false);

    const { currentTime, setCurrentTime } = useCurrentTimeStore()

    // --- Core Playback Logic ---

    const playSongAtIndex = useCallback((index) => {
        if (index >= 0 && index < songList.length) {
            setCurrentIndex(index);
            setCurrentSong(songList[index]);
            setPlaying(true);
        }
    }, [songList]);

    const latestSongRequestRef = useRef(null);

    const playSongAndCreateQueue = useCallback(async (song) => {
        try {
            // 1. Remove the blocking 'if (loading) return;'

            setLoading(true);
            // 2. Track the latest song clicked
            latestSongRequestRef.current = song.id;

            const existingSongIndex = songList.findIndex(s => s.id === song.id);

            // 3. Play the song IMMEDIATELY for instant UI feedback
            if (existingSongIndex !== -1) {
                playSongAtIndex(existingSongIndex);
            } else {
                setCurrentIndex(0);
                setCurrentSong(song);
                setPlaying(true);
                // Temporarily slot the new song in so the UI feels fast
                setSongList(prev => [song, ...prev]);
            }

            // 4. Fetch the suggestions in the background
            const suggestions = await fetchSuggestions(song.id);

            // 5. THE CRITICAL CHECK: Did the user click another song while we waited?
            if (latestSongRequestRef.current !== song.id) {
                console.log("Stale request discarded for:", song.name);
                return; // Exit early, do not update the songList!
            }

            // 6. If it's still the active request, safely update the queue
            if (existingSongIndex !== -1) {
                if (suggestions.length > 0) {
                    setSongList(prevList => mergeUniqueSongs(prevList, suggestions));
                }
            } else {
                if (suggestions.length > 1) {
                    setSongList([song, ...suggestions]);
                } else {
                    setSongList(prev => [song, ...prev.reverse()]); // Your fallback
                }
            }
        } catch (error) {
            console.error("Error in playSongAndCreateQueue:", error);
        } finally {
            // Only turn off loading if this was the final request
            if (latestSongRequestRef.current === song.id) {
                setLoading(false);
            }
        }
    }, [songList, playSongAtIndex]); // Notice we removed 'loading' from dependencies

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

        // Determine audio quality, falling back to the nearest available
        // tier instead of silently producing an "undefined" src.
        const qualityUrl = getQualityUrl(currentSong, manualQuality);

        if (!qualityUrl) {
            console.error("No playable URL found for song:", currentSong?.name);
        } else if (audioElement.src !== qualityUrl) {
            audioElement.src = qualityUrl;
            audioElement.load();
            // Fresh track load: reset the stall/error retry counter.
            retryCountRef.current = 0;
        }

        // Handle play/pause state
        if (playing && qualityUrl) {
            audioElement.play().catch(e => console.error("Playback error:", e));
        } else if (!playing) {
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


    // Keep refs in sync so recovery callbacks below never read stale values.
    useEffect(() => { currentSongRef.current = currentSong; }, [currentSong]);
    useEffect(() => { manualQualityRef.current = manualQuality; }, [manualQuality]);
    useEffect(() => { handleNextRef.current = handleNext; }, [handleNext]);

    useEffect(() => {
        const audioElement = audioRef.current;
        if (!audioElement) return;

        const MAX_RETRIES = 3;
        const RETRY_DELAY_MS = 2000;
        const STALL_GRACE_MS = 8000; // "waiting" fires during normal buffering too, so only act if it doesn't resolve within this window

        const clearStallTimer = () => {
            if (stallTimerRef.current) {
                clearTimeout(stallTimerRef.current);
                stallTimerRef.current = null;
            }
        };

        const attemptRecovery = () => {
            clearStallTimer();

            if (retryCountRef.current >= MAX_RETRIES) {
                console.warn("Playback recovery failed after max retries, skipping to next song.");
                retryCountRef.current = 0;
                handleNextRef.current?.();
                return;
            }

            retryCountRef.current += 1;
            const resumeTime = lastKnownTimeRef.current;
            const delay = RETRY_DELAY_MS * retryCountRef.current;

            console.warn(`Playback stalled/errored, retrying (${retryCountRef.current}/${MAX_RETRIES}) in ${delay}ms`);

            setTimeout(() => {
                const el = audioRef.current;
                const song = currentSongRef.current;
                if (!el || !song?.id) return;

                const url = getQualityUrl(song, manualQualityRef.current);
                if (!url) return;

                const onReady = () => {
                    el.currentTime = resumeTime;
                    el.play().catch((err) => console.error("Recovery play failed:", err));
                    el.removeEventListener("loadedmetadata", onReady);
                };
                el.addEventListener("loadedmetadata", onReady);

                el.src = url;
                el.load();
            }, delay);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(audioElement.currentTime);
            setDuration(audioElement.duration || 0);
            lastKnownTimeRef.current = audioElement.currentTime;
            clearStallTimer(); // forward progress = healthy, cancel any pending stall check
        };
        const handleSongEnd = () => handleNext();
        const handleLoadedMetadata = () => {
            setDuration(audioElement.duration || 0);
        };
        const handleDurationChange = () => {
            setDuration(audioElement.duration || 0);
        };
        const handlePlaying = () => {
            retryCountRef.current = 0; // successfully playing again = healthy
            clearStallTimer();
        };
        const handleWaitingOrStalled = () => {
            clearStallTimer();
            stallTimerRef.current = setTimeout(attemptRecovery, STALL_GRACE_MS);
        };
        const handleError = () => {
            console.error("Audio element error:", audioElement.error);
            attemptRecovery();
        };

        audioElement.addEventListener("timeupdate", handleTimeUpdate);
        audioElement.addEventListener("ended", handleSongEnd);
        audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
        audioElement.addEventListener("durationchange", handleDurationChange);
        audioElement.addEventListener("playing", handlePlaying);
        audioElement.addEventListener("waiting", handleWaitingOrStalled);
        audioElement.addEventListener("stalled", handleWaitingOrStalled);
        audioElement.addEventListener("error", handleError);

        return () => {
            clearStallTimer();
            audioElement.removeEventListener("timeupdate", handleTimeUpdate);
            audioElement.removeEventListener("ended", handleSongEnd);
            audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audioElement.removeEventListener("durationchange", handleDurationChange);
            audioElement.removeEventListener("playing", handlePlaying);
            audioElement.removeEventListener("waiting", handleWaitingOrStalled);
            audioElement.removeEventListener("stalled", handleWaitingOrStalled);
            audioElement.removeEventListener("error", handleError);
        };
    }, [handleNext]);

    useEffect(() => {
        const songsRemaining = songList.length - 1 - currentIndex;
        if (songsRemaining < 0 || songsRemaining > 2) return;
        if (!currentSong?.id || prefetchInFlightRef.current) return;

        let cancelled = false;
        prefetchInFlightRef.current = true;

        fetchSuggestions(currentSong.id)
            .then((suggestions) => {
                if (cancelled || suggestions.length === 0) return;
                setSongList((prevList) => mergeUniqueSongs(prevList, suggestions));
            })
            .catch((err) => console.error("Prefetch suggestions failed:", err))
            .finally(() => {
                prefetchInFlightRef.current = false;
            });

        return () => {
            cancelled = true;
        };
    }, [currentIndex, songList.length, currentSong?.id]);

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

    
    useEffect(() => {
        if (!("mediaSession" in navigator)) return;

        const setHandler = (action, handler) => {
            try {
                navigator.mediaSession.setActionHandler(action, handler);
            } catch (err) {
                // Not every action is supported in every browser; safe to ignore.
            }
        };

        setHandler("play", () => setPlaying(true));
        setHandler("pause", () => setPlaying(false));
        setHandler("nexttrack", handleNext);
        setHandler("previoustrack", handlePrev);
        setHandler("stop", () => {
            setPlaying(false);
            audioRef.current?.pause();
        });
        setHandler("seekto", (details) => {
            if (audioRef.current && details.seekTime != null) {
                audioRef.current.currentTime = details.seekTime;
                setCurrentTime(details.seekTime);
            }
        });
    }, [handleNext, handlePrev, setCurrentTime]);


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