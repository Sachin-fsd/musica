'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserContext } from "@/context";
import { useCallback, useContext, useState } from "react";
import { debounce } from "lodash";
import { playAndFetchSuggestions } from "@/utils/playAndFetchSuggestionUtils";
import { Play } from "lucide-react";
import { decodeHtml } from "@/utils";
import Marquee from "react-fast-marquee";

const SongBarCarousel = ({ song }) => {
    const {
        currentSong,
        currentIndex,
        songList,
        setSongList,
        setCurrentIndex,
        setCurrentSong,
        setPlaying,
        setCurrentId,
        setLoading,
    } = useContext(UserContext);

    const [imageError, setImageError] = useState(false);

    const handlePlayClick = useCallback(
        debounce(async () => {
            setLoading(true);
            try {
                const context = {
                    setCurrentIndex,
                    currentIndex,
                    setSongList,
                    songList,
                    setCurrentSong,
                    setPlaying,
                    setCurrentId,
                    currentSong,
                };
                await playAndFetchSuggestions(song, context);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }, 300),
        [song, currentIndex, songList]
    );

    const imageUrl = song?.image?.[1]?.url;

    return (
        <Card
            className="relative w-full max-w-[140px] sm:max-w-[160px] cursor-pointer transition-transform transform hover:scale-101 border-none p-1"
            onClick={handlePlayClick}
        >
            {/* Image Section */}
            <div className="relative aspect-square w-full rounded-t-lg overflow-hidden">
                {imageUrl && !imageError ? (
                    <img
                        src={imageUrl}
                        alt={`${song?.name} cover`}
                        loading="lazy"
                        className="absolute top-1/2 left-1/2 max-w-none transform -translate-x-1/2 -translate-y-1/2 rounded-sm"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <Skeleton className="w-full h-full" />
                )}

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center group">
                    {/* Play Button */}
                    <div className="relative flex items-center justify-center w-12 h-12 transform scale-0 transition-all duration-300 ease-out opacity-0 sm:group-hover:scale-100 sm:group-hover:opacity-100">
                        <div className="absolute w-full h-full bg-green-600 rounded-full shadow-lg shadow-green-500/50 hover:bg-green-500"></div>
                        <Play className="relative w-6 h-6 text-black" />
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <CardContent className="p-2 text-center">
                {song?.name ? (
                    <div
                        className={`font-bold text-xs sm:text-sm text-gray-800 dark:text-gray-300 ${song?.id === currentSong?.id ? "text-green-700 dark:text-green-700" : ""
                            }`}
                    >
                        {song?.name.length > 15 ? (
                            <Marquee speed={15} gradient={false}>
                                {decodeHtml(song?.name)}
                            </Marquee>
                        ) : (
                            decodeHtml(song?.name)
                        )}
                    </div>
                ) : (
                    <Skeleton className="h-4 w-full rounded" />
                )}
            </CardContent>
        </Card>
    );
};

export default SongBarCarousel;
