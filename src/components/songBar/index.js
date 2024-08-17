'use client'

import { Plus } from "lucide-react";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";
import { useContext, useState, useCallback, useEffect } from "react";
import { UserContext } from "@/context";
import { playAndFetchSuggestions } from "@/utils/playAndFetchSuggestionUtils";
import { decodeHtml } from "@/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import Marquee from "react-fast-marquee";
import { debounce } from "lodash";
import LongPressTooltip from "./longPressTooltip";

const SongBar = ({ song, index }) => {
    const { setCurrentIndex, currentIndex, setSongList, songList, setCurrentSong, setPlaying, audioRef, setCurrentId, loading, setLoading } = useContext(UserContext);
    const [decodedName, setDecodedName] = useState(song?.name || "");

    useEffect(() => {
        if (song && song.name) {
            setDecodedName(decodeHtml(song.name));
        }
    }, [song]);

    const handlePlusClick = () => {
        const songExists = songList.find(s => s.id === song.id);
        if (!songExists) {
            const newSongList = [...songList, song];
            setSongList(newSongList);
        }
    }

    const formatSingers = () => {
        if (!song.artists || !song.artists.primary) return '';

        // Join artist names with a comma
        const singers = song.artists.primary.map(artist => artist.name).join(', ');
        return singers;
    }

    const handleClick = useCallback(() => {
        setLoading(true);

        debounce(async () => {
            try {
                const context = { setCurrentIndex, currentIndex, setSongList, songList, setCurrentSong, setPlaying, audioRef, setCurrentId };
                await playAndFetchSuggestions(song, context);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }, 300)();
    }, [song, setCurrentIndex, currentIndex, setSongList, songList, setCurrentSong, setPlaying, audioRef, setCurrentId]);

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

    if (!song || !song.downloadUrl || !song.downloadUrl[4]?.url) return null;

    return (
        <div className="flex justify-between items-center py-1 border-gray-200 rounded-lg w-full">
            {song.image[0]?.url ? (
                <img src={song.image[0].url} className="w-10 h-10 rounded object-cover cursor-pointer mr-3" alt={`${decodedName} cover`} onClick={handleClick} />
            ) : (
                <Skeleton className="w-10 h-10 rounded object-cover" />
            )}
            <div className="flex-1 overflow-hidden cursor-pointer">
                {decodedName ? (
                    <Label className="font-bold text-cyan-950 truncate text-sm cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis" onClick={handleClick}>
                        {decodedName}
                    </Label>
                ) : (
                    <Skeleton className="min-h-2 p-2 m-2" />
                )}
                {song?.artists?.primary[0]?.name ? (
                    <p className="text-xs text-gray-600 truncate whitespace-nowrap overflow-hidden text-ellipsis">{song.artists?.primary[0]?.name}</p>
                ) : null}
            </div>
            <LongPressTooltip onLongPress={handlePlusClick} tooltipText="Add to queue">
                <Button variant="ghost" disabled={loading}>
                    <Plus className="text-gray-500 hover:text-gray-700 cursor-pointer size-5" />
                </Button>
            </LongPressTooltip>
        </div>
    );
};

export default SongBar;
