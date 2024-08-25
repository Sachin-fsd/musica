'use client'

import { useRef} from 'react';
import { ChevronLeft, ChevronRight, Ellipsis } from 'lucide-react';
import AlbumBar from './AlbumBar';
import { Label } from '@/components/ui/label';

const TopAlbums = ({heading, albums}) => {
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
            {/* Soft Albums Section */}
            <div className='flex-1'>
                <div className='flex items-center justify-between mb-4'>
                    <Label className="text-2xl font-bold text-sky-900">{heading}</Label>
                    <Ellipsis className='p-2 border border-gray-300 rounded-full text-gray-600 cursor-pointer hover:bg-gray-100 transition' />
                </div>
                <div className='relative  max-w-[100%]'>
                    <button
                        onClick={() => scroll(softAlbumsRef, 'left')}
                        className='absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-white shadow-md rounded-full z-10 hover:bg-gray-200 transition'>
                        <ChevronLeft size={24} />
                    </button>
                    <div ref={softAlbumsRef} className='flex overflow-x-auto scroll-smooth hide-scrollbar '>
                        {albums.map((album, index) => (
                            <div
                                key={index}
                                className=' border bg-white rounded-lg shadow-sm  min-w-[25%] md:min-w-[20%] hover:shadow-md transition max-w-[25%]'
                            >
                                {
                                    album && album.image && <AlbumBar album={album} index={index} />
                                }


                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => scroll(softAlbumsRef, 'right')}
                        className='absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-white shadow-md rounded-full z-10 hover:bg-gray-200 transition'>
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            {/* Party Albums Section */}
            {/* <div className='flex-1'>
                <div className='flex items-center justify-between mb-6'>
                    <Label className="text-2xl font-bold text-sky-900">Party Albums</Label>
                    <Ellipsis className='p-2 border border-gray-300 rounded-full text-gray-600 cursor-pointer hover:bg-gray-100 transition' />
                </div>
                <div className='relative bg-red-300 max-w-[100%]'>
                    <button
                        onClick={() => scroll(partyAlbumsRef, 'left')}
                        className='absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-white shadow-md rounded-full z-10 hover:bg-gray-200 transition'>
                        <ChevronLeft size={24} />
                    </button>
                    <div ref={partyAlbumsRef} className='flex overflow-x-auto scroll-smooth'>
                        {albums.map((album, index) => (

                            <div
                                key={index}
                                className=' border bg-white rounded-lg shadow-sm  min-w-[25%] md:min-w-[20%] hover:shadow-md transition max-w-[25%]'
                            >
                                {
                                    album && album.image && <AlbumBar album={album} index={index} />
                                }


                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => scroll(partyAlbumsRef, 'right')}
                        className='absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-white shadow-md rounded-full z-10 hover:bg-gray-200 transition'>
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div> */}
        </div>
    );
};

export default TopAlbums;
