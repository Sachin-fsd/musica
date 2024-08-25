'use client'
import SongBar from "@/components/songBar";
import { Label } from "@/components/ui/label";
import { songs } from "@/utils/cachedSongs";
import AlbumBar from "../AlbumBar";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import AlbumMulticarousel from "@/components/carousel";

const AlbumCarousel = () => {
   
    
    return (
        <div className='flex flex-col gap-6'>
            {/* Top Charts Section */}
            <div className='flex-1'>
                <div className='flex items-center justify-between mb-4'>
                    <Label className="text-xl font-bold text-sky-900">Moody Pics</Label>
                    
                </div>
                <div className='overflow-hidden'>
                    <AlbumMulticarousel />
                    {/* <div
                        ref={carouselRef}
                        className='flex transition-transform duration-500 ease-out'
                        style={{ width: `${100 * songs.length / itemsToShow}%` }} // Adjust the container width
                    >
                        {songs.map((song, index) => (
                            <div
                                key={index}
                                className={`p-2 border bg-gray-300 rounded flex-shrink-0`}
                                style={{ minWidth: `${100 / itemsToShow}%` }} // Adjust the item width
                            >
                                <AlbumBar song={song} index={index} />
                            </div>
                        ))}
                    </div> */}


                </div>
            </div>
        </div>
    );
};

export default AlbumCarousel;
