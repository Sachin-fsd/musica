'use client'

import { UserContext } from '@/context';
import { Download, Loader, Pause, Play, Repeat, Repeat1, SkipBack, SkipForward } from 'lucide-react';
import { useContext, useState } from 'react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { decodeHtml } from '@/utils';
import { Slider } from '../ui/slider';

const Player = () => {
    const [isDownloading, setIsDownloading] = useState(false);

    const {
        currentTime, duration, handleSeek,
        currentSong,
        playing,
        isLooping,
        setIsLooping,
        audioRef,
        handlePrev,
        handleNext,
        togglePlayPause
    } = useContext(UserContext);

    const downloadSong = async () => {
        setIsDownloading(true);
        try {
            const response = await fetch(currentSong?.downloadUrl[4].url);
            if (!response.ok) {
                throw new Error('Download failed');
            }
            const data = await response.blob();
            const url = URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${currentSong?.name}`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("Song Downloaded")
        } catch (error) {
            console.error("Download error:", error);
            toast.error("Downloaded Failed...")
        } finally {
            setIsDownloading(false);
        }
    };


    const loopSong = () => {
        audioRef.current.loop = !audioRef.current.loop;
        setIsLooping(!isLooping);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center p-3 pt-0">

            {/* Slider */}
            <div className="w-full pb-3">
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

            {/* Song Info Section */}
            <div className="text-center -mt-4">
                {currentSong && currentSong?.name && (
                    <div>
                        <p className="font-semibold text-xl text-gray-900 dark:text-white truncate max-w-xs mx-auto">
                            {decodeHtml(currentSong?.name)}
                        </p>
                        <p className="font-mono text-gray-600 dark:text-gray-400 text-sm truncate max-w-xs mx-auto">
                            {decodeHtml(
                                (currentSong?.artists?.primary?.slice(0, 2) || [])
                                    .map((a) => a.name)
                                    .join(', ')
                            )}
                        </p>
                        {/* <p className="font-mono text-gray-600 dark:text-gray-400 text-sm truncate max-w-xs mx-auto">
                            {decodeHtml(currentSong?.album?.name)}
                        </p> */}
                    </div>
                )}
            </div>

            {/* Player Controls Section */}
            <div className="p-2 flex justify-center items-center gap-6 mt-4">
                {/* Loop Button */}
                <Button variant="simple" className="p-0" onClick={loopSong} >
                    {isLooping ? (
                        <Repeat1 className="text-gray-600 dark:text-gray-300" />
                    ) : (
                        <Repeat className="text-gray-600 dark:text-gray-300" />
                    )}
                </Button>

                {/* Previous Button */}
                <Button variant="simple" className="p-0" onClick={handlePrev}>
                    <SkipBack className="text-gray-600 dark:text-gray-300" />
                </Button>

                {/* Play/Pause Button */}

                <Button
                    variant="simple"
                    onClick={togglePlayPause}
                    className="transition-all duration-200 transform hover:scale-105 active:scale-100"
                >
                    {playing ? (
                        <Pause
                            className="size-14 bg-pink-500 p-4 text-white rounded-full shadow-lg transform transition-transform duration-200 ease-in-out hover:scale-110 active:scale-100 flex items-center justify-center"
                        />
                    ) : (
                        <Play
                            className="size-14 bg-green-500 p-4 text-white rounded-full shadow-lg transform transition-transform duration-200 ease-in-out hover:scale-110 active:scale-100 flex items-center justify-center"
                        />
                    )}
                </Button>

                {/* Next Button */}
                <Button variant="simple" className="p-0" onClick={handleNext}>
                    <SkipForward className="text-gray-600 dark:text-gray-300" />
                </Button>

                {/* Download Button */}
                <Button
                    variant={isDownloading ? "secondary" : "simple"}
                    className="p-0"
                    onClick={downloadSong}
                >
                    {isDownloading ? (
                        <Loader className="animate-spin text-gray-600 dark:text-gray-300" />
                    ) : (
                        <Download className="text-gray-600 dark:text-gray-300" />
                    )}
                </Button>
            </div>
        </div>

    );
};

export default Player;
