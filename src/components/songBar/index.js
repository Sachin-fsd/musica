'use client';
import { toast } from "sonner";
import { EllipsisVertical, ListMusic, Play, Plus, Trash2 } from "lucide-react";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";
import { useContext, useState, useCallback, useEffect, useMemo } from "react";
import { UserContext } from "@/context";
import { playAndFetchSuggestions } from "@/utils/playAndFetchSuggestionUtils";
import { decodeHtml, htmlParser } from "@/utils";
import { Button } from "../ui/button";
import { debounce } from "lodash";
import LongPressTooltip from "./longPressTooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import TouchableOpacity from "../ui/touchableOpacity";

const SongBar = ({ song, searched }) => {
    const {
        currentSong,
        setCurrentIndex,
        currentIndex,
        setSongList,
        songList,
        setCurrentSong,
        setPlaying,
        audioRef,
        setCurrentId,
        loading,
        setLoading,
    } = useContext(UserContext);

    const [decodedName, setDecodedName] = useState(song?.name);
    const [imageError, setImageError] = useState(false);

    // Set song name and album name
    useEffect(() => {
        if (song?.name) {
            const formattedName = htmlParser(song.name);
            setDecodedName(formattedName.length > 15 ? formattedName.substring(0, 15) + '...' : formattedName);
        }
    }, [song]);

    // Handle plus click with debounce
    const debouncedHandlePlusClick = useMemo(() => debounce(() => {
        const songExists = songList?.find(s => s.id === song?.id);
        if (!songExists) {
            const newSongList = [...songList, song];
            setSongList(newSongList);
        }
    }, 300), [songList, song]);

    // Handle songbar click
    const handleClick = useCallback(() => {
        if (!song || loading) return; // Skip if no song or already loading
        audioRef.current.src = song.downloadUrl[4].url;
        audioRef.current.play();
        const context = { setCurrentIndex, currentIndex, setSongList, songList, setCurrentSong, setPlaying, audioRef, setCurrentId, currentSong };
        playAndFetchSuggestions(song, context).catch((error) => console.error("Error in handleClick:", error));
    }, [song, setCurrentIndex, currentIndex, setSongList, songList, setCurrentSong, setPlaying, audioRef, setCurrentId, currentSong, loading]);

    // Handle remove song
    const handleRemoveSong = () => {
        if (songList[currentIndex].id === song?.id) {
            toast.error("Cannot remove the currently playing song");
            return;
        }
        if (songList?.length > 3) {
            const updatedSongList = songList.filter(s => s.id !== song?.id);
            const currentSongIndex = updatedSongList.findIndex(s => s.id === currentSong?.id);
            setCurrentIndex(currentSongIndex);
            setSongList(updatedSongList);
        } else {
            toast.warning("Minimum 3 songs required");
        }
    };

    // Format timing to show only minutes and seconds
    const formatDuration = useCallback((durationInSeconds) => {
        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = durationInSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, []);

    // Adds the song to the next position
    const handleAddNextSong = () => {
        const updatedList = [...songList];
        const currentSongIndex = updatedList.findIndex(s => s.id === currentSong?.id);
        if (currentSongIndex === -1) return;
        const songIndex = updatedList.findIndex(s => s.id === song?.id);
        if (songIndex !== -1) updatedList.splice(songIndex, 1);
        updatedList.splice(currentSongIndex + 1, 0, song);
        setSongList(updatedList);
    };

    // Fallback image handling
    const handleImageError = () => setImageError(true);

    // Render skeleton if no song is present
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
        <div className="flex justify-between items-center p-2 bg-white dark:bg-slate-950 rounded-lg shadow-md w-full transition-transform duration-200 ease-in-out md:hover:scale-[1.01] md:hover:bg-gray-100 dark:md:hover:bg-gray-800 sm:hover:scale-[1] sm:hover:bg-transparent">
            <div className="relative flex items-center cursor-pointer mr-3" onClick={handleClick} style={{ flex: '1' }}>
                {song?.image[1]?.url && !imageError ? (
                    <img
                        src={song?.image[1]?.url}
                        height={45}
                        width={45}
                        loading="lazy"
                        className="rounded object-cover mr-3"
                        alt={`${decodedName} cover`}
                        onError={handleImageError}
                    />
                ) : (
                    <Skeleton className="w-10 h-10 rounded object-cover mr-3" />
                )}
                <div className="flex-1 overflow-hidden">
                    {decodedName && (
                        <Label className={`cursor-pointer font-medium text-gray-900 dark:text-gray-100 ${song?.id === currentSong?.id ? "font-bold dark:text-green-600 text-green-700" : ""} truncate text-sm whitespace-nowrap overflow-hidden text-ellipsis`}>
                            {decodedName}
                        </Label>
                    )}
                    {song?.artists?.primary[0]?.name && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate whitespace-nowrap overflow-hidden text-ellipsis">
                            {decodeHtml(song?.artists?.primary[0]?.name)} <span> • </span>
                        </p>
                    )}
                </div>
                {song?.id !== currentSong?.id && (
                    <div className="absolute top-0 left-0 flex items-center justify-center opacity-0 transition-opacity duration-300 md:hover:opacity-100">
                        <div className="bg-black bg-opacity-50 rounded-full p-2 outline-slate-700">
                            <Play className="p-0 text-white" />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center space-x-2">
                {song?.id !== currentSong?.id && (
                    <span className="text-xs text-gray-700 dark:text-gray-300 mr-1">{formatDuration(song?.duration)}</span>
                )}
                <Label variant="simple" disabled={loading}>
                    {songList?.find(s => s.id === song?.id) ? (
                        currentSong?.id === song?.id ? (
                            <div className="flex items-center gap-2 pr-2">
                                <div className="sound-waves">
                                    <div className="wave"></div>
                                    <div className="wave"></div>
                                    <div className="wave"></div>
                                </div>
                            </div>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="simple">
                                        <EllipsisVertical className="text-gray-500 dark:text-gray-300 cursor-pointer size-5" />
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="simple">
                                    <EllipsisVertical className="text-gray-500 dark:text-gray-300 cursor-pointer size-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={debouncedHandlePlusClick} className="text-gray-500 dark:text-gray-300 md:hover:text-gray-700 dark:md:hover:text-gray-200 cursor-pointer">
                                        <Plus className="mr-2 h-4 w-4" />
                                        <span>Add to queue</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleAddNextSong}>
                                        <ListMusic className="mr-2 h-4 w-4" />
                                        <span>Play next</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        // <LongPressTooltip tooltipText="Add to queue">
                        //     <Plus onClick={debouncedHandlePlusClick} className="text-gray-500 dark:text-gray-300 md:hover:text-gray-700 dark:md:hover:text-gray-200 cursor-pointer size-5" />
                        // </LongPressTooltip>
                    )}
                </Label>
            </div>
        </div>
    );
};

export default SongBar;
