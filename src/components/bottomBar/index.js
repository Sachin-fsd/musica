'use client'
import { memo, useContext, useMemo, useState } from "react";
import RightSidebar from "../rightSidebar";
import { debounce } from "lodash";
import { Slider } from "./BottomSlider";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { UserContext } from "@/context";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { ChevronDown, Pause, Play, StepForward } from "lucide-react";
import { decodeHtml } from "@/utils";

const Bottombar = () => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const { currentSong, playing, currentTime, duration, togglePlayPause, handleNext, handleSeek } = useContext(UserContext);
    const MemoizedSlider = memo(Slider);
    const MemoizedRightSidebar = memo(RightSidebar);
    const MemoizedSheetContent = memo(SheetContent);
    const MemoizedSheetTrigger = memo(SheetTrigger);
    const debouncedHandleSeek = useMemo(() => debounce(handleSeek, 300), [handleSeek]);

    if (!currentSong) return null;

    const songImage = useMemo(() => {
        if (currentSong?.image[0]?.url && !imageError) {
            return <img src={currentSong?.image[0]?.url} loading="lazy" className="rounded-lg" alt={`${currentSong?.name} cover`} onError={() => setImageError(true)} />;
        } else {
            return <Skeleton className="w-12 h-12 rounded-lg bg-gray-700" />;
        }
    }, [currentSong, imageError]);

    return (
        <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white shadow-lg p-4 pt-0 flex flex-col items-center justify-between flex-grow z-10">
            <div className="w-full pb-1">
                <MemoizedSlider
                    onValueChange={debouncedHandleSeek}
                    value={[currentTime]}
                    max={duration}
                    className="bg-gray-200 dark:bg-gray-800 rounded-full"
                />
            </div>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <div className="flex w-full items-center justify-between">
                    <MemoizedSheetTrigger asChild>
                        <div className="flex items-center space-x-4 cursor-pointer">
                            {songImage}
                            <div className="flex flex-col overflow-hidden">
                                {currentSong?.name ? (
                                    <Label className="font-semibold text-gray-100 truncate text-base cursor-pointer">{decodeHtml(currentSong?.name)}</Label>
                                ) : (
                                    <Skeleton className="w-32 h-4 mb-1 bg-gray-700" />
                                )}
                                {currentSong?.artists?.primary[0]?.name ? (
                                    <span className="flex whitespace-nowrap">
                                        <p className="text-sm text-gray-400 truncate">{decodeHtml(currentSong?.artists?.primary[0]?.name)} </p> <span className=""> • </span>
                                        <p className="text-sm text-gray-400 truncate"> {decodeHtml(currentSong?.album?.name)}</p>
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    </MemoizedSheetTrigger>

                    <div className="flex items-center space-x-4">
                        <Button variant="simple" className="p-2 bg-pink-500 rounded-full" onClick={togglePlayPause}>
                            {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                        </Button>
                        <Button variant="simple" className="p-2 bg-gray-700 rounded-full" onClick={handleNext}>
                            <StepForward className="w-6 h-6" />
                        </Button>
                    </div>
                </div>

                <MemoizedSheetContent side="bottom" className="h-full w-full bg-gradient-to-b bg-fuchsia-300 dark:from-slate-950 dark:to-gray-900 rounded-t-lg p-0">
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center ml-2 mt-2">
                            <SheetClose asChild>
                                <Button className="cursor-pointer bg-transparent">
                                    <ChevronDown className="text-2xl" />
                                </Button>
                            </SheetClose>
                        </div>
                        <MemoizedRightSidebar />
                    </div>
                </MemoizedSheetContent>
            </Sheet>
        </div>
    );
};

export default memo(Bottombar);