"use client";

import { useContext, useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { UserContext } from "@/context";
import { decode } from "he";
import { GetSongsByIdAction, SearchSongsAction } from "@/app/actions";
import { Play, Loader2 } from "lucide-react";

// 🔥 Universal normalizer → always detailed schema
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
                : (song.primaryArtists
                    ? song.primaryArtists.split(",").map((name, idx) => ({
                        id: `${song.id}-artist-${idx}`,
                        name: name.trim(),
                        role: "primary",
                        type: "artist",
                        image: [],
                        url: "",
                    }))
                    : []),
            featured: isDetailed ? song.artists.featured || [] : [],
            all: isDetailed ? song.artists.all || [] : [],
        },

        image: song.image || [],
        downloadUrl: song.downloadUrl || [],
    };
};

// 🔥 Extract UI safe display values
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

    // Normalize initial data
    useEffect(() => {
        if (data && data.length > 0) {
            const normalized = data.map(toDetailedSong).filter(Boolean);
            setSongs(normalized);
        } else {
            setSongs([]);
        }
        setPage(1);
    }, [data]);

    // Handle click → always safe detailed schema
    const handleSongClick = async (song) => {
        if (songDetailsLoading === song.id) return;
        
        try {
            if (song.downloadUrl && song.downloadUrl.length > 0) {
                playSongAndCreateQueue(song);
                return;
            }
            
            setSongDetailsLoading(song.id);
            const result = await GetSongsByIdAction("song", song.id);
            
            if (result?.success && result.data?.length > 0) {
                playSongAndCreateQueue(result.data[0]); // already detailed
            } else {
                console.error("Error in fetching song details", result);
            }
        } catch (error) {
            console.error("Error playing song:", error);
        } finally {
            setSongDetailsLoading(null);
        }
    };

    // Load more → normalize again
    const handleLoadMore = async () => {
        if (loadMoreLoading || !search) return;
        
        setLoadMoreLoading(true);
        try {
            const response = await SearchSongsAction(search, page + 1, 20);
            if (response?.success && response.data?.results?.length > 0) {
                const newNormalized = response.data.results.map(toDetailedSong).filter(Boolean);
                setSongs((prev) => [...prev, ...newNormalized]);
                setPage((prev) => prev + 1);
                setTotalResults(response.data.total || 0);
            }
        } catch (error) {
            console.error("Error searching songs:", error);
        } finally {
            setLoadMoreLoading(false);
        }
    };

    if (!songs || songs.length === 0) {
        return null;
    }

    return (
        <div className="w-full flex flex-col space-y-2">
            {songs.map((song, index) => {
                const display = getSongDisplay(song);
                const isActive = currentSong?.id === song.id;
                const isLoading = songDetailsLoading === song.id;

                return (
                    <div
                        key={`${song.id}-${index}`}
                        onClick={() => handleSongClick(song)}
                        role="button"
                        tabIndex={0}
                        className="group flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                        {/* Cover Image & Overlays */}
                        <div className="relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden shadow-sm">
                            <Image
                                src={display.image}
                                fill
                                sizes="(max-width: 640px) 56px, 64px"
                                className="object-cover"
                                alt={decode(display.title)}
                            />

                            {/* Hover Play Overlay */}
                            {!isLoading && !isActive && (
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                                    <Play className="w-6 h-6 fill-white text-white ml-1" />
                                </div>
                            )}

                            {/* Loading Overlay */}
                            {isLoading && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                </div>
                            )}
                            
                            {/* Active Playing Equalizer (when not hovering/loading) */}
                            {isActive && !isLoading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:opacity-0 transition-opacity">
                                    <div className="flex gap-[2px] items-end h-4">
                                        <span className="w-1 h-4 bg-primary animate-[bounce_1s_infinite]"></span>
                                        <span className="w-1 h-2 bg-primary animate-[bounce_1s_infinite_0.2s]"></span>
                                        <span className="w-1 h-3 bg-primary animate-[bounce_1s_infinite_0.4s]"></span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Song Info */}
                        <div className="flex flex-col flex-1 min-w-0 justify-center">
                            <h4 className={`text-base font-semibold truncate ${isActive ? "text-primary" : "text-foreground group-hover:text-primary transition-colors"}`}>
                                {decode(display.title)}
                            </h4>
                            <p className="text-sm text-muted-foreground truncate mt-0.5">
                                {decode(display.artists)} {display.album && `• ${decode(display.album)}`}
                            </p>
                        </div>
                    </div>
                );
            })}

            {/* Load More Button */}
            {songs.length < totalResults && (
                <div className="pt-4 pb-2 flex justify-center">
                    <Button 
                        variant="secondary"
                        onClick={handleLoadMore} 
                        disabled={loadMoreLoading}
                        className="rounded-full px-8"
                    >
                        {loadMoreLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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