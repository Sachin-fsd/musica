'use client';

import { memo } from 'react';
import { toast } from "sonner";
import { EllipsisVertical, ListMusic, Play, Plus, Trash2 } from "lucide-react";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";
import { useContext, useState, useCallback, useMemo } from "react";
import { UserContext } from "@/context";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import TouchableOpacity from "../ui/touchableOpacity";
import { decode } from "he";

const SongBar = memo(({ song }) => {
    const {
        playing,
        currentSong,
        setCurrentSong,
        setPlaying,
        songList,
        setSongList,
        loading,
        playSongAndCreateQueue,
    } = useContext(UserContext);

    const [imageError, setImageError] = useState(false);

    // Memoize derived state
    const isSongInQueue = useMemo(() => songList?.some(s => s.id === song?.id), [songList, song?.id]);
    const isCurrentlyPlaying = useMemo(() => currentSong?.id === song?.id, [currentSong?.id, song?.id]);

    const decodedName = useMemo(() => {
        return song?.name ? decode(song.name) : 'Unknown Song';
    }, [song?.name]);

    const decodedArtist = useMemo(() => {
        return song?.artists?.primary?.[0]?.name ? decode(song.artists.primary[0].name) : 'Unknown Artist';
    }, [song?.artists]);

    // --- Event Handlers ---
    const handleClick = useCallback(() => {
        if (isCurrentlyPlaying) {
            setPlaying(!playing);
        } else {
            playSongAndCreateQueue(song);
        }
    }, [isCurrentlyPlaying, playing, song, setPlaying, playSongAndCreateQueue]);

    const handleAddNext = useCallback(() => {
        const filteredList = songList.filter(s => s.id !== song.id);
        const currentIdx = filteredList.findIndex(s => s.id === currentSong.id);
        filteredList.splice(currentIdx + 1, 0, song);
        setSongList(filteredList);
        toast.success("Added to play next!");
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
    }, [song, isCurrentlyPlaying, songList, setSongList]);

    // --- Skeleton Loader ---
    if (!song?.id) {
        return (
            <div className="flex items-center gap-4 p-2 w-full">
                <Skeleton className="h-12 w-12 rounded-md flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>
        );
    }

    return (
        <div 
            className={`group relative flex items-center justify-between p-2 sm:p-2.5 rounded-xl transition-all duration-200 ease-out w-full
                ${isCurrentlyPlaying 
                    ? "bg-primary/5 hover:bg-primary/10" 
                    : "hover:bg-muted/50"
                }
            `}
        >
            <TouchableOpacity 
                className="flex items-center flex-1 min-w-0 mr-4 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg" 
                onClick={handleClick}
            >
                {/* Image & Hover Overlay */}
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 overflow-hidden rounded-md shadow-sm">
                    <img
                        src={imageError ? '/fallback-image.png' : (song.image?.[1]?.url || song.image?.[0]?.url)}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        alt={decodedName}
                        onError={() => setImageError(true)}
                    />
                    
                    {/* Hover Play Button */}
                    {!isCurrentlyPlaying && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                            <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                        </div>
                    )}
                    
                    {/* Active Equalizer Overlay */}
                    {isCurrentlyPlaying && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="sound-waves">
                                <div className="wave" /><div className="wave" /><div className="wave" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Text Info */}
                <div className="flex flex-col flex-1 min-w-0 ml-3 sm:ml-4 justify-center">
                    <Label 
                        className={`text-sm sm:text-base font-semibold truncate cursor-pointer transition-colors duration-200
                            ${isCurrentlyPlaying ? "text-primary" : "text-foreground group-hover:text-primary"}
                        `}
                    >
                        {decodedName}
                    </Label>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate mt-0.5">
                        {decodedArtist}
                    </p>
                </div>
            </TouchableOpacity>

            {/* Right Actions & Meta */}
            <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
                {!isCurrentlyPlaying && (
                    <span className="text-xs text-muted-foreground font-medium hidden sm:block min-w-[36px] text-right">
                        {`${Math.floor((song.duration || 0) / 60)}:${String((song.duration || 0) % 60).padStart(2, '0')}`}
                    </span>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon"
                            disabled={loading}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-full"
                        >
                            <EllipsisVertical className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 sm:w-56 rounded-xl">
                        <DropdownMenuGroup>
                            {isSongInQueue ? (
                                <DropdownMenuItem 
                                    onClick={handleRemove} 
                                    className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" /> 
                                    <span>Remove from queue</span>
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem onClick={handleAddToQueue} className="cursor-pointer">
                                    <Plus className="mr-2 h-4 w-4" /> 
                                    <span>Add to queue</span>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={handleAddNext} className="cursor-pointer">
                                <ListMusic className="mr-2 h-4 w-4" /> 
                                <span>Play next</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
});

SongBar.displayName = 'SongBar';

export default SongBar;