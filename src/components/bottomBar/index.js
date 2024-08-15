// components/BottomPlayer.js
'use client'
import { UserContext } from "@/context";
import { Play, Pause, StepForward, X, ChevronDown } from "lucide-react";
import { useContext } from "react";
import { Skeleton } from "../ui/skeleton";
import { Label } from "../ui/label";
import { decodeHtml } from "@/utils";
import { Button } from "../ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import RightSidebar from "../rightSidebar";

const Bottombar = () => {
    const { currentSong, playing, setCurrentIndex, songList, currentIndex, setCurrentSong, setPlaying, audioRef } = useContext(UserContext);

    const togglePlayPause = () => {
        if (playing) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setPlaying(!playing);
    };

    const handleNextSong = () => {
        const nextIndex = (currentIndex + 1) % songList.length;
        setCurrentIndex(nextIndex);
        setCurrentSong(songList[nextIndex]);
        setPlaying(true);
    };

    if (!currentSong) {
        return (
            <div className="flex justify-between items-center py-1 border-b border-gray-300 bg-gray-100">
                <Skeleton className="w-12 h-12 rounded-lg object-cover mr-4" />
                <div className="flex-1">
                    <Label className="font-bold text-gray-800 truncate text-sm"></Label>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white shadow-lg p-4 flex items-center justify-between">
            <Sheet >
                {/* Song Image and Info */}
                <SheetTrigger asChild>
                    <div className="flex items-center space-x-4 cursor-pointer">
                        {currentSong.image[0].url ? (
                            <img src={currentSong.image[0].url} className="w-12 h-12 rounded-lg object-cover" alt={`${currentSong.name} cover`} />
                        ) : (
                            <Skeleton className="w-12 h-12 rounded-lg bg-gray-700" />
                        )}
                        <div className="flex flex-col overflow-hidden">
                            {currentSong.name ? (
                                <Label className="font-semibold text-gray-100 truncate text-base">{decodeHtml(currentSong.name)}</Label>
                            ) : (
                                <Skeleton className="w-32 h-4 mb-1 bg-gray-700" />
                            )}
                            {currentSong?.artists?.primary[0]?.name ? (
                                <p className="text-sm text-gray-400 truncate">{currentSong.artists.primary[0].name}</p>
                            ) : null}
                        </div>
                    </div>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-full w-full bg-gray-900 rounded-t-lg" >
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4">
                            <SheetClose asChild>
                                <Button variant="ghost" aria-label="Close">
                                    <ChevronDown className="w-6 h-6 text-gray-400" />
                                </Button>
                            </SheetClose>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <RightSidebar />
                        </div>
                    </div>
                </SheetContent>

                {/* Play/Pause and Next Buttons */}
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" className="p-2 bg-pink-500 rounded-full text-white shadow-md hover:bg-pink-600" onClick={togglePlayPause}>
                        {playing ? (
                            <Pause className="w-6 h-6" />
                        ) : (
                            <Play className="w-6 h-6" />
                        )}
                    </Button>
                    <Button variant="ghost" className="p-2 bg-gray-700 rounded-full text-white shadow-md hover:bg-gray-800" onClick={handleNextSong}>
                        <StepForward className="w-6 h-6" />
                    </Button>
                </div>
            </Sheet>
        </div>
    );
};

export default Bottombar;