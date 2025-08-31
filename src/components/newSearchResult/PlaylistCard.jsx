// import { Image, StyleSheet, Text, View } from "react-native";
// import { ThemedText } from "../ThemedText";

import Image from "next/image";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";

// interface PlaylistCardProps {
//     id: string;
//     title: string;
//     image: { quality: string; url: string }[];
//     url: string;
//     type: string;
//     description: string;
//     language: string;
// }

const PlaylistCard = ({ data }) => {
    return (
        <div style={styles.container}>
            <Label className="text-xl font-bold text-sky-900 dark:text-sky-300 mb-4">Playlists</Label>
            {data.map((song) => (
                <div key={song.id}>
                    <div style={styles.card}>
                        <div>
                            <Image
                                src={song.image?.[2]?.url || song.image?.[0]?.url}
                                style={styles.cover}
                                height={100}
                                width={100}
                                alt="Playlist Cover"
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

export default PlaylistCard;
