"use client"

import { UserContext } from "@/context";
import api from "@/lib/api";
import { decode } from "he";
import Image from "next/image";
import { useContext, useState } from "react";

// export interface SongCardProps { 
// id: string; 
// title: string; 
// image: { quality: string; url: string }[];
// album: string; 
// url: string;  
// type: string; 
// description: string;
// primaryArtists: string;
// singers: string;
// language: string; 
// }

const TopQueryCard = ({ data }) => {
    const { playSongAndCreateQueue, setSongList, setCurrentSong, setPlaying } =
        useContext(UserContext);
    const [loading, setLoading] = useState(false);

    async function handleClick() {
        if (!data.id || loading) return;
        try {
            setLoading(true);
            const response = await api.searchById(data.type, data.id);
            if (response.success) {
                if (data.type === "song") {
                    playSongAndCreateQueue(response.data[0]);
                } else if (data.type === "album") {
                    setSongList(response.data.songs);
                    setCurrentSong(response.data.songs[0]);
                    setPlaying(true);
                }
            } else {
                console.log("Error fetching top query", response);
            }
        } catch (error) {
            console.log("Error in top query card click", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            style={styles.container}
            onClick={handleClick}
            className="sm:hover:scale-[99%] sm:hover:opacity-90 sm:hover:shadow-md transition duration-300 ease-in-out cursor-pointer"
        >
            <div className="relative justify-items-center">
                <Image
                    src={data.image?.[1]?.url || data.image?.[0]?.url}
                    width={150}
                    height={150}
                    style={styles.cover}
                    alt="album cover"
                />

                {/* Overlay when loading */}
                {loading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                        <div className="flex gap-1">
                            <span className="w-2 h-6 bg-green-400 animate-bounce"></span>
                            <span className="w-2 h-6 bg-green-400 animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-2 h-6 bg-green-400 animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                    </div>
                )}
            </div>

            <p style={styles.title}>{decode(data.title)}</p>
            <p style={styles.subtitle}>{decode(data.primaryArtists)}</p>
            <p style={styles.subtitle}>{decode(data.album) || decode(data.description)}</p>
            <p style={styles.subtitle}>{decode(data.type)}</p>
        </div>
    );
};

const styles = {
    container: {
        padding: 10,
        margin: 10,
        alignItems: "center",
        textAlign: "center",
        justifyContent: "center",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "grey",
        cursor: "pointer",
    },
    cover: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
    title: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
        textAlign: "center",
    },
    subtitle: {
        color: "grey",
        fontSize: 14,
        width: "auto",
        textAlign: "center",
    },
};

export default TopQueryCard;
