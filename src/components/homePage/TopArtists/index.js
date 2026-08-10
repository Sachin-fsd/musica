'use client';

import { useContext, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { UserContext } from '@/context';
import { fetchArtistSongsAction } from '@/app/actions';
import { toast } from 'sonner';
import { decode } from 'he';
import Image from 'next/image';

const TopArtists = ({ artists = [] }) => {
    const { setSongList, setCurrentSong, setPlaying } = useContext(UserContext);
    const [loadingArtistId, setLoadingArtistId] = useState(null);
    const scrollRef = useRef(null);

    const handleArtistClick = async (artist) => {
        if (!artist.artistId || loadingArtistId === artist.artistId) return;

        try {
            setLoadingArtistId(artist.artistId);
            const response = await fetchArtistSongsAction(artist.artistId);

            if (response?.success && response.data?.songs?.length >= 1) {
                setSongList(response.data.songs);
                setCurrentSong(response.data.songs[0]);
                setPlaying(true);
            } else {
                toast('🥲 No Songs to play');
                console.error('Error fetching artist songs:', response);
            }
        } catch (error) {
            console.error('Error in top artist click:', error);
            toast('Failed to load artist songs.');
        } finally {
            setLoadingArtistId(null);
        }
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -200 : 200,
                behavior: 'smooth',
            });
        }
    };

    if (!artists.length) return null;

    return (
        <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center justify-between mb-2">
                <Label className="text-2xl font-bold text-sky-900 dark:text-white">Your Top Artists</Label>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => scroll('left')}
                        className="p-2 bg-white dark:bg-gray-800 shadow-sm rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                        <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-2 bg-white dark:bg-gray-800 shadow-sm rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                        <ChevronRight size={20} className="text-gray-600 dark:text-gray-300" />
                    </button>
                </div>
            </div>

            <div className="relative max-w-full">
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto no-scrollbar gap-4"
                    style={{ scrollbarWidth: 'none' }}
                >
                    {artists.map((artist) => {
                        const isLoading = loadingArtistId === artist.artistId;
                        const imageUrl = artist.image || '/fallback/artist-music.png';

                        return (
                            <div
                                key={artist.artistId}
                                onClick={() => handleArtistClick(artist)}
                                className="group flex flex-col items-center gap-3 p-3 rounded-xl sm:hover:bg-secondary/40 transition-colors duration-300 ease-out cursor-pointer min-w-[140px] max-w-[140px]"
                            >
                                <div className="relative aspect-square w-full rounded-full overflow-hidden shadow-md">
                                    <Image
                                        src={imageUrl}
                                        fill
                                        sizes="140px"
                                        className="object-cover transition-transform duration-500 sm:group-hover:scale-105"
                                        alt={decode(artist.artist)}
                                    />

                                    {!isLoading && (
                                        <div className="absolute inset-0 bg-black/40 opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <div className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg transform translate-y-2 sm:group-hover:translate-y-0 transition-all duration-300 ease-out">
                                                <Play className="w-6 h-6 fill-current ml-1" />
                                            </div>
                                        </div>
                                    )}

                                    {isLoading && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col items-center text-center min-w-0 w-full">
                                    <h4 className="text-sm font-semibold truncate w-full text-foreground sm:group-hover:text-primary transition-colors">
                                        {decode(artist.artist)}
                                    </h4>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TopArtists;
