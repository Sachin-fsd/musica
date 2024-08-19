'use client'
import React, { useContext, useEffect, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { UserContext } from '@/context';
import { Skeleton } from '../ui/skeleton';
import { decodeHtml } from '@/utils';

const SongCarousel = ({ songs }) => {
    // console.log(songs)
    const { currentSong, setCurrentSong, currentIndex, setCurrentIndex, songList } = useContext(UserContext)

    const getStyles = (index) => {
        const isCurrent = index === currentIndex;
        const isPrev = index === (currentIndex - 1 + songs.length) % songs.length;
        const isNext = index === (currentIndex + 1) % songs.length;

        if (isCurrent) {
            return {
                transform: 'scale(1.25)',
                zIndex: 20,
                opacity: 1,
            };
        }

        if (isPrev || isNext) {
            return {
                transform: 'scale(0.9)',
                zIndex: 10,
                opacity: 0.7,
            };
        }

        return {
            transform: 'scale(0.8)',
            zIndex: 1,
            opacity: 0.5,
        };
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? songs.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === songs.length - 1 ? 0 : prevIndex + 1));
    };
    useEffect(() => {
        setCurrentSong(songs[currentIndex])
    }, [currentIndex])

    const formatSingers = (song) => {
        if (!song.artists || !song.artists.primary) return '';

        // Join artist names with a comma
        const singers = song.artists.primary.map(artist => artist.name).join(', ');
        return singers;
    }


    return (
        <div className='flex flex-col justify-center items-center'>
            <div className="relative flex items-center justify-center pt-4 space-x-3">
                {
                    songs ? (
                        <>
                            <div onClick={handlePrev} className="cursor-pointer">
                                <animated.div style={useSpring(getStyles((currentIndex - 1 + songs.length) % songs.length))}>
                                    <img
                                        src={songs[(currentIndex - 1 + songs.length) % songs.length].image[0].url}
                                        alt={songs[(currentIndex - 1 + songs.length) % songs.length].name}
                                        className="rounded-lg w-16 h-16 object-cover"
                                    />
                                </animated.div>
                            </div>
                            <div className="cursor-pointer">
                                <animated.div style={useSpring(getStyles(currentIndex))}>
                                    <img
                                        src={songs[currentIndex].image[2].url}
                                        alt={songs[currentIndex].name}
                                        className="rounded-lg w-24 h-24 object-cover shadow-lg"
                                    />
                                </animated.div>
                            </div>
                            <div onClick={handleNext} className="cursor-pointer">
                                <animated.div style={useSpring(getStyles((currentIndex + 1) % songs.length))}>
                                    <img
                                        src={songs[(currentIndex + 1) % songs.length].image[0].url}
                                        alt={songs[(currentIndex + 1) % songs.length].name}
                                        className="rounded-lg w-16 h-16 object-cover"
                                    />
                                </animated.div>
                            </div>
                        </>

                    ) : (
                        <>
                            <div className="cursor-pointer">
                                <animated.div >
                                    <Skeleton
                                        className="rounded-lg w-16 h-16 object-cover"
                                    />
                                </animated.div>
                            </div>
                            <div className="cursor-pointer">
                                <animated.div>
                                    <Skeleton
                                        className="rounded-lg w-24 h-24 object-cover shadow-lg"
                                    />
                                </animated.div>
                            </div>
                            <div className="cursor-pointer">
                                <animated.div >
                                    <Skeleton
                                        className="rounded-lg w-16 h-16 object-cover"
                                    />
                                </animated.div>
                            </div>
                        </>
                    )
                }

            </div>
            {songs && (
                <div className='mt-5 text-center'>
                    <p className='font-semibold font-mono truncate max-w-xs mx-auto'>{decodeHtml(songs[currentIndex].name)}</p> {/* Decode HTML here */}
                    <p className='font-extralight font-mono text-gray-600 text-xs truncate max-w-xs mx-auto'>{decodeHtml(formatSingers(songs[currentIndex]))}</p> {/* Decode HTML here */}
                </div>
            )}

        </div >
    );
};

export default SongCarousel;
