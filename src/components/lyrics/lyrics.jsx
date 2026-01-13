'use client'

import { UserContext } from '@/context'
import React, { useContext, useState, useEffect, useRef } from 'react'
import { Music, AlertCircle, Loader2 } from 'lucide-react'
import { fetchLyricsAction } from '@/app/actions'
import { useLyricsStore } from '@/store/useLyricsStore'

function Lyrics() {
    const { currentSong, playing, currentTime, handleSeek, setPlaying } = useContext(UserContext);
    const [lyrics, setLyrics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentLineIndex, setCurrentLineIndex] = useState(-1);
    const [autoScroll, setAutoScroll] = useState(true);
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

    // Fetch lyrics when song changes
    useEffect(() => {
        if (!currentSong || !currentSong.id) {
            setLyrics(null);
            return;
        }

        const fetchLyrics = async () => {
            const { getLyrics, setLyrics: setCachedLyrics } = useLyricsStore.getState();
            const cached = getLyrics(currentSong.id);
            if (cached) {
                setLyrics(cached);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            setCurrentLineIndex(-1);
            setAutoScroll(true);

            try {
                const artistName = currentSong.artists?.primary?.[0]?.name || '';
                const trackName = currentSong.name || '';
                const albumName = currentSong.album?.name || '';
                const duration = currentSong.duration || 0;

                const data = await fetchLyricsAction(artistName, trackName, albumName, duration);

                setLyrics(data);
                setCachedLyrics(currentSong.id, data);
            } catch (err) {
                console.error('Error fetching lyrics:', err, currentSong);
                setError(err.message);
                setLyrics(null);
            } finally {
                setLoading(false);
            }
        };

        fetchLyrics();
    }, [currentSong]);

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
        return null
        // return (
        //     <div className="w-full h-8 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
        //         <Music className="w-16 h-16 mb-4 opacity-50" />
        //         <p className="text-lg">No song playing</p>
        //     </div>
        // );
    }

    if (loading) {
        return null;
        // return (
        //     <div className="w-full h-8 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
        //         <Loader2 className="w-12 h-12 mb-4 animate-spin" />
        //         <p>Loading lyrics...</p>
        //     </div>
        // );
    }

    if (error || !lyrics || lyrics.instrumental) {
        return null
        // return (
        //     <div className="w-full h-[20%] flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
        //         <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
        //         <p className="text-lg mb-2">Lyrics not available</p>
        //         <p className="text-sm opacity-75">for {currentSong.name}</p>
        //     </div>
        // );
    }

    // if (lyrics.instrumental) {
    //     return (
    //         <div className="w-[90vw] h-[80vh] flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
    //             <Music className="w-16 h-16 mb-4 opacity-50" />
    //             <p className="text-lg">Instrumental Track</p>
    //         </div>
    //     );
    // }

    return (
        <div className="w-[90%] h-[70vh] flex flex-col rounded-xl shadow-lg overflow-hidden border-2">
            {/* Lyrics Container with fixed height */}
            <div
                ref={lyricsContainerRef}
                onScroll={handleUserScroll}
                className=" lyrics-scroll flex-1 overflow-y-auto px-6 relative"
            >
                {lyrics.synced ? (
                    // Synced Lyrics - Add padding to center the content
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
                                            ? 'text-gray-500 dark:text-gray-500 text-base md:text-xl opacity-60 hover:opacity-80'
                                            : 'text-gray-600 dark:text-gray-600 text-base md:text-xl opacity-40 hover:opacity-60'
                                        } ${line.text ? 'py-3' : 'py-2'}`}
                                >
                                    {line.text || '♪'}
                                </div>
                            ))}
                        </div>

                    </div>
                ) : (
                    // Plain Lyrics
                    <div className="max-w-3xl mx-auto">
                        <div style={{ height: 'calc(40vh - 100px)' }} />
                        <pre className="text-gray-700 dark:text-gray-300 text-xl leading-relaxed whitespace-pre-wrap font-sans text-center">
                            {lyrics.plain}
                        </pre>
                        <div style={{ height: 'calc(40vh - 100px)' }} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Lyrics