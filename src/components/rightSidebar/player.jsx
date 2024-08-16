'use client'

import { UserContext } from '@/context';
import { Download, Loader, Pause, Play, Repeat, SkipBack, SkipBackIcon, SkipForward, StepBack, StepForward } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { togglePlayPause } from '@/utils/audiofunctions';

const Player = () => {
    const { toast } = useToast()
    const [isDownloading, setIsDownloading] = useState(false);

    const { currentSong,
        setCurrentSong,
        playing,
        setPlaying,
        currentTime,
        setCurrentTime,
        duration,
        setDuration,
        isLooping,
        setIsLooping,
        audioRef,
        handleSeek,
        songList,
        currentIndex,
        setCurrentIndex } = useContext(UserContext);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const downloadSong = async () => {
        console.log("downloaduRL", currentSong.downloadUrl[4])
        setIsDownloading(true);
        try {
            const response = await fetch(currentSong.downloadUrl[4].url);
            if (!response.ok) {
                throw new Error('Download failed');
            }
            const data = await response.blob();
            const url = URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${currentSong.name}.mp3`;
            a.click();
            URL.revokeObjectURL(url);
            toast({
                title: "Song Downloaded",
            })
        } catch (error) {
            console.error("Download error:", error);
            toast({
                title: "Downloaded Failed...",
            })
        } finally {
            setIsDownloading(false);
        }
    };


    const loopSong = () => {
        audioRef.current.loop = !audioRef.current.loop;
        setIsLooping(!isLooping);
    };

    const changeRight = () => {
        audioRef.current.currentTime = audioRef.current.currentTime + 10;
    };

    const changeLeft = () => {
        audioRef.current.currentTime = audioRef.current.currentTime - 10;
    };

    // useEffect(() => {
    //     console.log("currentSong",currentSong, audioRef.current,playing)
    //     const handleTimeUpdate = () => {
    //         setCurrentTime(audioRef.current.currentTime);
    //         setDuration(audioRef.current.duration);
    //     };
    //     // audioRef.current.addEventListener('timeupdate', handleTimeUpdate);


    //     // if (audioRef.current) {
    //     //     audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    //     // }

    //     return () => {
    //         if (audioRef.current) {
    //             audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
    //         }
    //     };
    // }, []);
    // useEffect(() => {
    //     const handleTimeUpdate = () => {
    //         setCurrentTime(audioRef.current.currentTime);
    //         setDuration(audioRef.current.duration);
    //     };
    //     audioRef?.current?.addEventListener('timeupdate', handleTimeUpdate);


    //     // if (audioRef.current) {
    //     //     audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    //     // }

    //     return () => {
    //         if (audioRef.current) {
    //             audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
    //         }
    //     };
    // }, [audioRef.current]);


    // useEffect(() => {
    //     if (currentSong) {
    //         try {
    //             audioRef.current.src = currentSong.downloadUrl[4].url;
    //             if (playing) {
    //                 audioRef.current.play();
    //             } else {
    //                 audioRef.current.pause();
    //             }
    //         } catch (error) {
    //             console.error("Error playing the song:", error);
    //             setPlaying(false);
    //         }
    //     }
    // }, [currentSong]);


    // useEffect(() => {
    //     const handleSongEnd = () => {
    //         if (!isLooping) {
    //             // Move to the next song in the list
    //             const nextIndex = (currentIndex + 1) % songList.length;
    //             setCurrentIndex(nextIndex);
    //             setCurrentSong(songList[nextIndex]);
    //             setPlaying(true);
    //         }
    //     };

    //     audioRef?.current?.addEventListener('ended', handleSongEnd);

    //     return () => {
    //         if (audioRef.current) {
    //             audioRef.current.removeEventListener('ended', handleSongEnd);
    //         }
    //     };
    // }, [isLooping, currentIndex, songList, setCurrentIndex, setCurrentSong]);

    useEffect(()=>{
        console.log("here",playing,audioRef,audioRef.current,currentSong,currentTime)
    },[playing,audioRef,audioRef.current,currentSong,duration])

    return (
        <div>
            <div className="p-1 flex justify-between items-center">
                <Button variant="ghost" className="p-0" onClick={loopSong}>
                    <Repeat className={`${isLooping ? "" : "opacity-50"} `} />
                </Button>
                <Button variant="ghost" className="p-0 m-0" onClick={changeLeft}>
                    <SkipBack />
                </Button>
                <Button variant="ghost" className="p-0" onClick={()=>togglePlayPause({playing,audioRef,setPlaying})}>
                    {playing ? (
                        <Pause className="bg-pink-500 p-2 rounded-lg text-white size-9" />
                    ) : (
                        <Play className="bg-pink-500 p-2 rounded-lg text-white size-9" />
                    )}
                </Button>
                <Button variant="ghost" className="p-0" onClick={changeRight}>
                    <SkipForward />
                </Button>
                <Button variant="ghost" className="p-0" onClick={downloadSong}>
                    {isDownloading ? (
                        <Loader className='animate-spin' />
                    ) : (
                        <Download className="opacity-50" />
                    )}
                </Button>
            </div>
        </div>
    );
};

export default Player;
