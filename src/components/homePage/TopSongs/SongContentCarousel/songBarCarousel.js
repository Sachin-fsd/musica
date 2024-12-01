'use client'

import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { UserContext } from "@/context";
import { useCallback, useContext, useState } from "react";
import { debounce } from "lodash";
import { playAndFetchSuggestions } from "@/utils/playAndFetchSuggestionUtils";
import { Play } from "lucide-react";
import { decodeHtml, htmlParser } from "@/utils";
import Marquee from "react-fast-marquee";

const SongBarCarousel = ({ song, index }) => {
    const { currentSong, currentIndex, songList, setSongList, setCurrentIndex, setCurrentSong, setPlaying, setCurrentId, currentId, setLoading } = useContext(UserContext);
    const [imageError, setImageError] = useState(false);

    const truncateTitle = (title, maxLength = 18) => {
        let result = title?.length > maxLength ? `${title?.substring(0, maxLength)}...` : title;
        return decodeHtml(result);
    };

    const handlePlayClick = useCallback(
        debounce(async () => {
            setLoading(true);
            try {
                const context = { setCurrentIndex, currentIndex, setSongList, songList, setCurrentSong, setPlaying, setCurrentId, currentSong };
                await playAndFetchSuggestions(song, context);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }, 300),
        [song, currentIndex, songList]
    );

    const imageUrl = song?.image[1]?.url; // Verify if the image URL exists

    return (
        <div
            className="relative flex flex-col items-center p-1 rounded-lg overflow-hidden w-full cursor-pointer transition-transform transform hover:scale-101 hover:underline"
            onClick={handlePlayClick}
        >
            <div className="relative w-full pb-[100%]">
                <div className="absolute  top-0 left-0 w-full h-full transition-opacity duration-300 sm:hover:opacity-80">
                    {song?.image ? (
                        <img
                            src={imageUrl}
                            alt={`${song?.name} cover`}
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
                <div className=" absolute w-full h-full flex bottom-0 right-0  duration-300  sm:hover:translate-x-0 translate-x-14 ">
                    <div className="absolute bottom-0 right-0 -translate-x-1 -translate-y-1 bg-green-600 bg-opacity-100 rounded-full p-3 hover:scale-105 hover:bg-green-500">
                        <Play className="w-5 h-5 text-black fill-black" />
                    </div>
                </div>
            </div>
            <div className="w-full text-balance mt-2 px-2 cursor-pointer">
                {song?.name ? (
                    <Label className={`font-bold cursor-pointer text-gray-800 dark:text-gray-300 ${song?.id === currentSong?.id ? " dark:text-green-700 text-green-700" : ""} text-sm`}>
                        <Marquee speed={5}>
                            {decodeHtml(song?.name)}
                        </Marquee>
                    </Label>
                ) : (
                    <Skeleton className="h-4 w-full rounded" />
                )}
            </div>
        </div>
    );
};

export default SongBarCarousel;
