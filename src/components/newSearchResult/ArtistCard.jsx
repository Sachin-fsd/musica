"use client";

import Image from "next/image";
import { useContext, useState } from "react";
import { UserContext } from "@/context";
import { toast } from "sonner";
import { fetchArtistSongsAction } from "@/app/actions";
import { Play, Loader2 } from "lucide-react";
import { decode } from "he";

const ArtistCard = ({ data }) => {
    const [loadingId, setLoadingId] = useState(null);
    const { setSongList, setCurrentSong, setPlaying } = useContext(UserContext);

    if (!data || data.length === 0) return null;

    async function handleClick(artist) {
        if (!artist?.id || loadingId === artist.id) return;
        
        try {
            setLoadingId(artist.id);
            const response = await fetchArtistSongsAction(artist.id);
            
            if (response?.success && response.data?.songs?.length >= 1) {
                setSongList(response.data.songs);
                setCurrentSong(response.data.songs[0]);
                setPlaying(true);
            } else {
                toast("🥲 No Songs to play");
                console.error("Error fetching artist in artist card", response);
            }
        } catch (error) {
            console.error("Error in artist card click", error);
            toast("Failed to load artist songs.");
        } finally {
            setLoadingId(null);
        }
    }

    return (
        <div className="w-full">
            {/* Grid Layout for Artists */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 pt-2">
                {data.map((artist) => {
                    const isLoading = loadingId === artist.id;
                    const subtitle = artist.type || artist.description || "Artist";
                    
                    // Determine image URL with JioSaavn fallback logic
                    let imageUrl = artist.image?.[2]?.url || artist.image?.[1]?.url || artist.image?.[0]?.url;
                    if (!imageUrl || imageUrl.includes("artist-default")) {
                        imageUrl = "/fallback/artist-music.png";
                    }

                    return (
                        <div
                            key={artist.id}
                            onClick={() => handleClick(artist)}
                            role="button"
                            tabIndex={0}
                            className="group flex flex-col items-center gap-3 p-3 -m-3 rounded-xl hover:bg-secondary/40 transition-colors duration-300 ease-out cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            {/* Circular Image & Overlays */}
                            <div className="relative aspect-square w-full max-w-[160px] rounded-full overflow-hidden shadow-md">
                                <Image
                                    src={imageUrl}
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    alt={decode(artist.title || "Artist Cover")}
                                />

                                {/* Hover Play Overlay */}
                                {!isLoading && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out">
                                            <Play className="w-6 h-6 fill-current ml-1" />
                                        </div>
                                    </div>
                                )}

                                {/* Loading Overlay */}
                                {isLoading && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                    </div>
                                )}
                            </div>

                            {/* Artist Info (Centered) */}
                            <div className="flex flex-col items-center text-center min-w-0 w-full px-1">
                                <h4 className="text-base font-semibold truncate w-full text-foreground group-hover:text-primary transition-colors">
                                    {decode(artist.title || "Unknown Artist")}
                                </h4>
                                <p className="text-sm text-muted-foreground truncate w-full mt-0.5 capitalize">
                                    {decode(subtitle)}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ArtistCard;