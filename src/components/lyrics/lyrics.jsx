'use client'

import { UserContext } from '@/context'
import React, { useContext, useState, useEffect, useRef } from 'react'
import { Music, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchLyricsAction } from '@/app/actions'
import Image from 'next/image'

function Lyrics() {
    const { currentSong, playing, currentTime, handleSeek, setPlaying } = useContext(UserContext);
    const [currentLineIndex, setCurrentLineIndex] = useState(-1);
    const [autoScroll, setAutoScroll] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const lyricsContainerRef = useRef(null);
    const currentLineRef = useRef(null);
    const scrollTimeoutRef = useRef(null);

    // Handle line click to seek
    const handleLineClick = (time) => {
        if (handleSeek) {
            handleSeek(time);
            if (!playing) setPlaying(true);
        }
    };

    // Detect user scroll and disable auto-scroll temporarily
    const handleUserScroll = () => {
        setAutoScroll(false);

        // Clear existing timeout
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        // Re-enable auto-scroll after 3 seconds of no scrolling
        scrollTimeoutRef.current = setTimeout(() => {
            setAutoScroll(true);
        }, 3000);
    };

    const { data: lyrics, isLoading: loading, error } = useQuery({
        queryKey: ['lyrics', currentSong?.id],
        queryFn: () => fetchLyricsAction(currentSong),
        enabled: !!currentSong?.id,
        staleTime: 60 * 60 * 1000,
        gcTime: 24 * 60 * 60 * 1000,
    });

    useEffect(() => {
        setCurrentLineIndex(-1);
        setAutoScroll(true);
        setIsVisible(!!lyrics);
    }, [currentSong?.id, lyrics]);

    // Update current line based on currentTime - optimized with binary search
    useEffect(() => {
        if (!lyrics?.synced || !playing) {
            return;
        }

        // Binary search for better performance
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
        if (currentLineRef.current && lyricsContainerRef.current && playing && autoScroll) {
            const container = lyricsContainerRef.current;
            const currentLine = currentLineRef.current;

            // Calculate position to center the current line
            const containerHeight = container.clientHeight;
            const lineTop = currentLine.offsetTop;
            const lineHeight = currentLine.clientHeight;

            // Scroll to position that centers the line
            const scrollPosition = lineTop - (containerHeight / 2) + (lineHeight / 2);

            container.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
        }
    }, [currentTime, lyrics, playing]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    if (!currentSong || !currentSong.id) {
        return (
            <div className={`w-[100%] h-[65vh] flex flex-col rounded-xl shadow-lg overflow-hidden border-2 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}>
                <Music className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg">No song playing</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className={`w-[100%] h-[65vh] flex flex-col rounded-xl shadow-lg overflow-hidden items-center border-2 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}>
                <Loader2 className="w-12 h-12 mb-4 animate-spin text-center" />
                <p>Loading lyrics...</p>
            </div>
        );
    }

    if (error || !lyrics || !lyrics.synced) {
        return (
            <div className={`w-[100%] h-[65vh] flex flex-col rounded-xl shadow-lg overflow-hidden border-2 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}>
                <p className="text-lg mb-2">Lyrics not available</p>
                <p className="text-sm opacity-75">for {currentSong.name}</p>
            </div>
        );
    }


    return (
        <div className={`w-[100%] h-[65vh] flex flex-col rounded-xl shadow-lg overflow-hidden border-2 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
            }`}>
            {/* Lyrics Container with fixed height and fade animation */}
            <div
                ref={lyricsContainerRef}
                onScroll={handleUserScroll}
                className="lyrics-scroll flex-1 overflow-y-auto px-6 relative"
            >
                {lyrics.synced && (
                    // Synced Lyrics
                    <div className="max-w-3xl mx-auto">
                        <div className="space-y-1 mt-2">
                            {lyrics.synced.map((line, index) => (
                                <div
                                    key={index}
                                    ref={index === currentLineIndex ? currentLineRef : null}
                                    onClick={() => handleLineClick(line.time)}
                                    className={`transition-all duration-300 text-center cursor-pointer select-none ${index === currentLineIndex
                                        ? 'text-gray-900 dark:text-white text-lg md:text-xl font-bold opacity-100'
                                        : index < currentLineIndex
                                            ? 'text-gray-50 dark:text-gray-50 text-base md:text-xl opacity-60 hover:opacity-80'
                                            : 'text-gray-50 dark:text-gray-50 text-base md:text-xl opacity-40 hover:opacity-60'
                                        } ${line.text ? 'py-3' : 'py-2'}`}
                                >
                                    {line.text || '♪'}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Lyrics