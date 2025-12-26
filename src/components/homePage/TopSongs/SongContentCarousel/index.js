'use client'

import { useContext, useRef, useMemo } from 'react'; // Added useMemo
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { UserContext } from '@/context';
import SongBarCarousel from './songBarCarousel';
import TouchableOpacity from '@/components/ui/touchableOpacity';
import { Skeleton } from '@/components/ui/skeleton';

const SongContentCarousel = () => {
    const { songList } = useContext(UserContext);
    const softAlbumsRef = useRef(null);

    // Memoize the song list rendering to avoid unnecessary re-calculations during render
    const renderedSongs = useMemo(() => {
        return songList?.length > 0 && typeof songList == 'object' ? (
            songList?.map((song, index) => (
                <div
                    key={index}
                    className='mr-1 sm:hover:bg-white dark:sm:hover:bg-gray-800 rounded-lg shadow-sm min-w-52 max-w-52 hover:shadow-md transition'
                >
                    {song?.image &&
                        <TouchableOpacity>
                            <SongBarCarousel song={song} index={index} />
                        </TouchableOpacity>
                    }
                </div>
            ))
        ) : (
            <div className='flex gap-1 overflow-x-auto scroll-smooth hide-scrollbar'>
                <Skeleton className="h-32 w-32 rounded" />
                <Skeleton className="h-32 w-32 rounded" />
                <Skeleton className="h-32 w-32 rounded" />
                <Skeleton className="h-32 w-32 rounded" />
            </div>
        );
    }, [songList]);

    const scroll = (ref, direction) => {
        if (ref.current) {
            ref.current.scrollBy({
                left: direction === 'left' ? -200 : 200,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className='flex flex-col gap-8 mt-4'>
            {/* Albums Section */}
            <div className='flex-1'>
                <div className='flex items-center justify-between mb-4'>
                    <Label className="text-2xl font-bold text-sky-900 dark:text-white">Now Playing</Label>
                    <div className='flex items-center space-x-2'>
                        <button
                            onClick={() => scroll(softAlbumsRef, 'left')}
                            className='p-2 bg-white dark:bg-gray-800 shadow-sm rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition'>
                            <ChevronLeft size={20} className='text-gray-600 dark:text-gray-300' />
                        </button>
                        <button
                            onClick={() => scroll(softAlbumsRef, 'right')}
                            className='p-2 bg-white dark:bg-gray-800 shadow-sm rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition'>
                            <ChevronRight size={20} className='text-gray-600 dark:text-gray-300' />
                        </button>
                    </div>
                </div>
                <div className='relative max-w-full'>
                    <div ref={softAlbumsRef} className='flex overflow-x-auto scroll-smooth hide-scrollbar'>
                        {renderedSongs}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SongContentCarousel;