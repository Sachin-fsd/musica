'use client'

import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { UserContext } from "@/context";
import { useCallback, useContext, useState } from "react";
import { debounce } from "lodash";
import { playAndFetchSuggestions } from "@/utils/playAndFetchSuggestionUtils";
import { Play } from "lucide-react";
import { decodeHtml, htmlParser } from "@/utils";
// import Marquee from "@/components/ui/marquee";
import Marquee from "react-fast-marquee";


const SongBarCarousel = ({ song }) => {
    const { currentSong, currentIndex, songList, setSongList, setCurrentIndex, setCurrentSong, setPlaying, setCurrentId, setLoading } = useContext(UserContext);
    const [imageError, setImageError] = useState(false);

    const truncateTitle = (title, maxLength = 18) => {
        const result = title?.length > maxLength ? `${title?.substring(0, maxLength)}...` : title;
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

    const imageUrl = song?.image[1]?.url;

    return (
        <div
            className="relative flex flex-col items-center rounded-lg transition-transform transform sm:hover:scale-102 shadow-md overflow-hidden cursor-pointer"
            onClick={handlePlayClick}
        >
            <div className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
                {song?.image ? (
                    <img
                        src={imageUrl}
                        alt={`${song?.name} cover`}
                        // className="absolute inset-0 w-full h-full rounded-md object-cover"
                        className="rounded-md"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <Skeleton className="absolute inset-0 w-full h-full rounded-md" />
                )}

                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 sm:hover:opacity-100 bg-black/30 rounded-md">
                    <div className="bg-green-500 hover:bg-green-400 p-3 rounded-full shadow-lg transition-transform transform hover:scale-110">
                        <Play className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>

            {/* Song title */}
            <div className="w-full mt-2 text-center px-2">
                {song?.name ? (
                    <Label className={`font-medium text-sm text-gray-800 dark:text-gray-300 ${song?.id === currentSong?.id ? "text-green-600 dark:text-green-400" : ""}`}>
                        {
                            song?.name.length > 12 ?
                                <Marquee gradient={false} speed={20} pauseOnHover={true} className="whitespace-nowrap">
                                    <span style={{ marginRight: "20px" }}>{htmlParser(song?.name)}</span>
                                </Marquee>
                                :
                                htmlParser(song?.name)
                        }
                    </Label>
                ) : (
                    <Skeleton className="h-4 w-full rounded" />
                )}
            </div>
        </div>
    );
};

export default SongBarCarousel;
