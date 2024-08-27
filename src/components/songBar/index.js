'use client';
import { toast } from "sonner"

import { EllipsisVertical, ListMusic, Plus, Trash2 } from "lucide-react";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";
import { useContext, useState, useCallback, useEffect } from "react";
import { UserContext } from "@/context";
import { playAndFetchSuggestions } from "@/utils/playAndFetchSuggestionUtils";
import { decodeHtml } from "@/utils";
import { Button } from "../ui/button";
import Marquee from "react-fast-marquee";
import { debounce } from "lodash";
import LongPressTooltip from "./longPressTooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import Image from "next/image";

const SongBar = ({ song}) => {
    const { currentSong, setCurrentIndex, currentIndex, setSongList, songList, setCurrentSong, setPlaying, audioRef, setCurrentId, loading, setLoading, } = useContext(UserContext);
    const [decodedName, setDecodedName] = useState(song?.name || "");

    useEffect(() => {
        if (song && song.name) {
            
            setDecodedName(decodeHtml(song.name).substring(0,20));
        }
    }, [song]);

    const handlePlusClick = () => {
        const songExists = songList.find(s => s.id === song.id);
        if (!songExists) {
            const newSongList = [...songList, song];
            setSongList(newSongList);
        }
    };

    const handleClick = useCallback(() => {
        setLoading(true);
        debounce(async () => {
            try {
                const context = { setCurrentIndex, currentIndex, setSongList, songList, setCurrentSong, setPlaying, audioRef, setCurrentId, currentSong };
                await playAndFetchSuggestions(song, context);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }, 300)();
    }, [song, setCurrentIndex, currentIndex, setSongList, songList, setCurrentSong, setPlaying, audioRef, setCurrentId]);



    const handleRemoveSong = () => {
        // Prevent removing the current song
        if (songList[currentIndex].id === song.id) {
            toast.error("Cannot remove the currently playing song")
            return;
        }

        if (songList.length > 3) {
            const updatedSongList = songList.filter((s, index) => {
                // If the first song is being removed and the last song is the current song,
                // adjust the currentIndex to prevent an index mismatch.
                if (index === 0 && currentIndex === songList.length - 1) {
                    setCurrentIndex((prevIndex) => prevIndex - 1);
                }
                return s.id !== song.id;
            });

            // If the first song is removed, set the currentIndex to 0 to make the new first song the current one.
            if (currentIndex === 0 && song.id === songList[0].id) {
                setCurrentIndex(0);
            }

            setSongList(updatedSongList);
        } else {
            toast.warning("Minimum 3 songs required");
        }
    };



    const handleAddNextSong = () => {
        // Remove the song from its current position
        const updatedList = songList.filter(s => s.id !== song.id);

        // Insert the song at the current index
        updatedList.splice(currentIndex + 1, 0, song);

        // Update the song list
        setSongList(updatedList);

    };


    if (!song) {
        return (
            <div className="flex justify-between items-center py-1 border-b border-gray-200 dark:border-gray-700">
                <Skeleton className="w-10 h-10 rounded object-cover mr-4" />
                <div className="flex-1">
                    <Label className="font-bold text-gray-900 dark:text-gray-100 truncate text-sm"></Label>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex justify-between items-center p-2 bg-white dark:bg-gray-900 rounded-lg shadow-md w-full ${song.id===currentSong?.id ? "outline outline-1 outline-purple-500" : ""}`}>
            {song.image[0]?.url ? (
                <Image
                    src={song.image[0].url}
                    height={40}
                    width={40}
                    loading="lazy"
                    className="rounded object-cover cursor-pointer mr-3"
                    alt={`${decodedName} cover`}
                    onClick={handleClick}
                />
            ) : (
                <Skeleton className="w-10 h-10 rounded object-cover" />
            )}
            <div className="flex-1 overflow-hidden cursor-pointer">
                {decodedName ? (
                    <Label
                        className="font-bold text-gray-900 dark:text-gray-100 truncate text-sm cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis"
                        onClick={handleClick}
                    >
                        {decodedName}
                    </Label>
                ) : (
                    <Skeleton className="min-h-2 p-2 m-2" />
                )}
                {song?.artists?.primary[0]?.name ? (
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate whitespace-nowrap overflow-hidden text-ellipsis">
                        {song.artists?.primary[0]?.name}
                    </p>
                ) : null}
            </div>
            <Label variant="simple" disabled={loading}>
                {songList.find(s => s.id === song.id) ? (
                    currentSong.id === song.id ? null : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="simple">
                                    <EllipsisVertical className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer size-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={handleRemoveSong} className="bg-red-300 dark:bg-red-600">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        <span>Remove from queue</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleAddNextSong}>
                                        <ListMusic className="mr-2 h-4 w-4" />
                                        <span>Play next</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )
                ) : (
                    <LongPressTooltip tooltipText="Add to queue">
                        <Plus onClick={handlePlusClick} className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer size-5 mr-3" />
                    </LongPressTooltip>
                )}
            </Label>
        </div>
    );
};

export default SongBar;