"use client";

import { Plus } from "lucide-react";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";
import { useContext } from "react";
import { UserContext } from "@/context";
import { playAndFetchSuggestions } from "@/utils/playAndFetchSuggestionUtils";
import { decodeHtml } from "@/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import Marquee from "react-fast-marquee";

const SongBar = ({ song, index }) => {
    const { setCurrentIndex, currentIndex, setSongList, songList, setCurrentSong, setPlaying, audioRef, setCurrentId } = useContext(UserContext);

    const handlePlusClick = () => {
        const songExists = songList.find(s => s.id === song.id);
        if (!songExists) {
            const newSongList = [...songList, song];
            setSongList(newSongList);
        }
    }

    const handleClick = async () => {
        try {
            const context = { setCurrentIndex, currentIndex, setSongList, songList, setCurrentSong, setPlaying, audioRef, setCurrentId };
            await playAndFetchSuggestions(song, context);
        } catch (error) {
            console.log(error);
        }
    }

    if (!song) {
        return (
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
                <Skeleton className="w-10 h-10 rounded object-cover mr-4" />
                <div className="flex-1">
                    <Label className="font-bold text-cyan-950 truncate text-sm"></Label>
                </div>
            </div>
        );
    }

    if (!song || !song.downloadUrl || !song.downloadUrl[4].url) return null;

    return (
        <div
            className="flex justify-between items-center py-1 border-gray-200 rounded-lg w-full"
        >
            {song.image[0].url ? (
                <img src={song.image[0].url} className="w-10 h-10 rounded object-cover cursor-pointer mr-3" alt={`${song.name} cover`} onClick={handleClick} />
            ) : (
                <Skeleton className="w-10 h-10 rounded object-cover" />
            )}
            <div className="flex-1 overflow-hidden cursor-pointer"> {/* Adjusted max-width to prevent overflow */}
                {song.name ? (
                    <Label className="font-bold text-cyan-950 truncate text-sm cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis" onClick={handleClick}>
                        {/* <Marquee gradient={false}> */}
                            {decodeHtml(song.name)}
                        {/* </Marquee> */}
                    </Label>
                ) : (
                    <Skeleton className="min-h-2 p-2 m-2" />
                )}
                {song?.artists?.primary[0]?.name ? (
                    <p className="text-xs text-gray-600 truncate whitespace-nowrap overflow-hidden text-ellipsis">{song.artists.primary[0].name}</p>
                ) : null}
            </div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" onClick={handlePlusClick}>
                            <Plus className="text-gray-500 hover:text-gray-700 cursor-pointer size-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Add to queue</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export default SongBar;
