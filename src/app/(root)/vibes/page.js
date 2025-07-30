'use client';

import React, { useRef, useEffect, useContext } from 'react';
import { UserContext } from '@/context';
import SongCard from '@/components/vibes/SongCard';

const SongReels = () => {
    const startScrollY = useRef(0);
    const startIndex = useRef(0);
    // 1. Get the complete song list and the necessary setters from the context
    const {
        songList,
        setSongList, // You may need this if you plan to modify the list
        currentIndex,
        setCurrentIndex,
        playing,
        togglePlayPause,
        playSongAtIndex
    } = useContext(UserContext);

    const containerRef = useRef(null);
    const scrollTimeoutRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScrollStart = () => {
            startScrollY.current = container.scrollTop;
            startIndex.current = currentIndex;
        };

        container.addEventListener('touchstart', handleScrollStart, { passive: true });
        container.addEventListener('mousedown', handleScrollStart, { passive: true });

        return () => {
            container.removeEventListener('touchstart', handleScrollStart);
            container.removeEventListener('mousedown', handleScrollStart);
        };
    }, [currentIndex]);

    console.log("currentIndex", currentIndex)

    // 2. Main effect to synchronize the active song with the global state
    useEffect(() => {
        let scrollTimeout = null;

        const handleScroll = () => {
            if (!containerRef.current) return;
            const container = containerRef.current;
            const cardHeight = container.clientHeight;
            const scrollTop = container.scrollTop;

            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                // Calculate direction
                const delta = scrollTop - startScrollY.current;
                let newIndex = startIndex.current;

                if (Math.abs(delta) > cardHeight / 4) { // threshold for swipe
                    if (delta > 0 && currentIndex < songList.length - 1) {
                        newIndex = startIndex.current + 1;
                    } else if (delta < 0 && currentIndex > 0) {
                        newIndex = startIndex.current - 1;
                    }
                }

                // Snap to the new index
                container.scrollTo({
                    top: newIndex * cardHeight,
                    behavior: 'smooth'
                });

                if (newIndex !== currentIndex) {
                    playSongAtIndex(newIndex);
                }
            }, 150);
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll, { passive: true });
        }
        return () => {
            if (container) container.removeEventListener('scroll', handleScroll);
            if (scrollTimeout) clearTimeout(scrollTimeout);
        };
    }, [currentIndex, songList.length, playSongAtIndex]);

    // 3. Effect for keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Spacebar toggles play/pause for the current song
            if (e.key === ' ') {
                e.preventDefault();
                togglePlayPause();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [togglePlayPause]);

    // 4. Effect to scroll the view when currentIndex changes (e.g., from external controls)
    useEffect(() => {
        if (containerRef.current) {
            const cardHeight = containerRef.current.clientHeight;
            containerRef.current.scrollTo({
                top: currentIndex * cardHeight,
                behavior: 'smooth'
            });
        }
    }, [currentIndex]);


    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">
            {/* Header with song progress indicators */}
            <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
                <h1 className="text-white text-lg font-semibold">Vibes</h1>
                <div className="flex items-center space-x-1">
                    {songList.map((_, index) => (
                        <div
                            key={index}
                            className={`w-1 h-6 rounded-full transition-colors duration-300 ${index === currentIndex ? 'bg-white' : 'bg-white/30'
                                }`}
                        />
                    ))}
                </div>
            </header>

            {/* Main scroll container for song reels */}
            <main
                ref={containerRef}
                className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
            >
                {songList.map((song, index) => (
                    <div key={song.id || index} className="snap-start h-screen w-full">
                        <SongCard
                            song={song}
                            isActive={index === currentIndex}
                            isPlaying={playing && index === currentIndex}
                        />
                    </div>
                ))}
            </main>

            {/* Bottom indicator for current song index */}
            <footer className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
                <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-md rounded-full px-4 py-2">
                    <span className="text-white/80 text-sm">
                        {currentIndex + 1} / {songList.length}
                    </span>
                </div>
            </footer>
        </div>
    );
};

export default SongReels;