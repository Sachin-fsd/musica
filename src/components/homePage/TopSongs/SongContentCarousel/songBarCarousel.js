'use client'

import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { UserContext } from "@/context";
import { useCallback, useContext, useState } from "react";
import { debounce } from "lodash";
import { playAndFetchSuggestions } from "@/utils/playAndFetchSuggestionUtils";
import { Play } from "lucide-react"; // Import the Play icon

const SongBarCarousel = ({ song }) => {
    const { currentSong, currentIndex, songList, setSongList, setCurrentIndex, setCurrentSong, setPlaying, setCurrentId, setLoading } = useContext(UserContext);
    const [imageError, setImageError] = useState(false)

    const truncateTitle = (title, maxLength = 15) => {
        return title.length > maxLength ? `${title?.substring(0, maxLength)}...` : title;
    };

    // Define a debounced function
    const handleClick = useCallback(() => {
        setLoading(true);
        debounce(async () => {
            try {
                const context = { setCurrentIndex, currentIndex, setSongList, songList, setCurrentSong, setPlaying, setCurrentId, currentSong };
                await playAndFetchSuggestions(song, context);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }, 300)();
    }, [song, setCurrentIndex, currentIndex, setSongList, songList, setCurrentSong, setPlaying, setCurrentId]);

    return (
        <div
            className="relative flex flex-col items-center border p-1 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden w-full cursor-pointer transition-transform transform hover:scale-101"
            onClick={handleClick}
        >
            <div className="relative w-full pb-[100%]">
                <div className="absolute  top-0 left-0 w-full h-full transition-opacity duration-300 hover:opacity-80">
                    {song.image && !imageError ? (
                        <img
                            src={song.image[1].url}
                            alt={`${song.name} cover`}
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
                {song.name ? (
                    <Label className="font-bold text-gray-800 dark:text-gray-300 truncate text-sm">
                        {truncateTitle(song.name)}
                    </Label>
                ) : (
                    <Skeleton className="h-4 w-full rounded" />
                )}
            </div>
        </div>
    );
};

export default SongBarCarousel;
