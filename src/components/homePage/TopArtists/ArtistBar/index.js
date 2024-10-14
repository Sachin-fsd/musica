'use client'

import { GetAlbumSongsByIdAction, GetSongsByIdAction } from "@/app/actions";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { UserContext } from "@/context";
import Image from "next/image";
import { useCallback, useContext, useState } from "react";
import { debounce } from "lodash";
import { fetchAlbumSongs } from "@/utils/playAndFetchSuggestionUtils";
import { Play } from "lucide-react"; // Import the Play icon

const ArtistBar = ({ album }) => {
    const { currentSong, currentIndex, songList, setSongList, setCurrentIndex, setCurrentSong, setPlaying, setCurrentId, setLoading, setIsLooping } = useContext(UserContext);

    const [imageError, setImageError] = useState(false)

    const truncateTitle = (title, maxLength = 15) => {
        return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
    };

    // Define a debounced function
    const handleAlbumClick = useCallback(debounce(() => {
        const context = { currentSong, currentIndex, songList, setSongList, setCurrentIndex, setCurrentSong, setPlaying, setCurrentId }
        fetchAlbumSongs(album.type, album.id, context);
    }, 300), [album.type, album.id, fetchAlbumSongs, songList]);

    return (
        <div
            className="relative flex flex-col items-center border p-1 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden w-full cursor-pointer transition-transform transform hover:scale-101"
            onClick={handleAlbumClick}
        >
            {console.log(album)}
            <div className="relative w-full pb-[100%]">
                <div className="absolute  top-0 left-0 w-full h-full transition-opacity duration-300 hover:opacity-80">
                    {album.image[1] && !imageError ? (
                        <img
                            src={album.image[1].url}
                            alt={`${album.name} cover`}
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
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100">
                    <div className="bg-black bg-opacity-50 rounded-full p-2">
                        <Play className="w-8 h-8 text-white" />
                    </div>
                </div>
            </div>
            <div className="w-full text-center mt-2 px-2">
                {album.name ? (
                    <Label className="font-bold text-gray-800 dark:text-gray-300 truncate text-sm">
                        {truncateTitle(album.name)}
                    </Label>
                ) : (
                    <Skeleton className="h-4 w-full rounded" />
                )}
            </div>
        </div>
    );
};

export default ArtistBar;
