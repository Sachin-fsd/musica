'use client';

import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { UserContext } from "@/context";
import { useCallback, useContext, useState, useMemo } from "react";
import { Pause, Play } from "lucide-react";
import { htmlParser } from "@/utils";
import dynamic from "next/dynamic";

// Dynamically import Marquee to prevent hydration issues with this third-party library
const Marquee = dynamic(() => import("react-fast-marquee"), { ssr: false });

const SongBarCarousel = ({ song }) => {
    // 1. Consume the simplified context, including our powerful orchestrator function
    const {
        currentSong,
        playing,
        setPlaying,
        loading,
        playSongAndCreateQueue, // Assumes this function from our previous refactor exists in the context
    } = useContext(UserContext);

    const [imageError, setImageError] = useState(false);

    // 2. Use `useMemo` to derive state, making rendering logic cleaner and more efficient
    const isCurrentlyPlaying = useMemo(() => currentSong?.id === song?.id, [currentSong?.id, song?.id]);

    // 3. The click handler is now much simpler and more intuitive
    const handleClick = useCallback(() => {
        // Prevent actions while another song is loading
        if (loading) return;

        if (isCurrentlyPlaying) {
            // If the clicked song is the one already playing, just toggle its play/pause state
            setPlaying(!playing);
        } else {
            // If it's a new song, delegate the entire complex process to the context
            playSongAndCreateQueue(song);
        }
    }, [loading, isCurrentlyPlaying, playing, song, setPlaying, playSongAndCreateQueue]);

    // Graceful skeleton loading state
    if (!song?.id) {
        return <Skeleton className="w-full h-48 rounded-lg" />;
    }

    return (
        <div
            className="relative flex flex-col items-center rounded-lg shadow-md overflow-hidden cursor-pointer group"
            onClick={handleClick}
        >
            {/* Image Container */}
            <div className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
                <img
                    src={imageError ? '/path/to/fallback-image.png' : song.image[2]?.url}
                    alt={`${song.name} cover`}
                    className="absolute inset-0 w-full h-full object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
                    onError={() => setImageError(true)}
                    loading="lazy"
                />

                {/* Play/Pause Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all duration-300">
                    <div className="bg-green-500 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                        {isCurrentlyPlaying && playing ? (
                            <Pause className="w-6 h-6 text-black fill-black" />
                        ) : (
                            <Play className="w-6 h-6 text-black fill-black" />
                        )}
                    </div>
                </div>
            </div>

            {/* Song Title Section */}
            <div className="w-full mt-2 text-center px-2">
                <Label
                    className={`font-medium text-sm transition-colors ${isCurrentlyPlaying ? "text-green-600 dark:text-green-400" : "text-gray-800 dark:text-gray-300"}`}
                >
                    {song.name?.length > 18 || song.title?.length > 18 ? (
                        <div className="w-full overflow-hidden">
                            <Marquee gradient={false} speed={25} pauseOnHover>
                                {/* Add margin for seamless looping effect */}
                                <span className="mr-6">{htmlParser(song.name || song.title)}</span>
                            </Marquee>
                        </div>
                    ) : (
                        htmlParser(song.name)
                    )}
                </Label>
            </div>
        </div>
    );
};

export default SongBarCarousel;