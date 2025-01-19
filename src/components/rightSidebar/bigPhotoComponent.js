'use client'
import { UserContext } from "@/context";
import { Slider } from "../ui/slider";
import SongCarousel from "./songCarousel";
import SongsListComponent from "./songsList";
import { useContext, useEffect } from "react";
import { decodeHtml } from "@/utils";
import MainSongPhoto from "./mainSongPhoto/MainSongPhoto";

const BigPhotoComponent = () => {
    const { currentTime, duration, handleSeek, songList, currentSong, currentIndex } = useContext(UserContext);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col h-full rounded-lg p-4 shadow-md overflow-auto">
            {/* Carousel - takes up a small portion */}
            <div className="rounded text-center">
                <div>
                    {currentSong && currentSong?.image?.[2]?.url && (
                        <MainSongPhoto src={currentSong.image[2].url} alt={currentSong.name} />
                    )}
                </div>
                {/* <SongCarousel songs={songList} /> */}
            </div>

            {/* Slider - also takes up a small portion */}
            <div className="mb-4 pt-2">
                <Slider
                    onValueChange={handleSeek}
                    value={[currentTime || 0]}
                    max={duration || 0}
                    className="shadow-lg bg-gray-200 dark:bg-gray-800 rounded-lg"
                />
                <div className="flex items-center justify-between mt-1 text-gray-700 dark:text-gray-300">
                    <span className="text-xs">{formatTime(currentTime)}</span>
                    <span className="text-xs">{duration ? formatTime(duration) : "Loading"}</span>
                </div>
            </div>

            {/* Songs List - takes up the remaining space */}
            <div className="overflow-auto p-1 pb-3 max-h-[calc(100vh-300px)]">
                {!songList?.length ? (
                    <p className="text-center text-gray-500">No songs available</p>
                ) : (
                    songList?.map((song, index) => (
                        <div key={index} className="w-full">
                            <SongBar song={song} />
                            {index < songList?.length - 1 && <Separator className="my-2" />}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BigPhotoComponent;
