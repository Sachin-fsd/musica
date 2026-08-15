"use client";

import { GetSongsByIdAction } from "@/app/actions";
import { persistSearchedAction } from "@/app/actions/interactions";
import { makeSongMetadata } from "@/utils/extraFunctions";
import { UserContext } from "@/context";
import { decode } from "he";
import Image from "next/image";
import { useContext, useState } from "react";
import { Play, Loader2, Pause } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const TopQueryCard = ({ data }) => {
    const {
        playing,
        playSongAndCreateQueue,
        setSongList,
        setCurrentSong,
        setPlaying,
        currentSong,
    } = useContext(UserContext);

    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    if (!data) return null;

    const isArtist = data.type === "artist";

    const imageUrl =
        data.image?.[2]?.url ||
        data.image?.[1]?.url ||
        data.image?.[0]?.url ||
        "/placeholder-image.jpg";

    const isActive = currentSong?.id === data.id;

    const handlePlay = async () => {
        if (!data?.id || !data?.type || loading) return;

        try {
            setLoading(true);

            const response = await queryClient.fetchQuery({
                queryKey: ["top-query", data.type, data.id],

                queryFn: async () => {
                    const result = await GetSongsByIdAction(data.type, data.id);

                    if (!result?.success) {
                        throw new Error("Failed to fetch top query");
                    }

                    return result;
                },

                staleTime: 10 * 60 * 1000,
                gcTime: 60 * 60 * 1000,
            });

            if (!response?.success) {
                throw new Error("Failed to fetch top query");
            }

            // SONG
            if (data.type === "song" && response.data?.length > 0) {
                const song = response.data[0];

                persistSearchedAction(song.id, makeSongMetadata(song)).catch((err) =>
                    console.error("persistSearchedAction failed:", err)
                );

                playSongAndCreateQueue(song);
                return;
            }

            // ALBUM
            if (data.type === "album" && response.data?.songs?.length > 0) {
                const songs = response.data.songs;

                setSongList(songs);
                setCurrentSong(songs[0]);
                setPlaying(true);
                return;
            }

            // ARTIST
            if (data.type === "artist" && response.data?.topSongs?.length > 0) {
                const songs = response.data.topSongs;

                setSongList(songs);
                setCurrentSong(songs[0]);
                setPlaying(true);
                return;
            }

            console.warn("No playable content found:", response);
        } catch (error) {
            console.error("Error fetching top query:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handlePlay}
            disabled={loading}
            className="group relative flex w-full cursor-pointer flex-col items-center gap-6 rounded-2xl bg-secondary/30 p-6 text-left transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-wait sm:flex-row sm:items-start sm:hover:bg-secondary/60"
        >
            {/* Image Section */}
            <div className={`relative h-32 w-32 shrink-0 overflow-hidden shadow-lg sm:h-40 sm:w-40 ${isArtist ? "rounded-full" : "rounded-xl"}`}>
                <Image
                    src={imageUrl}
                    fill
                    sizes="(max-width: 640px) 128px, 160px"
                    className="object-cover"
                    alt={decode(data.title || "Cover art")}
                />

                {/* Hover Play Button */}
                {!loading && (
                    <div className={`absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 sm:group-hover:opacity-100 ${isArtist ? "rounded-full" : "rounded-xl"}`}>
                        <div className="scale-75 transform rounded-full bg-primary p-3 text-primary-foreground shadow-xl transition-transform duration-300 ease-out sm:group-hover:scale-100">
                            {playing && isActive ? (
                                <Pause className="ml-1 h-8 w-8 fill-current" />
                            ) : (
                                <Play className="ml-1 h-8 w-8 fill-current" />
                            )}
                        </div>
                    </div>
                )}

                {/* Loading Overlay */}
                {loading && (
                    <div className={`absolute inset-0 flex items-center justify-center bg-black/60 ${isArtist ? "rounded-full" : "rounded-xl"}`}>
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
            </div>

            {/* Text & Meta */}
            <div className="flex min-w-0 flex-1 flex-col items-center pt-2 text-center sm:items-start sm:text-left">
                {/* Type Badge */}
                <span className="mb-3 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                    {decode(data.type || "Unknown")}
                </span>

                {/* Title */}
                <h3 className={`w-full truncate text-2xl font-bold sm:text-3xl ${isActive ? "text-primary" : "text-foreground"}`}>
                    {decode(data.title || "")}
                </h3>

                {/* Subtitle */}
                <p className="mt-2 line-clamp-1 text-base text-muted-foreground sm:text-lg">
                    {decode(data.primaryArtists || data.album || data.description || "")}
                </p>

                {/* Now Playing */}
                {isActive && !loading && (
                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
                        <div className="flex h-3 items-end gap-1">
                            <span className="h-3 w-1 animate-[bounce_1s_infinite] bg-primary" />
                            <span className="h-2 w-1 animate-[bounce_1s_infinite_0.2s] bg-primary" />
                            <span className="h-3 w-1 animate-[bounce_1s_infinite_0.4s] bg-primary" />
                        </div>

                        Now Playing
                    </div>
                )}
            </div>
        </button>
    );
};

export default TopQueryCard;