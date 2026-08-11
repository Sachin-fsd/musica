'use client';

import { useContext, useState, useRef } from 'react';
import { Play, Pause, Loader2, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { UserContext } from '@/context';
import { GetSongsByIdAction } from '@/app/actions';
import { toast } from 'sonner';
import { decode } from 'he';
import Image from 'next/image';

const FALLBACK_IMAGE = '/fallback/artist-music.png';

const TopSongsTaste = ({ songs = [] }) => {
    const { currentSong, playing, setPlaying, playSongAndCreateQueue } = useContext(UserContext);
    const [loadingSongId, setLoadingSongId] = useState(null);
    const scrollContainerRef = useRef(null);

    const handleScroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 340;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleSongClick = async (song) => {
        if (!song?.songId || loadingSongId) return;

        if (currentSong?.id === song.songId) {
            setPlaying(!playing);
            return;
        }

        try {
            setLoadingSongId(song.songId);
            const res = await GetSongsByIdAction('song', song.songId);
            const fullSong = res?.data?.[0];

            if (!fullSong?.id) {
                toast('Failed to load song.');
                return;
            }

            await playSongAndCreateQueue(fullSong);
        } catch (error) {
            console.error('Error in top song click:', error);
            toast('Failed to load song.');
        } finally {
            setLoadingSongId(null);
        }
    };

    if (!songs.length) return null;

    return (
        <div className="flex flex-col gap-2 my-6 w-full">
            {/* Header & Scroll Actions */}
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 cursor-pointer group">
                    <Label className="text-xl font-bold tracking-tight text-white cursor-pointer group-hover:text-[color:var(--song-theme,#d946ef)] transition-colors">
                        Your Top Songs
                    </Label>
                    <ChevronRight className="w-5 h-5 text-white/70 group-hover:text-[color:var(--song-theme,#d946ef)] transition-colors" />
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => handleScroll('left')}
                        className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-all active:scale-95"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => handleScroll('right')}
                        className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-all active:scale-95"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Grid Container */}
            <div
                ref={scrollContainerRef}
                className="grid grid-rows-4 grid-flow-col gap-x-2 gap-y-2.5 overflow-x-auto scrollbar-none scroll-smooth pb-2 pt-1"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}
            >
                {songs.map((song, index) => {
                    const isCurrent = currentSong?.id === song.songId;
                    const isLoading = loadingSongId === song.songId;
                    const imageUrl = song.image || FALLBACK_IMAGE;

                    return (
                        <div
                            key={song.songId}
                            onClick={() => handleSongClick(song)}
                            className={`group relative flex items-center justify-between p-2.5 rounded-2xl  border transition-all duration-300 cursor-pointer backdrop-blur-xl ${isCurrent
                                ? 'bg-white/[0.08] border-white/20 shadow-xl'
                                : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/10'
                                }`}
                        >
                            {/* Left Side: Artwork, Index & Meta */}
                            <div className="flex items-center gap-3.5 min-w-0 flex-1">
                                {/* Song Cover Artwork */}
                                <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-white/5 shadow-md border border-white/10">
                                    <Image
                                        src={imageUrl}
                                        fill
                                        sizes="48px"
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        alt={decode(song.name || 'Song')}
                                    />
                                </div>

                                {/* Track Number */}
                                <div className="flex-shrink-0 w-4 text-center font-bold text-sm text-white/40 group-hover:text-white/70 transition-colors">
                                    {index + 1}
                                </div>

                                {/* Title and Artist */}
                                <div className="flex flex-col min-w-0 flex-1 justify-center">
                                    <h4
                                        className={`text-sm font-semibold truncate transition-colors ${isCurrent ? 'text-[color:var(--song-theme,#d946ef)]' : 'text-white'
                                            }`}
                                    >
                                        {decode(song.name)}
                                    </h4>
                                    <p className="text-xs text-white/50 truncate font-normal mt-0.5">
                                        {song.artist ? decode(song.artist) : 'Unknown Artist'}
                                    </p>
                                </div>
                            </div>

                            {/* Right Side: Circular Play Button & Options */}
                            <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                                {/* Play / Pause Circle Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSongClick(song);
                                    }}
                                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 ${isCurrent
                                        ? 'text-white shadow-md scale-100'
                                        : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white hover:scale-105'
                                        }`}
                                    style={
                                        isCurrent
                                            ? {
                                                background: 'linear-gradient(135deg, var(--song-theme-strong, #d946ef), var(--song-theme, #d946ef))',
                                                boxShadow: '0 0 12px var(--song-theme-faint, rgba(217, 70, 239, 0.4))'
                                            }
                                            : undefined
                                    }
                                    aria-label={isCurrent && playing ? "Pause" : "Play"}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                                    ) : isCurrent && playing ? (
                                        <Pause className="w-4 h-4 fill-current" />
                                    ) : (
                                        <Play className="w-4 h-4 fill-current ml-0.5" />
                                    )}
                                </button>

                                {/* Options Dots Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    className="p-1.5 rounded-full text-white/30 hover:text-white hover:bg-white/10 transition-colors"
                                    aria-label="More options"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TopSongsTaste;