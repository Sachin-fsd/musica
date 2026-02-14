// import { Image, StyleSheet, Text, View } from "react-native";
// import { ThemedText } from "../ThemedText";

import Image from "next/image";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import api from "@/lib/api";
import { useContext, useState } from "react";
import { UserContext } from "@/context";


// interface ArtistCardProps {
//     id: string;
//     title: string;
//     image: { quality: string; url: string }[];
//     type: string;
//     description: string;
// }

const ArtistCard = ({ data }) => {

    const [loading, setLoading] = useState(false);
    const { setSongList, setCurrentSong, setPlaying } = useContext(UserContext);

    async function handleClick(artist) {
        if (!artist?.id || loading) return;
        try {
            setLoading(true);
            const response = await api.searchArtistSongs(artist.id);
            console.log("artist response", response)
            if (response.success && response.data.songs.length > 1) {
                setSongList(response.data.songs);
                setCurrentSong(response.data.songs[0]);
                setPlaying(true);
            } else {
                console.log("Error fetching artist in artist card", response)
            }
        } catch (error) {
            console.log("Error in artist card click", error);
        }
    }

    return (
        <div style={styles.container}>
            <Label className="text-xl font-bold text-sky-900 dark:text-sky-300 mb-4">Artists</Label>
            {data.map((song) => (
                <div key={song.id}
                    className="sm:hover:scale-[99%] sm:hover:opacity-90 sm:hover:shadow-md transition duration-300 ease-in-out cursor-pointer"
                    onClick={() => handleClick(song)}
                >
                    <div style={styles.card}>
                        <div>
                            <Image
                                src={
                                    song.image?.[1]?.url?.startsWith("https://www.jiosaavn.com/_i/3.0/artist-default")
                                        ?
                                        "/fallback/artist-music.png"
                                        : song.image?.[2]?.url || song.image?.[0]?.url
                                }
                                style={styles.cover}
                                height={100}
                                width={100}
                                alt="Artist Cover"
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ color: "white", fontSize: 16 }} ellipsizeMode="tail">{song.title}</p>
                            <p style={styles.subtitle} ellipsizeMode="tail">{song.type}</p>
                            <p style={styles.subtitle} ellipsizeMode="tail">{song.description}</p>
                        </div>
                    </div>
                    <Separator />
                </div>
            ))}
        </div>
    );
};

const styles = {
    container: {
        marginTop: 20
    },
    cover: {
        flex: 1,
        width: 100,
        height: 100,
        borderRadius: 10,
        margin: 10
    },
    card: {
        display: "flex",
        flexDirection: "row",
        marginBottom: 10,
        alignItems: "center"
    },
    subtitle: {
        color: "grey",
        fontSize: 14,
        width: "auto",
    },
}

export default ArtistCard;
