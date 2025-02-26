'use client'

import { UserContext } from '@/context';
import { ChevronsLeft, ChevronsRight, Download, Loader, Pause, Play, Repeat, Repeat1, SkipBack, SkipBackIcon, SkipForward, StepBack, StepForward } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { decodeHtml } from '@/utils';

const Player = () => {
    const [isDownloading, setIsDownloading] = useState(false);

    const { currentSong,
        playing,
        setPlaying,
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

    return (
        <div className="flex flex-col items-center justify-center p-4">
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
                        <p className="font-mono text-gray-600 dark:text-gray-400 text-sm truncate max-w-xs mx-auto">
                            {decodeHtml(currentSong?.album?.name)}
                        </p>
                    </div>
                )}
            </div>

            {/* Player Controls Section */}
            <div className="p-2 flex justify-center items-center gap-6 mt-4">
                {/* Loop Button */}
                <Button variant="simple" className="p-0" onClick={loopSong}>
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
                <Button variant="none" onClick={togglePlayPause} >
                    {playing ? (
                        <Pause className="bg-pink-500 p-3 size-14 text-white rounded-full" />
                    ) : (
                        <Play className="bg-pink-500 p-3 size-14 text-white rounded-full" />
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
