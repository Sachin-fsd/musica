'use client';

import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { UserContext } from "@/context";
import { useCallback, useContext, useState } from "react";
import { debounce } from "lodash";
import { playAndFetchSuggestions } from "@/utils/playAndFetchSuggestionUtils";
import { Play } from "lucide-react";
import { decodeHtml, htmlParser } from "@/utils";
import dynamic from "next/dynamic";

// Dynamically import Marquee to prevent hydration issues
const Marquee = dynamic(() => import("react-fast-marquee"), { ssr: false });

const SongBarCarousel = ({ song }) => {
    const { audioRef, currentSong, setSongList, setCurrentIndex, setCurrentSong, setPlaying, setCurrentId, setLoading, loading } = useContext(UserContext);
    const [imageError, setImageError] = useState(false);

    // Truncate the title with HTML decoding
    const truncateTitle = (title, maxLength = 18) => {
        return decodeHtml(title?.length > maxLength ? `${title?.substring(0, maxLength)}...` : title);
    };

    // Handle play click with debouncing
    const handlePlayClick = useCallback(
        debounce(async () => {
            if (!song || loading) return; // Skip if no song or already loading
            audioRef.current.src = song.downloadUrl[4].url;
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            try {
                await playAndFetchSuggestions(song, { setSongList, setCurrentIndex, setCurrentSong, setPlaying, setCurrentId });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }, 300),
        [song, setSongList, setCurrentIndex, setCurrentSong, setPlaying, setCurrentId]
    );

    // Extract image URL
    const imageUrl = song?.image[1]?.url;

    return (
        <div
            className="relative flex flex-col items-center rounded-lg transition-transform transform sm:hover:scale-102 shadow-md overflow-hidden cursor-pointer"
            onClick={handlePlayClick}
        >
            {/* Image or fallback skeleton */}
            <div className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
                {imageError || !imageUrl ? (
                    <Skeleton className="absolute inset-0 w-full h-full rounded-md" />
                ) : (
                    <img
                        src={imageUrl}
                        alt={`${song?.name} cover`}
                        className="rounded-md"
                        loading="lazy" // Image lazy load for better performance
                        onError={() => setImageError(true)}
                    />
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
                    <Label
                        className={`font-medium text-sm text-gray-800 dark:text-gray-300 ${song?.id === currentSong?.id ? "text-green-600 dark:text-green-400" : ""}`}
                    >
                        {song?.name.length > 12 ? (
                            <div className="w-full overflow-hidden">
                                <Marquee gradient={false} speed={20} pauseOnHover={true} className="whitespace-nowrap">
                                    <span style={{ marginRight: "20px" }}>{htmlParser(song?.name)}</span>
                                </Marquee>
                            </div>
                        ) : (
                            htmlParser(song?.name)
                        )}
                    </Label>
                ) : (
                    <Skeleton className="h-4 w-full rounded" />
                )}
            </div>
        </div>
    );
};

export default SongBarCarousel;
