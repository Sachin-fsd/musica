"use client";

import Image from "next/image";
import { decode } from "he";
import { useContext, useState } from "react";
import { UserContext } from "@/context";
import { GetSongsByIdAction } from "@/app/actions";
import { Play, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const AlbumCard = ({ data = [] }) => {
    const [loadingId, setLoadingId] = useState(null);

    const { setSongList, setCurrentSong, setPlaying } = useContext(UserContext);
    const queryClient = useQueryClient();

    if (!data.length) return null;

    const handleClick = async (album) => {
        if (!album?.id || loadingId === album.id) return;

        try {
            setLoadingId(album.id);

            const songs = await queryClient.fetchQuery({
                queryKey: ["album-songs", album.type || "album", album.id],
                queryFn: async () => {
                    const response = await GetSongsByIdAction(album.type || "album", album.id);

                    if (!response?.success) {
                        throw new Error(response?.message || "Failed to fetch album songs");
                    }

                    return response.data?.songs || [];
                },
                staleTime: 10 * 60 * 1000,
                gcTime: 60 * 60 * 1000,
            });

            if (!songs.length) {
                console.error("No songs found for album:", album.id);
                return;
            }

            setSongList(songs);
            setCurrentSong(songs[0]);
            setPlaying(true);
        } catch (error) {
            console.error("Error fetching album songs:", error);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5">
                {data.map((album) => {
                    const imageUrl = album.image?.[2]?.url || album.image?.[1]?.url || album.image?.[0]?.url || "/placeholder-image.jpg";
                    const isLoading = loadingId === album.id;
                    const subtitle = album.artist || album.description || "";

                    return (
                        <button
                            key={album.id}
                            type="button"
                            onClick={() => handleClick(album)}
                            disabled={isLoading}
                            className="group -m-3 flex cursor-pointer flex-col gap-3 rounded-xl p-3 text-left transition-colors duration-300 ease-out hover:bg-secondary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-wait"
                        >
                            <div className="relative aspect-square w-full overflow-hidden rounded-xl shadow-md">
                                <Image
                                    src={imageUrl}
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    alt={decode(album.title || "Album Cover")}
                                />

                                {!isLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                        <div className="rounded-full bg-primary p-3 text-primary-foreground shadow-lg transition-transform duration-300 ease-out group-hover:translate-y-0">
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

                            <div className="flex min-w-0 flex-col">
                                <h4 className="w-full truncate text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                                    {decode(album.title || "")}
                                </h4>

                                {subtitle && (
                                    <p className="mt-0.5 w-full truncate text-sm text-muted-foreground">
                                        {decode(subtitle)}
                                    </p>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default AlbumCard;