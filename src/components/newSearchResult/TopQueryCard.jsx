"use client";

import { GetSongsByIdAction } from "@/app/actions";
import { UserContext } from "@/context";
import { decode } from "he";
import Image from "next/image";
import { useContext, useState } from "react";
import { Play, Loader2, Pause } from "lucide-react";

const TopQueryCard = ({ data }) => {
    const { playing, playSongAndCreateQueue, setSongList, setCurrentSong, setPlaying, currentSong } =
        useContext(UserContext);
    const [loading, setLoading] = useState(false);

    if (!data) return null;

    const isArtist = data.type === "artist";
    const imageUrl = data.image?.[2]?.url || data.image?.[1]?.url || data.image?.[0]?.url || "/placeholder-image.jpg";
    const isActive = currentSong?.id === data.id;

    async function handlePlay() {
        if (!data.id || loading) return;

        try {
            setLoading(true);
            const response = await GetSongsByIdAction(data.type, data.id);

            if (response?.success) {
                if (data.type === "song") {
                    playSongAndCreateQueue(response.data[0]);
                } else if (data.type === "album") {
                    setSongList(response.data.songs);
                    setCurrentSong(response.data.songs[0]);
                    setPlaying(true);
                } else if (data.type === "artist") {
                    setSongList(response.data.topSongs);
                    setCurrentSong(response.data.topSongs[0]);
                    setPlaying(true);
                }
            } else {
                console.error("Error fetching top query", response);
            }
        } catch (error) {
            console.error("Error in top query card click", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            onClick={handlePlay}
            role="button"
            tabIndex={0}
            className="group relative flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-2xl bg-secondary/30 hover:bg-secondary/60 transition-all duration-300 ease-out cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
            {/* Image Section */}
            <div className="relative shrink-0 w-32 h-32 sm:w-40 sm:h-40 shadow-lg">
                <Image
                    src={imageUrl}
                    fill
                    sizes="(max-width: 640px) 128px, 160px"
                    className={`object-cover ${isArtist ? "rounded-full" : "rounded-xl"}`}
                    alt={decode(data.title || "Cover art")}
                />

                {/* Hover Play Button Overlay */}
                {!loading && (
                    <div className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center ${isArtist ? "rounded-full" : "rounded-xl"}`}>
                        <div className="bg-primary text-primary-foreground rounded-full p-3 shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300 ease-out">
                            {playing ? <Pause className="w-8 h-8 fill-current ml-1" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                        </div>
                    </div>
                )}

                {/* Loading State Overlay */}
                {loading && (
                    <div className={`absolute inset-0 bg-black/60 flex items-center justify-center ${isArtist ? "rounded-full" : "rounded-xl"}`}>
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                )}
            </div>

            {/* Text & Meta Section */}
            <div className="flex flex-col flex-1 items-center sm:items-start text-center sm:text-left min-w-0 pt-2">
                {/* Type Badge */}
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary mb-3">
                    {decode(data.type || "Unknown")}
                </span>

                {/* Title */}
                <h3 className={`text-2xl sm:text-3xl font-bold truncate w-full ${isActive ? "text-primary" : "text-foreground"}`}>
                    {decode(data.title || "")}
                </h3>

                {/* Subtitle / Artists */}
                <p className="text-muted-foreground mt-2 text-base sm:text-lg line-clamp-1">
                    {decode(data.primaryArtists || data.album || data.description || "")}
                </p>

                {/* Visual Indicator if actively playing */}
                {isActive && !loading && (
                    <div className="mt-4 flex items-center gap-2 text-primary text-sm font-medium">
                        <div className="flex gap-1 items-end h-3">
                            <span className="w-1 h-3 bg-primary animate-[bounce_1s_infinite]"></span>
                            <span className="w-1 h-2 bg-primary animate-[bounce_1s_infinite_0.2s]"></span>
                            <span className="w-1 h-3 bg-primary animate-[bounce_1s_infinite_0.4s]"></span>
                        </div>
                        Now Playing
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopQueryCard;