'use client'

import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { UserContext } from "@/context";
import { useCallback, useContext, useState } from "react";
import { debounce } from "lodash";
import { fetchAlbumSongs } from "@/utils/playAndFetchSuggestionUtils";
import { Play } from "lucide-react"; // Import the Play icon

const AlbumBar = ({ album }) => {
    const { currentSong, currentIndex, songList, setSongList, setCurrentIndex, setCurrentSong, setPlaying, setCurrentId, setLoading, setIsLooping } = useContext(UserContext);

    const [imageError, setImageError] = useState(false)

    const truncateTitle = (title, maxLength = 24) => {
        return title?.length > maxLength ? `${title?.substring(0, maxLength)}...` : title;
    };

    // Define a debounced function
    const handleAlbumClick = useCallback(debounce(() => {
        const context = { currentSong, currentIndex, songList, setSongList, setCurrentIndex, setCurrentSong, setPlaying, setCurrentId }
        fetchAlbumSongs(album?.type, album?.id, context);
    }, 300), [album?.type, album?.id, fetchAlbumSongs, songList]);

    return (
        <div
            className="relative flex flex-col items-center rounded-lg overflow-hidden w-full cursor-pointer transition-transform transform hover:scale-101 sm:hover:underline"
            onClick={handleAlbumClick}
        >
            <div className="relative w-full pb-[100%]">
                <div className="absolute  top-0 left-0 w-full h-full transition-opacity duration-300 sm:hover:opacity-80">
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
                <div className=" absolute w-full h-full flex bottom-0 right-0  duration-300  sm:hover:translate-x-0 translate-x-12 ">
                    <div className="absolute bottom-0 right-0 -translate-x-1 -translate-y-1 bg-green-600 bg-opacity-100 rounded-full p-3 hover:scale-105 hover:bg-green-500">
                        <Play className="w-5 h-5 text-black fill-black" />
                    </div>
                </div>
            </div>
            <div className="w-full text-pretty mt-2 px-2 cursor-pointer">
                {album?.title ? (
                    <Label className="font-bold cursor-pointer text-gray-800 dark:text-gray-300 text-sm ">
                        {truncateTitle(album.title)}
                    </Label>
                ) : (
                    <Skeleton className="h-4 w-full rounded" />
                )}
            </div>
        </div>
    );
};

export default AlbumBar;
