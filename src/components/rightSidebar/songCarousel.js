'use client';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/context';
import { Skeleton } from '../ui/skeleton';
import { decodeHtml } from '@/utils';

const SongCarousel = ({ songs }) => {
    const { currentSong, setCurrentSong, currentIndex, setCurrentIndex } = useContext(UserContext);
    const [isAnimating, setIsAnimating] = useState(false);

    // Handle Previous
    const handlePrev = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? songs.length - 1 : prevIndex - 1));
    };

    // Handle Next
    const handleNext = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prevIndex) => (prevIndex === songs.length - 1 ? 0 : prevIndex + 1));
    };

    // Update current song when currentIndex changes
    useEffect(() => {
        setCurrentSong(songs[currentIndex]);
    }, [currentIndex, setCurrentSong, songs]);

    // Remove animation lock after a short delay
    useEffect(() => {
        if (isAnimating) {
            const timer = setTimeout(() => setIsAnimating(false), 300); // Match transition duration
            return () => clearTimeout(timer);
        }
    }, [isAnimating]);

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="relative flex items-center justify-center pt-4 space-x-3">
                {songs && songs.length > 0 ? (
                    <>
                        {/* Previous Song */}
                        <div
                            onClick={handlePrev}
                            className={`cursor-pointer ${isAnimating ? 'pointer-events-none' : ''
                                }`}
                        >
                            <img
                                src={songs[(currentIndex - 1 + songs.length) % songs.length]?.image[0]?.url}
                                alt={songs[(currentIndex - 1 + songs.length) % songs.length]?.name}
                                className={`song-prev rounded-lg w-16 h-16 object-cover transform transition-transform duration-300 ${isAnimating ? 'translate-x-full' : 'translate-x-0'
                                    }`}
                            />
                        </div>

                        {/* Current Song */}
                        <div className="cursor-pointer">
                            <img
                                src={songs[currentIndex]?.image[2]?.url}
                                alt={songs[currentIndex]?.name}
                                className={`song-current rounded-lg w-24 h-24 object-cover shadow-lg transform transition-transform duration-300 ${isAnimating ? 'scale-105' : 'scale-100'
                                    }`}
                            />
                        </div>

                        {/* Next Song */}
                        <div
                            onClick={handleNext}
                            className={`cursor-pointer ${isAnimating ? 'pointer-events-none' : ''
                                }`}
                        >
                            <img
                                src={songs[(currentIndex + 1) % songs.length]?.image[0]?.url}
                                alt={songs[(currentIndex + 1) % songs.length]?.name}
                                className={`song-next rounded-lg w-16 h-16 object-cover transform transition-transform duration-300 ${isAnimating ? '-translate-x-full' : 'translate-x-0'
                                    }`}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <Skeleton className="rounded-lg w-16 h-16 object-cover" />
                        <Skeleton className="rounded-lg w-24 h-24 object-cover shadow-lg" />
                        <Skeleton className="rounded-lg w-16 h-16 object-cover" />
                    </>
                )}
            </div>

            {/* Song Details */}
            {songs && songs.length > 0 && (
                <div className="mt-5 text-center">
                    <p className="font-semibold font-mono truncate max-w-xs mx-auto">
                        {decodeHtml(songs[currentIndex]?.name)}
                    </p>
                    <p className="font-mono text-gray-400 text-xs truncate max-w-xs mx-auto">
                        {decodeHtml(
                            songs[currentIndex]?.artists?.primary
                                ?.slice(0, 2)
                                .map((a) => a.name)
                                .join(', ')
                        )}
                    </p>
                    <p className="font-mono text-gray-400 text-xs truncate max-w-xs mx-auto">
                        {decodeHtml(currentSong?.album?.name)}
                    </p>
                </div>
            )}
        </div>
    );
};

export default SongCarousel;
