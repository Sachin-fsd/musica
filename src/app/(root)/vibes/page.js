'use client';

import React, { useRef, useEffect, useContext } from 'react';
import { UserContext } from '@/context';
import SongCard from '@/components/vibes/SongCard';
import Image from 'next/image';

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

        let scrollTimeout = null;

        const handleScroll = () => {
            if (scrollTimeout) clearTimeout(scrollTimeout);

            scrollTimeout = setTimeout(() => {
                const cardHeight = container.clientHeight;
                const scrollTop = container.scrollTop;
                // Find the nearest card index
                const newIndex = Math.round(scrollTop / cardHeight);

                // Snap to the nearest card
                container.scrollTo({
                    top: newIndex * cardHeight,
                    behavior: 'smooth'
                });

                // Change song if index changed
                if (newIndex !== currentIndex && newIndex >= 0 && newIndex < songList.length) {
                    playSongAtIndex(newIndex);
                }
            }, 120); // Debounce time
        };

        container.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            container.removeEventListener('scroll', handleScroll);
            if (scrollTimeout) clearTimeout(scrollTimeout);
        };
    }, [currentIndex, songList.length, playSongAtIndex]);

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
                <span className='flex'>
                    <span><Image src="/favicon.png" alt="Logo" width={30} height={30} /></span>
                    <h1 className="text-white text-lg font-semibold">Vibes</h1>
                </span>
                {/* <div className="flex items-center space-x-1">
                    {songList.map((_, index) => (
                        <div
                            key={index}
                            className={`w-1 h-6 rounded-full transition-colors duration-300 ${index === currentIndex ? 'bg-white' : 'bg-white/30'
                                }`}
                        />
                    ))}
                </div> */}
            </header>

            {/* Main scroll container for song reels */}
            <main
                ref={containerRef}
                className="h-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar"
            >
                {Array.isArray(songList) && songList.map((song, index) => (
                    <div key={song?.id || index} className="snap-start h-screen w-full">
                        <SongCard
                            song={song}
                            isActive={index === currentIndex}
                            isPlaying={playing && index === currentIndex}
                        />
                    </div>
                ))}
            </main>

            {/* Bottom indicator for current song index */}
            {/* <footer className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
                <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-md rounded-full px-4 py-2">
                    <span className="text-white/80 text-sm">
                        {currentIndex + 1} / {songList.length}
                    </span>
                </div>
            </footer> */}
        </div>
    );
};

export default SongReels;