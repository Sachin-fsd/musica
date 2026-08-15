"use client";

import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { UserContext } from "@/context";
import { decode } from "he";
import { GetSongsByIdAction, SearchSongsAction } from "@/app/actions";
import { persistSearchedAction } from "@/app/actions/interactions";
import { makeSongMetadata } from "@/utils/extraFunctions";
import { Play, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

// Normalize every song to a consistent schema
const toDetailedSong = (song) => {
    if (!song) return null;

    const isDetailed = !!song.artists?.primary;

    return {
        id: song.id || "",
        name: song.name || song.title || "",
        title: song.title || song.name || "",
        type: song.type || "song",
        year: song.year || null,
        releaseDate: song.releaseDate || null,
        duration: song.duration || null,
        label: song.label || null,
        explicitContent: song.explicitContent ?? false,
        playCount: song.playCount || null,
        language: song.language || "unknown",
        hasLyrics: song.hasLyrics ?? false,
        lyricsId: song.lyricsId || null,
        url: song.url || "",
        copyright: song.copyright || null,

        album: {
            id: song.album?.id || null,
            name: song.album?.name || song.album || "",
            url: song.album?.url || null,
        },

        artists: {
            primary: isDetailed
                ? song.artists.primary
                : song.primaryArtists
                    ? song.primaryArtists.split(",").map((name, idx) => ({
                        id: `${song.id}-artist-${idx}`,
                        name: name.trim(),
                        role: "primary",
                        type: "artist",
                        image: [],
                        url: "",
                    }))
                    : [],

            featured: isDetailed ? song.artists.featured || [] : [],
            all: isDetailed ? song.artists.all || [] : [],
        },

        image: song.image || [],
        downloadUrl: song.downloadUrl || [],
    };
};

// Extract UI-safe display values
const getSongDisplay = (song) => ({
    title: song.name || "",
    album: song.album?.name || "",
    artists: song.artists?.primary?.map((a) => a.name).join(", ") || "",
    image: song.image?.[1]?.url || song.image?.[0]?.url || "/placeholder.png",
});

const SongCard = ({ data, search }) => {
    const [page, setPage] = useState(1);
    const [songs, setSongs] = useState([]);
    const [totalResults, setTotalResults] = useState(100);
    const [loadMoreLoading, setLoadMoreLoading] = useState(false);
    const [songDetailsLoading, setSongDetailsLoading] = useState(null);

    const { playSongAndCreateQueue, currentSong } = useContext(UserContext);
    const queryClient = useQueryClient();

    // Normalize initial search data
    useEffect(() => {
        if (data?.length > 0) {
            const normalized = data.map(toDetailedSong).filter(Boolean);
            setSongs(normalized);
        } else {
            setSongs([]);
        }

        setPage(1);
    }, [data]);

    const handleSongClick = async (song) => {
        if (!song?.id || songDetailsLoading === song.id) {
            return;
        }

        /*
         * If the search result already contains downloadUrl,
         * we already have everything needed to play the song.
         */
        if (song.downloadUrl?.length > 0) {
            persistSearchedAction(song.id, makeSongMetadata(song)).catch((err) =>
                console.error("persistSearchedAction failed:", err)
            );

            playSongAndCreateQueue(song);
            return;
        }

        try {
            setSongDetailsLoading(song.id);

            /*
             * React Query now owns the fetching + caching.
             *
             * Cache key is per song:
             *
             * ["song-details", song.id]
             *
             * So clicking the same song again does NOT
             * cause another request while the cache is fresh.
             */
            const detailedSong = await queryClient.fetchQuery({
                queryKey: ["song-details", song.id],

                queryFn: async () => {
                    const result = await GetSongsByIdAction("song", song.id);

                    if (!result?.success || !result.data?.length) {
                        throw new Error("Failed to fetch song details");
                    }

                    return result.data[0];
                },

                staleTime: 10 * 60 * 1000,
                gcTime: 60 * 60 * 1000,
            });

            if (!detailedSong) {
                throw new Error("No song details returned");
            }

            persistSearchedAction(
                detailedSong.id,
                makeSongMetadata(detailedSong)
            ).catch((err) =>
                console.error("persistSearchedAction failed:", err)
            );

            playSongAndCreateQueue(detailedSong);
        } catch (error) {
            console.error("Error playing song:", error);
        } finally {
            setSongDetailsLoading(null);
        }
    };

    const handleLoadMore = async () => {
        if (loadMoreLoading || !search) return;

        try {
            setLoadMoreLoading(true);

            const response = await SearchSongsAction(search, page + 1, 20);

            if (response?.success && response.data?.results?.length > 0) {
                const newSongs = response.data.results
                    .map(toDetailedSong)
                    .filter(Boolean);

                setSongs((prev) => [...prev, ...newSongs]);
                setPage((prev) => prev + 1);
                setTotalResults(response.data.total || 0);
            }
        } catch (error) {
            console.error("Error searching songs:", error);
        } finally {
            setLoadMoreLoading(false);
        }
    };

    if (!songs.length) {
        return null;
    }

    return (
        <div className="flex w-full flex-col space-y-2">
            {songs.map((song, index) => {
                const display = getSongDisplay(song);
                const isActive = currentSong?.id === song.id;
                const isLoading = songDetailsLoading === song.id;

                return (
                    <button
                        key={`${song.id}-${index}`}
                        type="button"
                        onClick={() => handleSongClick(song)}
                        disabled={isLoading}
                        className="group flex w-full cursor-pointer items-center gap-4 rounded-xl p-3 text-left transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-wait sm:hover:bg-secondary/50"
                    >
                        {/* Cover Image */}
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md shadow-sm sm:h-16 sm:w-16">
                            <Image
                                src={display.image}
                                fill
                                sizes="(max-width: 640px) 56px, 64px"
                                className="object-cover"
                                alt={decode(display.title || "Song cover")}
                            />

                            {/* Hover Play */}
                            {!isLoading && !isActive && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 sm:group-hover:opacity-100">
                                    <Play className="ml-1 h-6 w-6 fill-white text-white" />
                                </div>
                            )}

                            {/* Loading */}
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                </div>
                            )}

                            {/* Active song */}
                            {isActive && !isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity sm:group-hover:opacity-0">
                                    <div className="flex h-4 items-end gap-[2px]">
                                        <span className="h-4 w-1 animate-[bounce_1s_infinite] bg-primary" />
                                        <span className="h-2 w-1 animate-[bounce_1s_infinite_0.2s] bg-primary" />
                                        <span className="h-3 w-1 animate-[bounce_1s_infinite_0.4s] bg-primary" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Song Info */}
                        <div className="flex min-w-0 flex-1 flex-col justify-center">
                            <h4
                                className={`w-full truncate text-base font-semibold ${isActive ? "text-primary" : "text-foreground transition-colors group-hover:text-primary"}`}
                            >
                                {decode(display.title)}
                            </h4>

                            <p className="mt-0.5 w-full truncate text-sm text-muted-foreground">
                                {decode(display.artists)}
                                {display.album && ` • ${decode(display.album)}`}
                            </p>
                        </div>
                    </button>
                );
            })}

            {/* Load More */}
            {songs.length < totalResults && (
                <div className="flex justify-center pb-2 pt-4">
                    <Button
                        variant="secondary"
                        onClick={handleLoadMore}
                        disabled={loadMoreLoading}
                        className="rounded-full px-8"
                    >
                        {loadMoreLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            "Load More"
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default SongCard;