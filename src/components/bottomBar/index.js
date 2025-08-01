"use client";
import { UserContext } from "@/context";
import { Play, Pause, StepForward, ChevronDown } from "lucide-react";
import { useContext, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Label } from "../ui/label";
import { decodeHtml, htmlParser } from "@/utils";
import { Button } from "../ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import RightSidebar from "../rightSidebar";
import { Slider } from "./BottomSlider";
import { usePathname } from "next/navigation";
import BottomNavBar from "../bottomNavBar/BottomNavBar";

const Bottombar = () => {
    const pathname = usePathname();
    if (pathname == "/vibes") return null;
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [imageError, setImageError] = useState(false);

    const {
        togglePlayPause,
        currentSong,
        playing,
        handleSeek,
        currentTime,
        duration,
        handleNext
    } = useContext(UserContext);

    if (!currentSong) return null;

    return (
        <div className="w-full bg-gray-900 text-white shadow-lg p-4 pt-0 flex flex-col items-center justify-between flex-grow z-10">
            {/* Seek Bar */}
            <div className="w-full pb-1">
                <Slider
                    onValueChange={handleSeek}
                    value={[currentTime]}
                    max={duration}
                    className="bg-gray-200 dark:bg-gray-800 rounded-full"
                />
            </div>

            {/* Main Bottom Bar */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <div className="flex w-full items-center justify-between">
                    {/* Song Details */}
                    <SheetTrigger asChild>
                        <div className="flex items-center space-x-4 cursor-pointer">
                            {/* Song Image */}
                            {currentSong?.image[0]?.url && !imageError ? (
                                <img
                                    src={currentSong?.image[0]?.url}
                                    loading="lazy"
                                    className="rounded-lg w-12 h-12 object-cover"
                                    alt={`${currentSong?.name} cover`}
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <Skeleton className="w-12 h-12 rounded-lg bg-gray-700" />
                            )}

                            {/* Song Name & Artist */}
                            <div className="flex flex-col overflow-hidden">
                                {currentSong?.name ? (
                                    <Label className="font-semibold text-gray-100 truncate text-base cursor-pointer">
                                        {decodeHtml(currentSong?.name)}
                                    </Label>
                                ) : (
                                    <Skeleton className="w-32 h-4 mb-1 bg-gray-700" />
                                )}
                                {currentSong?.artists?.primary[0]?.name && (
                                    <p className="text-sm text-gray-400 truncate">
                                        {htmlParser(currentSong?.artists?.primary[0]?.name)}
                                    </p>
                                )}
                            </div>
                        </div>
                    </SheetTrigger>

                    {/* Controls */}
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="simple"
                            className="p-2 bg-pink-500 rounded-full text-white shadow-md hover:bg-pink-600 hover:text-accent-foreground"
                            onClick={togglePlayPause}
                            aria-label={playing ? "Pause" : "Play"}
                        >
                            {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                        </Button>

                        <Button
                            variant="simple"
                            className="p-2 bg-gray-700 rounded-full text-white shadow-md hover:bg-gray-800 hover:text-accent-foreground"
                            onClick={handleNext}
                            aria-label="Next song"
                        >
                            <StepForward className="w-6 h-6" />
                        </Button>
                    </div>
                </div>

                {/* Expanded Bottom Sheet */}
                <SheetContent
                    side="bottom"
                    className="h-full w-full bg-gradient-to-b bg-fuchsia-300 dark:from-slate-950 dark:to-gray-900 rounded-t-lg p-0"
                >
                    <div className="flex flex-col h-full">
                        {/* Close Button */}
                        <div className="flex justify-between items-center ml-2 mt-2">
                            <SheetClose asChild>
                                <Button
                                    className="cursor-pointer bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 sm:hover:shadow-md transition-all duration-200"
                                    aria-label="Close"
                                >
                                    <ChevronDown className="text-2xl font-bold text-gray-900 dark:text-gray-100" />
                                </Button>
                            </SheetClose>
                        </div>

                        {/* Right Sidebar */}
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