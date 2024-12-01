'use client';

import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { UserContext } from "@/context";
import { useCallback, useContext, useState } from "react";
import { debounce } from "lodash";
import { fetchAlbumSongs } from "@/utils/playAndFetchSuggestionUtils";
import { Play } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Assuming you have a Tooltip component

const AlbumBar = ({ album }) => {
    const { currentSong, currentIndex, songList, setSongList, setCurrentIndex, setCurrentSong, setPlaying, setCurrentId } = useContext(UserContext);

    const [imageError, setImageError] = useState(false);

    const truncateTitle = (title, maxLength = 24) => {
        return title?.length > maxLength ? `${title?.substring(0, maxLength)}...` : title;
    };

    const handleAlbumClick = useCallback(
        debounce(() => {
            const context = { currentSong, currentIndex, songList, setSongList, setCurrentIndex, setCurrentSong, setPlaying, setCurrentId };
            fetchAlbumSongs(album?.type, album?.id, context);
        }, 300),
        [album?.type, album?.id, fetchAlbumSongs, songList]
    );

    return (
        <div
            className="group relative flex flex-col items-center rounded-lg overflow-hidden w-full cursor-pointer transition-transform transform hover:scale-101 sm:hover:underline"
            onClick={handleAlbumClick}
        >
            <div className="relative w-full pb-[100%]">
                <div className="absolute top-0 left-0 w-full h-full transition-opacity duration-300 sm:group-hover:opacity-80">
                    {album?.image && !imageError ? (
                        <img
                            src={album?.image}
                            alt={`${album?.title} cover`}
                            fill="true"
                            loading="lazy"
                            quality={100}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="absolute top-0 left-0 w-full h-full rounded-md object-cover"
                            onError={() => setImageError(true)} // Set imageError to true on error
                        />
                    ) : (
                        <Skeleton className="absolute top-0 left-0 w-full h-full rounded" />
                    )}
                </div>
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center group">
                    {/* Play Button */}
                    <div className="relative flex items-center justify-center w-12 h-12 transform scale-0 transition-all duration-300 ease-out opacity-0 sm:group-hover:scale-100 sm:group-hover:opacity-100">
                        <div className="absolute w-full h-full bg-green-600 rounded-full shadow-lg shadow-green-500/50 hover:bg-green-500"></div>
                        <Play className="relative w-6 h-6 text-black" />
                    </div>
                </div>
            </div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="w-full mt-2 px-2 cursor-pointer text-center">
                            {album?.title ? (
                                <Label
                                    className={`font-bold cursor-pointer text-gray-800 dark:text-gray-300 text-sm truncate`}
                                >
                                    {truncateTitle(album.title)}
                                </Label>
                            ) : (
                                <Skeleton className="h-4 w-full rounded" />
                            )}
                        </div>
                    </TooltipTrigger>
                    {album?.title?.length > 24 && (
                        <TooltipContent>
                            <p className="z-10 text-xs text-gray-800 dark:text-gray-300">{album?.title}</p>
                        </TooltipContent>
                    )}
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export default AlbumBar;
