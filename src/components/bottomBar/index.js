'use client'
import { UserContext } from "@/context";
import { Play, Pause, StepForward, ChevronDown } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Label } from "../ui/label";
import { decodeHtml } from "@/utils";
import { Button } from "../ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import RightSidebar from "../rightSidebar";
import { Progress } from "./BottomProgressBar";
import { Slider } from "./BottomSlider";

const Bottombar = () => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [imageError, setImageError] = useState(false)

    const { togglePlayPause, currentSong, playing, setCurrentIndex, songList, currentIndex, setCurrentSong, setPlaying, audioRef, handleSeek, currentTime, duration } = useContext(UserContext);

    useEffect(() => {
        if (window.innerWidth < 768) setIsSheetOpen(true);
    }, []);

    const handleNextSong = () => {
        const nextIndex = (currentIndex + 1) % songList?.length;
        setCurrentIndex(nextIndex);
        setCurrentSong(songList[nextIndex]);
        if (playing) setPlaying(true);
    };

    if (!currentSong) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white shadow-lg p-4 pt-0 flex flex-col items-center justify-between flex-grow">
            <div className="w-full pb-1">
                {/* <Progress
                    value={currentTime}
                    max={duration}
                    className="bg-gray-600 rounded-full"
                    trackclassname="bg-gray-700"
                    indicatorclassname="bg-pink-500"
                /> */}
                <Slider
                    onValueChange={handleSeek}
                    value={[currentTime]}
                    max={duration}
                    className="bg-gray-200 dark:bg-gray-800 rounded-full"
                />
            </div>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                {/* Song Image and Info */}
                <div className="flex w-full items-center justify-between">
                    <SheetTrigger asChild>
                        <div className="flex items-center space-x-4 cursor-pointer">
                            {currentSong?.image[0]?.url && !imageError ? (
                                <img
                                    src={currentSong?.image[0]?.url}
                                    height="48"
                                    width="48"
                                    loading="lazy"
                                    className="rounded-lg object-cover"
                                    alt={`${currentSong?.name} cover`}
                                    onError={() => setImageError(true)} />
                            ) : (
                                <Skeleton className="w-12 h-12 rounded-lg bg-gray-700" />
                            )}
                            <div className="flex flex-col overflow-hidden">
                                {currentSong?.name ? (
                                    <Label className="font-semibold text-gray-100 truncate text-base cursor-pointer">{decodeHtml(currentSong?.name)}</Label>
                                ) : (
                                    <Skeleton className="w-32 h-4 mb-1 bg-gray-700" />
                                )}
                                {currentSong?.artists?.primary[0]?.name ? (
                                    <span className="flex whitespace-nowrap">
                                        <p className="text-sm text-gray-400 truncate">{currentSong?.artists?.primary[0]?.name} </p> <span className=""> • </span>
                                        <p className="text-sm text-gray-400 truncate"> {currentSong?.album?.name?.length>15 ? currentSong?.album?.name?.substring(0,15).concat("..."): currentSong?.album?.name}</p>
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    </SheetTrigger>

                    <div className="flex items-center space-x-4">
                        <Button variant="simple" className="p-2 bg-pink-500 rounded-full text-white shadow-md hover:bg-pink-600 hover:text-accent-foreground" onClick={togglePlayPause}>
                            {playing ? (
                                <Pause className="w-6 h-6" />
                            ) : (
                                <Play className="w-6 h-6" />
                            )}
                        </Button>
                        <Button variant="simple" className="p-2 bg-gray-700 rounded-full text-white shadow-md hover:bg-gray-800 hover:text-accent-foreground" onClick={handleNextSong}>
                            <StepForward className="w-6 h-6" />
                        </Button>
                    </div>
                </div>
                <SheetContent side="bottom" className="h-full w-full bg-gradient-to-b bg-fuchsia-300 dark:from-slate-950 dark:to-gray-900 rounded-t-lg p-0">
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center ml-2 mt-2">
                            <SheetClose asChild>
                                <Button className="cursor-pointer bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200">
                                    <ChevronDown className="text-2xl font-bold text-gray-900 dark:text-gray-100" />
                                </Button>
                            </SheetClose>

                        </div>
                        <div className="flex-1 overflow-hidden">
                            <RightSidebar />
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default Bottombar;
