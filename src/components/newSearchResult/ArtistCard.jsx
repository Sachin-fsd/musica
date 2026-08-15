"use client";

import Image from "next/image";
import { useContext, useState } from "react";
import { UserContext } from "@/context";
import { toast } from "sonner";
import { fetchArtistSongsAction } from "@/app/actions";
import { Play, Loader2 } from "lucide-react";
import { decode } from "he";
import { useQueryClient } from "@tanstack/react-query";

const ArtistCard = ({ data = [] }) => {
    const [loadingId, setLoadingId] = useState(null);

    const { setSongList, setCurrentSong, setPlaying } = useContext(UserContext);
    const queryClient = useQueryClient();

    if (!data.length) return null;

    const handleClick = async (artist) => {
        if (!artist?.id || loadingId === artist.id) return;

        try {
            setLoadingId(artist.id);

            const songs = await queryClient.fetchQuery({
                queryKey: ["artist-songs", artist.id],
                queryFn: async () => {
                    const response = await fetchArtistSongsAction(artist.id);

                    if (!response?.success) {
                        throw new Error(response?.message || "Failed to fetch artist songs");
                    }

                    return response.data?.songs || [];
                },
                staleTime: 10 * 60 * 1000,
                gcTime: 60 * 60 * 1000,
            });

            if (!songs.length) {
                toast("🥲 No Songs to play");
                return;
            }

            setSongList(songs);
            setCurrentSong(songs[0]);
            setPlaying(true);
        } catch (error) {
            console.error("Error fetching artist songs:", error);
            toast("Failed to load artist songs.");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5">
                {data.map((artist) => {
                    const isLoading = loadingId === artist.id;
                    const subtitle = artist.type || artist.description || "Artist";

                    const imageUrl = artist.image?.[2]?.url || artist.image?.[1]?.url || artist.image?.[0]?.url || "/fallback/artist-music.png";

                    return (
                        <button
                            key={artist.id}
                            type="button"
                            onClick={() => handleClick(artist)}
                            disabled={isLoading}
                            className="group -m-3 flex cursor-pointer flex-col items-center gap-3 rounded-xl p-3 transition-colors duration-300 ease-out hover:bg-secondary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-wait"
                        >
                            <div className="relative aspect-square w-full max-w-[160px] overflow-hidden rounded-full shadow-md">
                                <Image
                                    src={imageUrl}
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    alt={decode(artist.title || "Artist Cover")}
                                />

                                {!isLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                        <div className="rounded-full bg-primary p-3 text-primary-foreground shadow-lg transition-transform duration-300 ease-out group-hover:scale-100">
                                            <Play className="ml-1 h-6 w-6 fill-current" />
                                        </div>
                                    </div>
                                )}

                                {isLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                )}
                            </div>

                            <div className="flex w-full min-w-0 flex-col items-center px-1 text-center">
                                <h4 className="w-full truncate text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                                    {decode(artist.title || "Unknown Artist")}
                                </h4>

                                <p className="mt-0.5 w-full truncate text-sm capitalize text-muted-foreground">
                                    {decode(subtitle)}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ArtistCard;