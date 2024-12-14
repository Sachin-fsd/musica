'use client'

import { UserContext } from '@/context';
import { ChevronsLeft, ChevronsRight, Download, Loader, Pause, Play, Repeat, Repeat1, SkipBack, SkipBackIcon, SkipForward, StepBack, StepForward } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

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
        <div>
            <div className="p-1 flex justify-between items-center">
                <Button variant="simple" className="p-0" onClick={loopSong}>
                    {
                        isLooping ? <Repeat1 /> : <Repeat />
                    }

                </Button>
                <Button variant="simple" className="p-0 m-0" onClick={handlePrev}>
                    <SkipBack />
                </Button>
                <Button variant="ghost" className="p-0 " onClick={togglePlayPause}>
                    {playing ? (
                        <Pause className="bg-pink-500 p-2 text-white size-14 rounded-full" />
                    ) : (
                        <Play className="bg-pink-500 p-2 rounded-full text-white size-14" />
                    )}
                </Button>
                <Button variant="simple" className="p-0" onClick={handleNext}>
                    <SkipForward/>
                </Button>
                <Button variant={isDownloading ? "secondary" : "simple"} className="p-0" onClick={downloadSong}>
                    {isDownloading ? (
                        <Loader className='animate-spin' />
                    ) : (
                        <Download />
                    )}
                </Button>
            </div>
        </div>
    );
};

export default Player;
