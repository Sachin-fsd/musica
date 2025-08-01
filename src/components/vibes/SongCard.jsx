import React, { useState, useContext, useMemo, useRef, useEffect } from 'react';
import { Play, Pause, Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';
import { UserContext } from '@/context';
import { formatTime } from '@/utils/extraFunctions';
import { decode } from 'he';
import { cn } from '@/lib/utils';
import { Slider } from '../ui/slider';

const SongCard = ({ song, isActive, isPlaying }) => {
    // 1. Get global state. No setters needed here.
    const { currentTime, duration, togglePlayPause, playing, handleSeek } = useContext(UserContext);
    const [showControls, setShowControls] = useState(false);
    const [liked, setLiked] = useState(false);

    function handleScreenClick() {
        togglePlayPause()
        setShowControls(true);
        setTimeout(() => {
            setShowControls(false);
        }, 500)
    }

    // 2. Calculate progress based on the global state, only if this card is active
    const progress = useMemo(() => {
        if (isActive && duration > 0) {
            return (currentTime / duration) * 100;
        }
        return 0;
    }, [isActive, currentTime, duration]);

    // Utility to format large numbers
    const formatPlayCount = (count) => {
        if (!count) return '0';
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count.toString();
    };

    return (
        <div className="relative w-full h-[calc(100vh-60px)] md:h-full overflow-hidden hide-scrollbar">
            {/* Background Image */}

            <div className="absolute inset-0 w-full h-full hide-scrollbar">
                {/* The image itself, used as a background layer */}
                <img
                    src={song.image[2]?.url}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover filter blur-2xl scale-110"
                />
                {/* A dark overlay to ensure text is readable */}
                <div className="absolute inset-0 bg-black/70" />
            </div>
            <div className='absolute inset-0 h-full w-full flex flex-1 justify-center items-center'>
                <img
                    src={song.image[2]?.url}
                    alt={song.name}
                    className="w-auto h-auto max-w-[75%] max-h-[45%] md:max-w-[400px] md:max-h-[400px] rounded-2xl shadow-2xl object-cover"
                    draggable={false}
                // style={{ userSelect: "none", pointerEvents: "none" }}
                />

            </div>

            {/* Overlays for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20" />

            {/* Progress Bar */}


            {/* Main Content */}
            <div className="relative h-[calc(100vh-60px)] md:h-full flex">
                {/* Left Side: Song Information */}
                <div className="flex-1 flex flex-col justify-end p-5">
                    <div className="mb-4">
                        <img
                            src={song.artists.primary[0]?.image[1]?.url}
                            alt={song.artists.primary[0]?.name}
                            className="w-12 h-12 rounded-full border-2 border-white/50 object-cover"
                        />
                    </div>
                    <h1 className="text-white text-3xl font-bold mb-2 leading-tight shadow-lg">{decode(song.name)}</h1>
                    <p className="text-white/80 text-lg mb-2 shadow-md">{decode(song.artists.primary.map(a => a.name).join(', '))}</p>
                    <p className="text-white/60 text-sm mb-3 shadow-sm">{decode(song.album.name)} • {song.year}</p>
                    <div className="flex justify-between text-white/60 text-sm">
                        <div className='flex items-center gap-1'>
                            <span>{formatPlayCount(song.playCount)} plays</span>

                            <span>•</span>
                            <span className="capitalize">{song.language}</span>
                        </div>
                        <div>
                            <span>{formatTime(currentTime)}</span>
                            <span>/</span>
                            <span>{formatTime(song.duration)}</span>
                        </div>

                    </div>
                    <div className="w-full z-10 h-10 flex items-center">
                        <Slider
                            onValueChange={handleSeek}
                            value={[currentTime]}
                            max={duration}
                            className="bg-gray-200 dark:bg-gray-800 rounded-full"
                        />
                    </div>
                </div>

                <div onClick={handleScreenClick} className={cn(
                    "absolute inset-0 flex items-center justify-center transition-all duration-300",
                    playing ? "opacity-0 scale-125" : "opacity-100 scale-100"
                    // showControls ? "opacity-100 scale-100" : "opacity-0 scale-125 pointer-events-none"
                )}>
                    <button
                        className="w-20 h-20 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center"
                    // onClick={handleScreenClick}
                    >
                        {isPlaying ? (
                            <Pause className="w-8 h-8 fill-white" />
                        ) : (
                            <Play className="w-8 h-8 fill-white ml-1" />
                        )}
                    </button>
                </div>

                {/* Right Side: Action Controls */}
                {/* <div className="w-20 flex flex-col justify-end items-center space-y-6 pb-6">
                    <button
                        onClick={togglePlayPause}
                        className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200 hover:scale-110"
                    >
                        {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white ml-1" />}
                    </button>
                    <button onClick={() => setLiked(!liked)} className="flex flex-col items-center hover:scale-110 transition-transform">
                        <Heart className={`w-8 h-8 ${liked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                        <span className="text-white text-xs mt-1">Like</span>
                    </button>
                    <button className="flex flex-col items-center hover:scale-110 transition-transform">
                        <MessageCircle className="w-8 h-8 text-white" />
                        <span className="text-white text-xs mt-1">Chat</span>
                    </button>
                    <button className="flex flex-col items-center hover:scale-110 transition-transform">
                        <Share className="w-8 h-8 text-white" />
                        <span className="text-white text-xs mt-1">Share</span>
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default SongCard;