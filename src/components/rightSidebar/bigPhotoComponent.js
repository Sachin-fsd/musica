'use client'
import { UserContext } from "@/context";
import { Slider } from "../ui/slider";
import SongCarousel from "./songCarousel";
import SongsListComponent from "./songsList";
import { useContext } from "react";
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
                    <MainSongPhoto src={currentSong.image[2].url} alt={currentSong.name}/>
                    {/* {
                        currentSong.image[2].url ?
                            <img
                                style={{ borderRadius: "30px" }}
                                src={currentSong.image[2].url}
                                className="-mt-6 p-6 -m-2 rounded"
                            /> :
                            <Skeleton className="rounded-lg w-[400px] h-[400px] object-cover shadow-lg" />
                    } */}
                </div>
                {songList && songList.length > 0 && (
                    <div className="text-center -mt-1">
                        <p className="font-semibold font-mono truncate max-w-xs mx-auto">
                            {decodeHtml(currentSong?.name)}
                        </p>
                        <p className="font-mono text-gray-400 text-xs truncate max-w-xs mx-auto">
                            {decodeHtml(
                                currentSong?.artists?.primary
                                    ?.slice(0, 2)
                                    .map((a) => a.name)
                                    .join(', ')
                            )}
                        </p>
                        <p className="font-mono text-gray-400 text-xs truncate max-w-xs mx-auto">
                            {decodeHtml(currentSong?.album?.name)}
                        </p>
                    </div>
                )}
                {/* <SongCarousel songs={songList} /> */}
            </div>

            {/* Slider - also takes up a small portion */}
            <div className="mb-4 pt-2">
                <Slider
                    onValueChange={handleSeek}
                    value={[currentTime]}
                    max={duration}
                    className="shadow-lg bg-gray-200 dark:bg-gray-800 rounded-lg"
                />
                <div className="flex items-center justify-between mt-1 text-gray-700 dark:text-gray-300">
                    <span className="text-xs">{formatTime(currentTime)}</span>
                    <span className="text-xs">{duration ? formatTime(duration) : "Loading"}</span>
                </div>
            </div>

            {/* Songs List - takes up the remaining space */}
            <div className="">
                <SongsListComponent songList={songList} />
            </div>
        </div>
    );
};

export default BigPhotoComponent;
