"use client";

import { UserContext } from "@/context";
import { useCurrentTimeStore } from "@/store/useCurrentTimeStore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Music, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchLyricsAction } from "@/app/actions";

function Lyrics() {
    const {
        currentSong,
        playing,
        handleSeek,
        setPlaying,
    } = useContext(UserContext);
    const currentTime = useCurrentTimeStore((state) => state.currentTime);

    const [currentLineIndex, setCurrentLineIndex] = useState(-1);
    const [autoScroll, setAutoScroll] = useState(true);

    const lyricsContainerRef = useRef(null);
    const currentLineRef = useRef(null);
    const scrollTimeoutRef = useRef(null);
    const isAutoScrollingRef = useRef(false);

    const {
        data: lyrics,
        isLoading,
        isFetching,
        error,
    } = useQuery({
        queryKey: ["lyrics", currentSong?.id],
        queryFn: () => fetchLyricsAction(currentSong),
        enabled: !!currentSong?.id,
        staleTime: 60 * 60 * 1000,
        gcTime: 24 * 60 * 60 * 1000,
    });

    // Reset lyric state when song changes
    useEffect(() => {
        setCurrentLineIndex(-1);
        setAutoScroll(true);
    }, [currentSong?.id]);

    // Cleanup timeout
    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    // Handle lyric line click
    const handleLineClick = (time) => {
        if (!handleSeek) return;

        handleSeek(time);

        if (!playing) {
            setPlaying(true);
        }
    };

    // Detect actual user scrolling
    const handleUserScroll = () => {
        if (isAutoScrollingRef.current) {
            return;
        }

        setAutoScroll(false);

        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
            setAutoScroll(true);
        }, 3000);
    };

    // Find and scroll to current lyric line
    useEffect(() => {
        if (!lyrics?.synced?.length || !playing) {
            return;
        }

        let left = 0;
        let right = lyrics.synced.length - 1;
        let activeIndex = -1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);

            if (lyrics.synced[mid].time <= currentTime) {
                activeIndex = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        setCurrentLineIndex(activeIndex);

        if (
            activeIndex === -1 ||
            !autoScroll ||
            !lyricsContainerRef.current
        ) {
            return;
        }

        const container = lyricsContainerRef.current;
        const currentLine = currentLineRef.current;

        if (!currentLine) return;

        const containerHeight = container.clientHeight;
        const lineTop = currentLine.offsetTop;
        const lineHeight = currentLine.clientHeight;

        const scrollPosition =
            lineTop -
            containerHeight / 2 +
            lineHeight / 2;

        isAutoScrollingRef.current = true;

        container.scrollTo({
            top: scrollPosition,
            behavior: "smooth",
        });

        // Give the smooth scroll time to finish before
        // treating scroll events as user scrolling.
        setTimeout(() => {
            isAutoScrollingRef.current = false;
        }, 500);
    }, [currentTime, lyrics, playing, autoScroll]);

    // No song
    if (!currentSong?.id) {
        return (
            <div className="w-full h-[65vh] flex flex-col items-center justify-center rounded-xl shadow-lg overflow-hidden border-2">
                <Music className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg">No song playing</p>
            </div>
        );
    }

    // Loading
    if (isLoading) {
        return (
            <div className="w-full h-[65vh] flex flex-col items-center justify-center rounded-xl shadow-lg overflow-hidden border-2">
                <Loader2 className="w-12 h-12 mb-4 animate-spin text-primary" />
                <p>Loading lyrics...</p>
            </div>
        );
    }

    // Error / unavailable lyrics
    if (error || !lyrics?.synced?.length) {
        return (
            <div className="w-full h-[65vh] flex flex-col items-center justify-center rounded-xl shadow-lg overflow-hidden border-2">
                <p className="text-lg mb-2">Lyrics not available</p>
                <p className="text-sm opacity-75">
                    for {currentSong.name}
                </p>
            </div>
        );
    }

    return (
        <div className="w-full h-[65vh] flex flex-col rounded-xl shadow-lg overflow-hidden border-2">
            <div
                ref={lyricsContainerRef}
                onScroll={handleUserScroll}
                className="lyrics-scroll flex-1 overflow-y-auto px-6 relative"
            >
                <div className="max-w-3xl mx-auto">
                    <div className="space-y-1 mt-2">
                        {lyrics.synced.map((line, index) => {
                            const isCurrent =
                                index === currentLineIndex;

                            const isPast =
                                index < currentLineIndex;

                            return (
                                <div
                                    key={`${line.time}-${index}`}
                                    ref={
                                        isCurrent
                                            ? currentLineRef
                                            : null
                                    }
                                    onClick={() =>
                                        handleLineClick(line.time)
                                    }
                                    className={`transition-all duration-300 text-center cursor-pointer select-none ${isCurrent
                                        ? "text-gray-900 dark:text-white text-lg md:text-xl font-bold opacity-100"
                                        : isPast
                                            ? "text-gray-50 dark:text-gray-50 text-base md:text-xl opacity-60 hover:opacity-80"
                                            : "text-gray-50 dark:text-gray-50 text-base md:text-xl opacity-40 hover:opacity-60"
                                        } ${line.text ? "py-3" : "py-2"}`}
                                >
                                    {line.text || "♪"}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Lyrics;