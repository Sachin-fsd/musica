'use client'
import { UserContext } from "@/context";
import { Slider } from "../ui/slider";
import SongCarousel from "./songCarousel";
import SongsListComponent from "./songsList";
import { useContext, useEffect } from "react";

const RightSidebarCarouselSliderList = () => {
    const { currentTime, duration, handleSeek, songList } = useContext(UserContext);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col h-full">
            {/* Carousel - takes up a small portion */}
            <div className="flex-none mb-2">
                <SongCarousel songs={songList} />
            </div>

            {/* Slider - also takes up a small portion */}
            <div className="flex-none mb-4">
                <Slider
                    onValueChange={handleSeek}
                    value={[currentTime]}
                    max={duration}
                    className="px-3 pt-3 shadow-lg"
                />
                <div className="flex items-center justify-between mt-1">
                    <span className="text-xs">{formatTime(currentTime)}</span>
                    <span className="text-xs">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Songs List - takes up the remaining space */}
            <div className="flex-1 overflow-y-auto">
                <SongsListComponent songsList={songList} />
            </div>
        </div>
    );
};

export default RightSidebarCarouselSliderList;
 