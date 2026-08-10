'use client';

import { useContext, useState, useRef } from 'react';
import { Play, Pause, Loader2, ChevronLeft, ChevronRight, PlusCircle, MoreHorizontal } from 'lucide-react';
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
        <div className="flex flex-col gap-1 my-6 w-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 cursor-pointer group">
                    <Label className="text-xl font-bold tracking-tight text-foreground cursor-pointer sm:group-hover:text-primary transition-colors">
                        Your Top Songs
                    </Label>
                    <ChevronRight className="w-5 h-5 text-foreground sm:group-hover:text-primary transition-colors mt-0.5" />
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => handleScroll('left')}
                        className="p-1.5 rounded-full sm:hover:bg-secondary/80 text-muted-foreground sm:hover:text-foreground transition-all"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => handleScroll('right')}
                        className="p-1.5 rounded-full sm:hover:bg-secondary/80 text-muted-foreground sm:hover:text-foreground transition-all"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="grid grid-rows-4 grid-flow-col gap-x-4 gap-y-1 overflow-x-auto scrollbar-none scroll-smooth pb-2 pt-1"
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
                            className={`group flex items-center gap-3 p-1.5 rounded-lg w-[300px] sm:w-[320px] transition-all duration-200 cursor-pointer ${isCurrent
                                ? 'bg-orange-900'
                                : 'sm:hover:bg-brown'
                                }`}
                        >
                            <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                                <Image
                                    src={imageUrl}
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                    alt={decode(song.name || 'Song')}
                                />

                                {!isLoading && (
                                    <div className={`absolute inset-0 bg-black/40 transition-opacity duration-200 flex items-center justify-center ${isCurrent ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100'
                                        }`}>
                                        <div className="bg-primary text-primary-foreground rounded-full p-1 shadow-md">
                                            {isCurrent && playing ? (
                                                <Pause className="w-3 h-3 fill-current" />
                                            ) : (
                                                <Play className="w-3 h-3 fill-current ml-0.5" />
                                            )}
                                        </div>
                                    </div>
                                )}

                                {isLoading && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-shrink-0 w-5 text-center font-bold text-sm text-foreground">
                                {index + 1}
                            </div>

                            <div className="flex flex-col min-w-0 flex-1 justify-center">
                                <h4 className={`text-sm font-semibold truncate ${isCurrent ? 'text-primary' : 'text-foreground'
                                    }`}>
                                    {decode(song.name)}
                                </h4>
                                <p className="text-xs text-muted-foreground truncate">
                                    {song.artist && decode(song.artist)}
                                </p>
                            </div>

                            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    className="p-1 text-muted-foreground sm:hover:text-foreground transition-colors"
                                    aria-label="Add"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    className="p-1 text-muted-foreground sm:hover:text-foreground transition-colors"
                                    aria-label="More"
                                >
                                    <MoreHorizontal className="w-4 h-4" />
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
