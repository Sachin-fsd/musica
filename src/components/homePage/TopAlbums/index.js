'use client'

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AlbumBar from './AlbumBar';
import { Label } from '@/components/ui/label';

const TopAlbums = ({ heading, albums }) => {
    // console.log(heading, albums)
    const softAlbumsRef = useRef(null);

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
                    <Label className="text-2xl font-bold text-sky-900 dark:text-sky-400">{heading}</Label>
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
                        {albums.length > 0 ? (
                            albums.map((album, index) => (

                                <div
                                    key={index}
                                    className='border mr-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm min-w-[25%] md:min-w-[17%] hover:shadow-md transition'
                                >
                                    {album && album.image && <AlbumBar album={album} index={index} />}
                                </div>
                            ))
                        ) : (
                            <div className='flex items-center justify-center w-full h-32 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'>
                                <p>No albums available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopAlbums;
