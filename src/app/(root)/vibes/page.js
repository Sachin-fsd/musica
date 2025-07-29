'use client'

import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { Heart, MessageCircle, Share, Home, Search, Music, Library, User, Volume2, Pause, Play } from 'lucide-react';
import artistAvatar from '@/assets/user.png';
import userAvatar from '@/assets/user.png';
import vibeBg from '@/assets/cat-bg.webp';
import { UserContext } from '@/context';
import millify from 'millify';
import { decode } from 'he';
import BottomNavBar from '@/components/bottomNavBar/BottomNavBar';
import { playAndFetchSuggestions } from '@/utils/playAndFetchSuggestionUtils';

const VibesInterface = () => {
    const wasDragging = useRef(false);
    const [showPlayPause, setShowPlayPause] = useState(false);
    const [lastPlayState, setLastPlayState] = useState(false);
    const { playing, togglePlayPause, setCurrentIndex, currentIndex, setSongList, songList, setCurrentSong, setPlaying, audioRef, setCurrentId, currentSong, loading } = useContext(UserContext);
    //   const [currentIndex, setCurrentIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const containerRef = useRef(null);
    const startY = useRef(0);
    const currentY = useRef(0);
    const isDragging = useRef(false);

    const currentVibe = songList[currentIndex];

    const handlePlayPauseClick = (e) => {
        e.stopPropagation();
        setLastPlayState(playing); // Save the previous state
        togglePlayPause();
        setShowPlayPause(true);
        setTimeout(() => setShowPlayPause(false), 600); // Hide after 600ms
    };

    const handleChange = useCallback((song) => {
        if (!song || loading) return; // Skip if no song or already loading
        audioRef.current.src = song.downloadUrl[4].url;
        audioRef.current.play();
        const context = { setCurrentIndex, currentIndex, setSongList, songList, setCurrentSong, setPlaying, audioRef, setCurrentId, currentSong };
        playAndFetchSuggestions(song, context).catch((error) => console.error("Error in handleClick:", error));
    }, [setCurrentIndex, currentIndex, setSongList, songList, setCurrentSong, setPlaying, audioRef, setCurrentId, currentSong, loading]);

    // Handle smooth transition to next/previous vibe
    const goToVibe = useCallback((newIndex) => {
        if (isTransitioning || newIndex < 0 || newIndex >= songList.length) return;

        setIsTransitioning(true);
        setCurrentIndex(newIndex);
        setIsLiked(false); // Reset like state for new vibe

        // Reset transition after animation
        setTimeout(() => {
            setIsTransitioning(false);
        }, 500);
    }, [isTransitioning]);

    useEffect(() => {
        if (currentVibe) {
            handleChange(currentVibe);
        }
    }, [currentIndex]);

    // Touch/Mouse event handlers for smooth scrolling
    const handleStart = (clientY) => {
        if (isTransitioning) return;
        isDragging.current = true;
        wasDragging.current = false; // reset on start
        startY.current = clientY;
        currentY.current = clientY;
    };

    const handleMove = (clientY) => {
        if (!isDragging.current || isTransitioning) return;
        currentY.current = clientY;
    };

    const handleEnd = () => {
        if (!isDragging.current || isTransitioning) return;

        const deltaY = startY.current - currentY.current;
        const threshold = 50; // Minimum swipe distance

        if (Math.abs(deltaY) > threshold) {
            wasDragging.current = true; // Only set true if it was a swipe
            if (deltaY > 0 && currentIndex < songList.length - 1) {
                goToVibe(currentIndex + 1);
            } else if (deltaY < 0 && currentIndex > 0) {
                goToVibe(currentIndex - 1);
            }
        } else {
            wasDragging.current = false; // It was a tap/click, not a swipe
        }
        isDragging.current = false;
        startY.current = 0;
        currentY.current = 0;
    };
    // Mouse events
    const handleMouseDown = (e) => {
        e.preventDefault();
        handleStart(e.clientY);
    };

    const handleMouseMove = (e) => {
        handleMove(e.clientY);
    };

    const handleMouseUp = () => {
        handleEnd();
    };

    // Touch events
    const handleTouchStart = (e) => {
        handleStart(e.touches[0].clientY);
    };

    const handleTouchMove = (e) => {
        handleMove(e.touches[0].clientY);
    };

    const handleTouchEnd = () => {
        handleEnd();
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowUp' && currentIndex > 0) {
                goToVibe(currentIndex - 1);
            } else if (e.key === 'ArrowDown' && currentIndex < songList.length - 1) {
                goToVibe(currentIndex + 1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, goToVibe]);

    // Wheel/scroll events for desktop
    useEffect(() => {
        const handleWheel = (e) => {
            e.preventDefault();
            if (isTransitioning) return;

            if (e.deltaY > 0 && currentIndex < songList.length - 1) {
                goToVibe(currentIndex + 1);
            } else if (e.deltaY < 0 && currentIndex > 0) {
                goToVibe(currentIndex - 1);
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
            return () => container.removeEventListener('wheel', handleWheel);
        }
    }, [currentIndex, goToVibe, isTransitioning]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full bg-darker-surface overflow-hidden select-none border"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={(e) => {
                if (!wasDragging.current) {
                    handlePlayPauseClick(e);
                }
            }}
        >
            {/* Video Background with smooth transition */}
            <div
                className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 ease-out ${isTransitioning ? 'scale-110 opacity-80' : 'scale-100 opacity-100'
                    }`}
                style={{ backgroundImage: `url(${currentVibe.image[2].url})` }}
            >
                <div className="absolute inset-0 bg-gradient-overlay" />
            </div>

            {/* Main Content Overlay */}
            <div className={`relative z-10 h-full flex flex-col transition-all duration-500 ease-out ${isTransitioning ? 'opacity-90 transform translate-y-2' : 'opacity-100 transform translate-y-0'
                }`}>

                {/* Progress Indicators */}
                {/* <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-1 z-30">
          {songList.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${index === currentIndex
                  ? 'w-8 bg-neon-blue shadow-glow-neon'
                  : 'w-4 bg-white/30'
                }`}
            />
          ))}
        </div> */}

                {/* Bottom Content Area */}
                <div className="flex-1 flex items-end pb-24">
                    <div className="w-full px-4 flex justify-between items-end">

                        {/* Left Side - Artist Info */}
                        <div className="flex-1">
                            <div className="mb-4">
                                <div className="flex items-center mb-2">
                                    <h2 className="text-white font-semibold text-lg">{decode(currentVibe.name)}</h2>
                                    <div className="ml-3 flex items-center">
                                        <Volume2 className="w-4 h-4 text-neon-blue mr-1 animate-pulse" />
                                        <div className="flex space-x-1">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div
                                                    key={i}
                                                    className="w-1 bg-neon-blue rounded-full animate-pulse"
                                                    style={{
                                                        height: `${Math.random() * 16 + 8}px`,
                                                        animationDelay: `${i * 0.1}s`
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-white/90 font-medium text-base mb-1">{currentVibe.artists.primary[0].name.slice(0, 11)}</p>
                            </div>
                        </div>

                        {/* Right Side - Interaction Buttons */}
                        <div className="flex flex-col items-center space-y-6 ml-4">

                            {/* User Profile */}
                            <div className="relative">
                                <img
                                    src={currentVibe.artists.primary[0].image[0].url}
                                    alt="User"
                                    className="w-14 h-14 rounded-full border-2 border-white object-cover"
                                />
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-neon-pink rounded-full flex items-center justify-center border-2 border-darker-surface">
                                    <span className="text-white text-xs font-bold">+</span>
                                </div>
                            </div>

                            {/* Like Button */}
                            <div className="flex flex-col items-center">
                                <button
                                    onClick={() => setIsLiked(!isLiked)}
                                    className="w-12 h-12 bg-surface-dark/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                                    style={{ boxShadow: isLiked ? 'var(--glow-pink)' : 'none' }}
                                >
                                    <Heart
                                        className={`w-7 h-7 transition-colors duration-300 ${isLiked ? 'text-neon-pink fill-neon-pink' : 'text-white'
                                            }`}
                                    />
                                </button>
                                <span className="text-white text-xs mt-1 font-medium">{millify(currentVibe.playCount)}</span>
                            </div>

                            {/* Comment Button */}
                            {/* <div className="flex flex-col items-center">
                                <button className="w-12 h-12 bg-surface-dark/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                                    <MessageCircle className="w-7 h-7 text-white" />
                                </button>
                                <span className="text-white text-xs mt-1 font-medium">{currentVibe.album?.name || "abc studios"}</span>
                            </div> */}

                            {/* Share Button */}
                            <div className="flex flex-col items-center">
                                <button className="w-12 h-12 bg-surface-dark/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                                    <Share className="w-7 h-7 text-white" />
                                </button>
                                <span className="text-white text-xs mt-1 font-medium">{currentVibe.year}</span>
                            </div>

                            {/* Spinning Record */}
                            <div className="flex flex-col items-center mt-4">
                                <button
                                    onClick={() => {
                                        // Cycle through songs with same sound
                                        const nextIndex = (currentIndex + 1) % songList.length;
                                        goToVibe(nextIndex);
                                    }}
                                    className="relative transition-transform duration-300 hover:scale-110"
                                >
                                    <div className="w-12 h-12 bg-gradient-neon rounded-full animate-spin-slow flex items-center justify-center shadow-glow-neon">
                                        <img
                                            src={currentVibe.artists.primary[0].image[0].url}
                                            alt="Artist"
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute inset-0 border-2 border-white/30 rounded-full animate-spin-slow"></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Navigation */}

            </div>

            {/* Dynamic Swipe Indicators */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-2 z-20">
                <div className={`w-1 h-8 rounded-full transition-all duration-300 ${currentIndex > 0 ? 'bg-white/50' : 'bg-white/20'
                    }`}></div>
                <div className="w-1 h-4 bg-neon-blue rounded-full shadow-glow-neon"></div>
                <div className={`w-1 h-8 rounded-full transition-all duration-300 ${currentIndex < songList.length - 1 ? 'bg-white/50' : 'bg-white/20'
                    }`}></div>
            </div>

            {/* Swipe Hint (appears briefly) */}
            {currentIndex === 0 && (
                <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
                    <div className="bg-surface-dark/80 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                        <p className="text-white/70 text-sm">↑ Swipe up for next vibe</p>
                    </div>
                </div>
            )}

            {showPlayPause && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                    <div className="bg-black/40 rounded-full p-6 animate-fade-in-out">
                        {playing ? (
                            <Pause className="w-16 h-16 text-white drop-shadow-lg transition-all duration-300" />
                        ) : (
                            <Play className="w-16 h-16 text-white drop-shadow-lg transition-all duration-300" />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};



export default VibesInterface;