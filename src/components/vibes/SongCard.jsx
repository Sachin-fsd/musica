import React, { memo, useState, useContext, useMemo } from 'react';
import { Play, Pause, Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';
import { UserContext } from '@/context';
import { formatTime } from '@/utils/extraFunctions';
import { decode } from 'he';
import { cn } from '@/lib/utils';
import { Slider } from '../ui/slider';

const SongCard = memo(({ song, isActive, isPlaying }) => {
    // 1. Get global state.
    const { currentTime, duration, togglePlayPause, handleSeek } = useContext(UserContext);
    const [liked, setLiked] = useState(false);

    // If for some reason a null/undefined song gets passed, return nothing to prevent a crash.
    if (!song) {
        return null;
    }

    // 2. Calculate progress (this was already safe)
    const progress = useMemo(() => {
        if (isActive && duration > 0) {
            return (currentTime / duration) * 100;
        }
        return 0;
    }, [isActive, currentTime, duration]);

    // Utility to format numbers (this was already safe)
    const formatPlayCount = (count) => {
        if (!count) return '0';
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count.toString();
    };

    // --- FIX: Create safe variables for display ---
    // This makes the JSX cleaner and guarantees we have valid data or fallbacks.
    const imageUrl = song.image?.[2]?.url || song.image?.[1]?.url || song.image?.[0]?.url || '/default-album-art.png';
    const songTitle = song.name || "Untitled";
    const artistName = song.artists?.primary?.map(a => a.name).join(', ') || "Unknown Artist";
    const artistImageUrl = song.artists?.primary?.[0]?.image?.[1]?.url;
    const artistImageAlt = song.artists?.primary?.[0]?.name || "Artist";
    const albumName = song.album?.name || "Unknown Album";
    const songYear = song.year || "";

    return (
        <div className="relative w-full h-all overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src={imageUrl} // FIX: Use safe variable
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover filter blur-2xl scale-110"
                />
                <div className="absolute inset-0 bg-black/70" />
            </div>
            <div className='absolute inset-0 h-full w-full flex flex-1 justify-center items-center'>
                <img
                    src={imageUrl} // FIX: Use safe variable
                    alt={songTitle} // FIX: Use safe variable
                    className="w-auto h-auto max-w-[75%] max-h-[40%] md:max-w-[400px] md:max-h-[400px] rounded-2xl shadow-2xl object-cover -translate-y-16"
                    draggable={false}
                />
            </div>

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20" />
            
            {/* Main Content */}
            <div className="relative h-full flex">
                <div className="flex-1 flex flex-col justify-end p-5">
                    {artistImageUrl && ( // FIX: Only render artist image if it exists
                        <div className="mb-4">
                            <img
                                src={artistImageUrl}
                                alt={artistImageAlt}
                                className="w-12 h-12 rounded-full border-2 border-white/50 object-cover"
                            />
                        </div>
                    )}
                    <h1 className="text-white text-3xl font-bold mb-2 leading-tight shadow-lg">{decode(songTitle)}</h1>
                    <p className="text-white/80 text-lg mb-2 shadow-md">{decode(artistName)}</p>
                    <p className="text-white/60 text-sm mb-3 shadow-sm">{decode(albumName)} {songYear ? `• ${songYear}` : ''}</p> {/* FIX: Handle year safely */}
                    
                    <div className="flex justify-between text-white/60 text-sm">
                        <div className='flex items-center gap-1'>
                            <span>{formatPlayCount(song.playCount)} plays</span>
                            <span>•</span>
                            <span className="capitalize">{song.language || ''}</span> {/* FIX: Fallback for language */}
                        </div>
                        <div>
                            <span>{formatTime(currentTime)}</span>
                            <span>/</span>
                            <span>{formatTime(song.duration || 0)}</span> {/* FIX: Fallback for duration */}
                        </div>
                    </div>
                    <div className="w-full z-10 h-10 flex items-center">
                        <Slider
                            onValueChange={(value) => handleSeek(value[0])} // handleSeek likely expects a number, not an array
                            value={[currentTime]}
                            max={duration || 1} // FIX: Prevent max=0
                            className="bg-gray-200 dark:bg-gray-800 rounded-full"
                        />
                    </div>
                </div>

                <div onClick={togglePlayPause} className={cn(
                    "absolute inset-0 flex items-center justify-center transition-opacity duration-300 -translate-y-7",
                    isPlaying ? "opacity-0" : "opacity-100"
                )}>
                    <button className="w-20 h-20 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center">
                        <Play className="w-8 h-8 fill-white ml-1" />
                    </button>
                </div>
                {/* Other controls can be added back here safely */}
            </div>
        </div>
    );
});

SongCard.displayName = 'SongCard';

export default SongCard;