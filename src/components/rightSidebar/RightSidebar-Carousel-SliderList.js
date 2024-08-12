'use client'
import { UserContext } from "@/context";
import { Slider } from "../ui/slider"
import SongCarousel from "./songCarousel"
import SongsListComponent from "./songsList"
import { useContext, useEffect } from "react";
import { songs } from '@/utils/cachedSongs'

const RightSidebarCarouselSliderList = () => {
    const { currentTime, duration, handleSeek, songList,setSongList } = useContext(UserContext);

    // setSongList("songList",songList)
    // console.log()
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    useEffect(()=>{
        console.log("currentTime",currentTime)
    },[currentTime])

    return (
        <div>
            <div className="">
                <SongCarousel songs={songList} />
            </div>
            <div className="mb-2">
                <Slider 
                    onValueChange={handleSeek} 
                    value={[currentTime]} 
                    max={duration} 
                    className="px-3 pt-3 mb-2 shadow-lg" 
                />
                <div className="flex items-center justify-between m-0">
                    <span className="text-xs">{formatTime(currentTime)}</span>
                    <span className="text-xs">{formatTime(duration)}</span>
                </div>
            </div>
            <SongsListComponent songsList={songList} />
        </div>
    );
};


export default RightSidebarCarouselSliderList