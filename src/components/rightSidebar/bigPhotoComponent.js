'use client'
import { UserContext } from "@/context";
import { Slider } from "../ui/slider";
import { useContext } from "react";
import MainSongPhoto from "./mainSongPhoto/MainSongPhoto";
import SongBar from "../songBar";
import { Separator } from "../ui/separator";

const BigPhotoComponent = () => {
    const {
        currentTime = 0,
        duration = 0,
        handleSeek,
        songList = [],
        currentSong,
    } = useContext(UserContext);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col h-full rounded-lg p-4 shadow-md bg-white dark:bg-gray-900 overflow-auto">
            {/* Current Song Image */}
            <div className="rounded text-center mb-4">
                {currentSong?.image?.[2]?.url ? (
                    <MainSongPhoto
                        src={currentSong.image[2].url}
                        alt={currentSong.name || "Song Cover"}
                    />
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">No song image available</p>
                )}
            </div>

            {/* Slider */}
            <div className="mb-4 pt-2">
                <Slider
                    onValueChange={handleSeek}
                    value={[currentTime]}
                    max={duration}
                    className="shadow-lg bg-gray-200 dark:bg-gray-800 rounded-lg"
                />
                <div className="flex items-center justify-between mt-1 text-gray-700 dark:text-gray-300 text-xs">
                    <span>{formatTime(currentTime)}</span>
                    <span>{duration > 0 ? formatTime(duration) : "Loading"}</span>
                </div>
            </div>

            {/* Song List */}
            <div className="flex-grow overflow-y-auto">
                {songList.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">No songs available</p>
                ) : (
                    songList.map((song, index) => (
                        <div key={song.id || index} className="w-full">
                            <SongBar song={song} />
                            {index < songList.length - 1 && <Separator className="my-2" />}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BigPhotoComponent;
