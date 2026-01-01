'use client';

import { toast } from "sonner";
import { EllipsisVertical, ListMusic, Play, Plus, Trash2 } from "lucide-react";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";
import { useContext, useState, useCallback, useEffect, useMemo } from "react";
import { UserContext } from "@/context";
import { decodeHtml, htmlParser } from "@/utils";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import TouchableOpacity from "../ui/touchableOpacity";
// Assume you have this new utility function imported
// import { createPlaylistFromSuggestions } from "@/utils/playlistUtils";


import { memo } from 'react';
import { toast } from "sonner";
import { EllipsisVertical, ListMusic, Play, Plus, Trash2 } from "lucide-react";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";
import { useContext, useState, useCallback, useEffect, useMemo } from "react";
import { UserContext } from "@/context";
import { decodeHtml, htmlParser } from "@/utils";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import TouchableOpacity from "../ui/touchableOpacity";

const SongBar = memo(({ song }) => {

    const {
        playing ,
        currentSong,
        setCurrentSong,
        setPlaying,
        songList,
        setSongList,
        loading,
        playSongAndCreateQueue, // Assume this new function is from your context
    } = useContext(UserContext);

    const [imageError, setImageError] = useState(false);

    // Memoize derived state for cleaner rendering logic
    const isSongInQueue = useMemo(() => songList?.some(s => s.id === song?.id), [songList, song?.id]);
    const isCurrentlyPlaying = useMemo(() => currentSong?.id === song?.id, [currentSong?.id, song?.id]);

    const decodedName = useMemo(() => {
        if (!song?.name) return '';
        const formattedName = htmlParser(song.name);
        return formattedName.length > 25 ? formattedName.substring(0, 25) + '...' : formattedName;
    }, [song?.name]);

    // --- Event Handlers ---

    const handleClick = useCallback(() => {
        // Prevent actions while another song is loading
        if (loading) return;

        if (isCurrentlyPlaying) {
            // If the clicked song is the one already playing, just toggle its play/pause state
            setPlaying(!playing);
        } else {
            // If it's a new song, delegate the entire complex process to the context
            playSongAndCreateQueue(song);
        }
    }, [loading, isCurrentlyPlaying, playing, song, setPlaying, playSongAndCreateQueue]);

    const handleAddNext = useCallback(() => {
        // Remove the song if it already exists in the list
        const filteredList = songList.filter(s => s.id !== song.id);
        // Find the index of the currently playing song
        const currentIdx = filteredList.findIndex(s => s.id === currentSong.id);
        // Insert the new song right after the current one
        filteredList.splice(currentIdx + 1, 0, song);
        setSongList(filteredList);
        toast.success("Added to queue!");
    }, [song, songList, currentSong, setSongList]);

    const handleAddToQueue = useCallback(() => {
        if (!isSongInQueue) {
            setSongList([...songList, song]);
            toast.success("Added to queue!");
        }
    }, [song, songList, isSongInQueue, setSongList]);

    const handleRemove = useCallback(() => {
        if (isCurrentlyPlaying) {
            toast.error("Cannot remove the currently playing song.");
            return;
        }
        const updatedList = songList.filter(s => s.id !== song.id);
        setSongList(updatedList);
        // The context should automatically update the currentIndex if needed
    }, [song, isCurrentlyPlaying, songList, setSongList]);


    if (!song?.id) {
        // Return a cleaner skeleton
        return <Skeleton className="h-16 w-full rounded-lg" />;
    }

    return (
        <div className="flex justify-between items-center p-2 bg-white dark:bg-slate-950 rounded-lg w-full transition-transform duration-200 ease-in-out md:hover:scale-[1.01] md:hover:bg-gray-100 dark:md:hover:bg-gray-800">
            <TouchableOpacity className="relative flex items-center cursor-pointer mr-3 flex-1 overflow-hidden" onClick={handleClick}>
                <img
                    src={imageError ? '/fallback-image.png' : song.image[1]?.url}
                    height={45}
                    width={45}
                    loading="lazy"
                    className="rounded object-cover mr-3 flex-shrink-0"
                    alt={decodedName}
                    onError={() => setImageError(true)}
                />
                <div className="flex-1 overflow-hidden">
                    <Label className={`font-medium truncate text-sm whitespace-nowrap ${isCurrentlyPlaying ? "font-bold text-green-600" : "text-gray-900 dark:text-gray-100"}`}>
                        {decodedName}
                    </Label>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate whitespace-nowrap">
                        {decodeHtml(song.artists?.primary[0]?.name)}
                    </p>
                </div>
            </TouchableOpacity>

            <div className="flex items-center space-x-2">
                {isCurrentlyPlaying ? (
                    <div className="sound-waves">
                        <div className="wave" /><div className="wave" /><div className="wave" />
                    </div>
                ) : (
                    <span className="text-xs text-gray-700 dark:text-gray-300">
                        {`${Math.floor(song.duration / 60)}:${String(song.duration % 60).padStart(2, '0')}`}
                    </span>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="simple" disabled={loading}>
                            <EllipsisVertical className="text-gray-500 dark:text-gray-300 size-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuGroup>
                            {isSongInQueue ? (
                                <>
                                    <DropdownMenuItem onClick={handleRemove} className="text-red-600 focus:bg-red-100 dark:focus:bg-red-900">
                                        <Trash2 className="mr-2 h-4 w-4" /> Remove from queue
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleAddNext}>
                                        <ListMusic className="mr-2 h-4 w-4" /> Play next
                                    </DropdownMenuItem>
                                </>
                            ) : (
                                <>
                                    <DropdownMenuItem onClick={handleAddToQueue}>
                                        <Plus className="mr-2 h-4 w-4" /> Add to queue
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleAddNext}>
                                        <ListMusic className="mr-2 h-4 w-4" /> Play next
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
});

SongBar.displayName = 'SongBar';

export default SongBar;