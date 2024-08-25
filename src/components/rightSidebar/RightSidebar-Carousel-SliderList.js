'use client'
import { UserContext } from "@/context";
import { Slider } from "../ui/slider";
import SongCarousel from "./songCarousel";
import SongsListComponent from "./songsList";
import { useContext } from "react";

const RightSidebarCarouselSliderList = () => {
    const { currentTime, duration, handleSeek, songList } = useContext(UserContext);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col h-full bg-fuchsia-200 dark:bg-gray-900 rounded-lg p-4 shadow-md">
            {/* Carousel - takes up a small portion */}
            <div className="flex-none mb-2">
                <SongCarousel songs={songList} />
            </div>

            {/* Slider - also takes up a small portion */}
            <div className="flex-none mb-4 pt-3">
                <Slider
                    onValueChange={handleSeek}
                    value={[currentTime]}
                    max={duration}
                    className="shadow-lg bg-gray-200 dark:bg-gray-800 rounded-lg"
                />
                <div className="flex items-center justify-between mt-1 text-gray-700 dark:text-gray-300">
                    <span className="text-xs">{formatTime(currentTime)}</span>
                    <span className="text-xs">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Songs List - takes up the remaining space */}
            <div className="flex-1 overflow-y-auto hide-scrollbar">
                <SongsListComponent songList={songList} />
            </div>
        </div>
    );
};

export default RightSidebarCarouselSliderList;
