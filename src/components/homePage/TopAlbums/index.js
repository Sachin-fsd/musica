'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AlbumBar from './AlbumBar';
import { Label } from '@/components/ui/label';

const TopAlbums = ({ heading, albums }) => {
    const softAlbumsRef = useRef(null);
    const [scrollInterval, setScrollInterval] = useState(null);

    const scroll = (ref, direction, increment = 200) => {
        if (ref.current) {
            ref.current.scrollBy({
                left: direction === 'left' ? -increment : increment,
                behavior: 'smooth',
            });
        }
    };

    const handleClick = (ref, direction) => {
        scroll(ref, direction); // Perform a single scroll
    };

    const handleLongPress = (ref, direction) => {
        // Start continuous scrolling on long press
        const interval = setInterval(() => {
            scroll(ref, direction, 20); // Smaller increments for smooth long-press scroll
        }, 50); // Adjust for speed
        setScrollInterval(interval);
    };

    const handlePressEnd = () => {
        // Stop continuous scrolling
        clearInterval(scrollInterval);
        setScrollInterval(null);
    };

    return (
        <div className='flex flex-col gap-8 mt-4'>
            {/* Albums Section */}
            <div className='flex-1'>
                <div className='flex items-center justify-between mb-4'>
                    <Label className="text-2xl font-bold text-sky-900 dark:text-sky-400">{heading}</Label>
                    <div className='flex items-center space-x-2'>
                        {/* Left Button */}
                        <button
                            onClick={() => handleClick(softAlbumsRef, 'left')}
                            onMouseDown={() => handleLongPress(softAlbumsRef, 'left')}
                            onTouchStart={() => handleLongPress(softAlbumsRef, 'left')}
                            onMouseUp={handlePressEnd}
                            onMouseLeave={handlePressEnd}
                            onTouchEnd={handlePressEnd}
                            className='p-2 bg-white dark:bg-gray-800 shadow-sm rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition'>
                            <ChevronLeft size={20} className='text-gray-600 dark:text-gray-300' />
                        </button>
                        {/* Right Button */}
                        <button
                            onClick={() => handleClick(softAlbumsRef, 'right')}
                            onMouseDown={() => handleLongPress(softAlbumsRef, 'right')}
                            onTouchStart={() => handleLongPress(softAlbumsRef, 'right')}
                            onMouseUp={handlePressEnd}
                            onMouseLeave={handlePressEnd}
                            onTouchEnd={handlePressEnd}
                            className='p-2 bg-white dark:bg-gray-800 shadow-sm rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition'>
                            <ChevronRight size={20} className='text-gray-600 dark:text-gray-300' />
                        </button>
                    </div>
                </div>
                <div className='relative max-w-full'>
                    <div ref={softAlbumsRef} className='flex overflow-x-auto scroll-smooth hide-scrollbar'>
                        {albums?.length > 0 ? (
                            albums.map((album, index) => (
                                album.image ? <div
                                    key={index}
                                    className='mr-1 hover:bg-white dark:hover:bg-gray-800 rounded-lg shadow-sm min-w-[25%] md:min-w-[17%] hover:shadow-md transition'
                                >
                                    <AlbumBar album={album} index={index} />
                                </div> : null
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
