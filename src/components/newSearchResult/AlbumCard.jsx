// import { utilsStyles } from "@/styles";
// import { FlatList, Image, StyleSheet, Text, View } from "react-native";
// import { ThemedText } from "../ThemedText";

import Image from "next/image";
import { Separator } from "../ui/separator";
import { decode } from "he";
import { useContext, useState } from "react";
import { UserContext } from "@/context";
import api from "@/lib/api";
import { Label } from "../ui/label";


// interface AlbumCardProps {
//     id: string;
//     title: string;
//     image: { quality: string; url: string }[];
//     artist: string;
//     url: string;
//     type: string;
//     description: string;
//     year: string;
//     songIds: string;
//     language: string;
// }

// const ItemDivider = () => (
//     <div style={{ ...utilsStyles.itemSeparator, marginVertical: 9, marginLeft: 60 }} />
// )

const AlbumCard = ({ data }) => {
    const [loading, setLoading] = useState(false);
    const { setSongList, setCurrentSong, setPlaying } = useContext(UserContext);

    async function handleClick(album) {
        if (loading || !album.id) return;
        try {
            setLoading(true);
            const response = await api.searchById(album.type, album.id);
            if (response.success) {
                setSongList(response.data.songs);
                setCurrentSong(response.data.songs[0]);
                setPlaying(true);
            } else {
                console.log("Error fetching album in album card", response)
            }
        } catch (error) {
            console.log("Error in albums card click", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={styles.container}>
            <Label className="text-xl font-bold text-sky-900 dark:text-sky-300 mb-4">Albums</Label>
            {
                data.length && data.map((song, index) => (
                    <div key={song.id}
                        onClick={() => handleClick(song)}
                        className="sm:hover:scale-[99%] sm:hover:opacity-90 sm:hover:shadow-md transition duration-300 ease-in-out cursor-pointer"
                    >
                        <div style={styles.card}>
                            <div>
                                <Image
                                    src={song.image?.[2]?.url || song.image?.[0]?.url}
                                    style={styles.cover}
                                    width={100}
                                    height={100}
                                    alt="Album Cover"
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ color: "white", fontSize: 16 }} ellipsizeMode="tail">{decode(song.title)}</p>
                                <p style={styles.subtitle} ellipsizeMode="tail">{decode(song.artist)}</p>
                                <p style={styles.subtitle} ellipsizeMode="tail">{decode(song.description)}</p>
                            </div>
                        </div>
                        <Separator />
                    </div>
                ))
            }
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

export default AlbumCard;
