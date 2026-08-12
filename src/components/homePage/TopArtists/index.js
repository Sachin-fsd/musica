'use client';

import { useContext, useState, useRef } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Play,
    Loader2,
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { UserContext } from '@/context';
import { fetchArtistSongsAction } from '@/app/actions';
import { toast } from 'sonner';
import { decode } from 'he';
import Image from 'next/image';

const TopArtists = ({ artists = [] }) => {
    const {
        setSongList,
        setCurrentSong,
        setPlaying,
    } = useContext(UserContext);

    const [loadingArtistId, setLoadingArtistId] = useState(null);
    const scrollRef = useRef(null);

    const handleArtistClick = async (artist) => {
        if (!artist.artistId || loadingArtistId === artist.artistId) {
            return;
        }

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
        if (!scrollRef.current) return;

        scrollRef.current.scrollBy({
            left: direction === 'left' ? -220 : 220,
            behavior: 'smooth',
        });
    };

    if (!artists.length) return null;

    return (
        <section className="flex flex-col gap-4 mt-5">
            <div className="flex items-center justify-between">
                <Label className="text-xl md:text-2xl font-bold text-foreground">
                    Your Top Artists
                </Label>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="w-9 h-9 rounded-full flex items-center justify-center bg-foreground/[0.06] border border-foreground/[0.06] text-foreground/60 sm:hover:text-foreground sm:hover:bg-foreground/[0.10] transition-all"
                        aria-label="Previous artists"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <button
                        onClick={() => scroll('right')}
                        className="w-9 h-9 rounded-full flex items-center justify-center bg-foreground/[0.06] border border-foreground/[0.06] text-foreground/60 sm:hover:text-foreground sm:hover:bg-foreground/[0.10] transition-all"
                        aria-label="Next artists"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <div className="relative w-full">
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto no-scrollbar gap-5 pb-1"
                    style={{ scrollbarWidth: 'none' }}
                >
                    {artists.map((artist) => {
                        const isLoading = loadingArtistId === artist.artistId;
                        const imageUrl = artist.image || '/fallback/artist-music.png';
                        const artistName = decode(artist.artist);

                        return (
                            <div
                                key={artist.artistId}
                                onClick={() => handleArtistClick(artist)}
                                className="group flex flex-col items-center cursor-pointer flex-shrink-0 w-[105px]"
                            >
                                <div
                                    className="relative w-[96px] h-[96px] md:w-[104px] md:h-[104px] rounded-full p-[2px] bg-gradient-to-br from-[color:var(--song-theme-light)] via-[color:var(--song-theme)] to-[color:var(--song-theme-dark)] transition-all duration-700 sm:group-hover:scale-[1.04] sm:group-hover:shadow-[0_0_20px_var(--song-theme-soft)]"
                                    style={{ transition: 'background 0.8s ease, box-shadow 0.8s ease, transform 0.3s ease' }}
                                >
                                    <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-100 dark:bg-[#080611]">
                                        <Image
                                            src={imageUrl}
                                            fill
                                            sizes="104px"
                                            className="object-cover transition-transform duration-500 sm:group-hover:scale-104"
                                            alt={artistName}
                                        />

                                        {isLoading && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                                                <Loader2 className="w-7 h-7 text-[color:var(--song-theme-strong)] animate-spin transition-colors duration-700" />
                                            </div>
                                        )}
                                    </div>

                                    {!isLoading && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleArtistClick(artist);
                                            }}
                                            className="absolute right-0 bottom-0 w-[27px] h-[27px] rounded-full flex items-center justify-center bg-[#151020] border border-white/10 text-white shadow-lg shadow-black/40 transition-all duration-700 sm:group-hover:bg-[color:var(--song-theme)] sm:group-hover:border-[color:var(--song-theme-strong)] sm:group-hover:scale-110"
                                            aria-label={`Play ${artistName}`}
                                        >
                                            <Play className="w-[12px] h-[12px] fill-current ml-[1px]" />
                                        </button>
                                    )}
                                </div>

                                <div className="mt-2.5 w-full text-center">
                                    <h4 className="text-[11px] md:text-xs font-medium text-foreground/85 truncate transition-colors duration-200 sm:group-hover:text-foreground">
                                        {artistName}
                                    </h4>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default TopArtists;