'use client';
import { UserContext } from "@/context";
import { memo, useCallback, useContext, useState } from "react";
import { debounce } from "lodash";
import { Play, Pause, StepForward, ChevronDown } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Label } from "../ui/label";
import { decodeHtml, htmlParser } from "@/utils";
import { Button } from "../ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import RightSidebar from "../rightSidebar";
import { Slider } from "./BottomSlider";
import MainSongPhoto from "../rightSidebar/mainSongPhoto/MainSongPhoto";
import Player from "../rightSidebar/player";

const Bottombar = () => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const { currentSong, playing, currentTime, duration, togglePlayPause, handleNext, handleSeek } = useContext(UserContext);

    const debouncedHandleSeek = useCallback(debounce(handleSeek, 300), [handleSeek]);

    if (!currentSong) return null;

    const { name, image, artists, album } = currentSong;

    return (
        <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white shadow-lg p-4 pt-0 flex flex-col items-center justify-between flex-grow z-10">
            <div className="w-full pb-1">
                <Slider
                    onValueChange={debouncedHandleSeek}
                    value={[currentTime]}
                    max={duration}
                    className="bg-gray-200 dark:bg-gray-800 rounded-full"
                />
            </div>

            {/* <div className="flex w-full items-center justify-between">
                <div>
                    <div className="flex items-center space-x-4 cursor-pointer">
                        {image?.[0]?.url && !imageError ? (
                            <img
                                src={image[0].url}
                                loading="lazy"
                                className="rounded-lg"
                                alt={`${name} cover`}
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <Skeleton className="w-12 h-12 rounded-lg bg-gray-700" />
                        )}
                        <div className="flex flex-col overflow-hidden">
                            {name ? (
                                <Label className="font-semibold text-gray-100 truncate text-base cursor-pointer">
                                    {decodeHtml(name)}
                                </Label>
                            ) : (
                                <Skeleton className="w-32 h-4 mb-1 bg-gray-700" />
                            )}
                            {artists?.primary?.[0]?.name && (
                                <span className="flex whitespace-nowrap">
                                    <p className="text-sm text-gray-400 truncate">
                                        {htmlParser(artists.primary[0].name)}
                                    </p>
                                    <span> • </span>
                                    <p className="text-sm text-gray-400 truncate">
                                        {album?.name?.length > 15
                                            ? htmlParser(album.name.substring(0, 15).concat("..."))
                                            : htmlParser(album?.name)}
                                    </p>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <Button
                        variant="simple"
                        className="p-2 bg-pink-500 rounded-full"
                        onClick={togglePlayPause}
                        aria-label={playing ? "Pause" : "Play"}
                    >
                        {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </Button>
                    <Button
                        variant="simple"
                        className="p-2 bg-gray-700 rounded-full"
                        onClick={handleNext}
                        aria-label="Next Song"
                    >
                        <StepForward className="w-6 h-6" />
                    </Button>
                </div>
            </div> */}

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <div className="flex w-full items-center justify-between">
                    <SheetTrigger asChild>
                        <div className="flex items-center space-x-4 cursor-pointer">
                            {image?.[0]?.url && !imageError ? (
                                <img
                                    src={image[0].url}
                                    loading="lazy"
                                    className="rounded-lg"
                                    alt={`${name} cover`}
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <Skeleton className="w-12 h-12 rounded-lg bg-gray-700" />
                            )}
                            <div className="flex flex-col overflow-hidden">
                                {name ? (
                                    <Label className="font-semibold text-gray-100 truncate text-base cursor-pointer">
                                        {decodeHtml(name)}
                                    </Label>
                                ) : (
                                    <Skeleton className="w-32 h-4 mb-1 bg-gray-700" />
                                )}
                                {artists?.primary?.[0]?.name && (
                                    <span className="flex whitespace-nowrap">
                                        <p className="text-sm text-gray-400 truncate">
                                            {htmlParser(artists.primary[0].name)}
                                        </p>
                                        <span> • </span>
                                        <p className="text-sm text-gray-400 truncate">
                                            {album?.name?.length > 15
                                                ? htmlParser(album.name.substring(0, 15).concat("..."))
                                                : htmlParser(album?.name)}
                                        </p>
                                    </span>
                                )}
                            </div>
                        </div>
                    </SheetTrigger>

                    <div className="flex items-center space-x-4">
                        <Button
                            variant="simple"
                            className="p-2 bg-pink-500 rounded-full"
                            onClick={togglePlayPause}
                            aria-label={playing ? "Pause" : "Play"}
                        >
                            {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                        </Button>
                        <Button
                            variant="simple"
                            className="p-2 bg-gray-700 rounded-full"
                            onClick={handleNext}
                            aria-label="Next Song"
                        >
                            <StepForward className="w-6 h-6" />
                        </Button>
                    </div>
                </div>

                <SheetContent
                    side="bottom"
                    className="h-full w-full bg-gradient-to-b bg-fuchsia-300 dark:from-slate-950 dark:to-gray-900 rounded-t-lg p-0"
                >
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center ml-2 mt-2">
                            <SheetClose asChild>
                                <Button className="cursor-pointer bg-transparent" aria-label="Close">
                                    <ChevronDown className="text-2xl" />
                                </Button>
                            </SheetClose>
                        </div>
                        {/* <RightSidebar /> */}
                        <div className="w-full h-full bg-gradient-to-b bg-fuchsia-300 dark:from-slate-950 dark:to-gray-900 rounded-t-lg p-2 pt-0 flex flex-col">
                            <div className="song-carousel-container overflow-hidden flex-grow mb-2">
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
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <Player />
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default memo(Bottombar);
