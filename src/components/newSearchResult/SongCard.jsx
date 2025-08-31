// import api, { Song } from "@/lib/api";
// import { useSongStore } from "@/store/useSongStore";
import { useContext, useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import api from "@/lib/api";
import { Separator } from "../ui/separator";
import { UserContext } from "@/context";
import { decode } from "he";
import { Label } from "../ui/label";
// import { Button, Image, Pressable, StyleSheet, Text, TouchableHighlight, View } from "react-native";
// import { ThemedText } from "../ThemedText";

// interface SongCardProps {
//     id: string;
//     title: string;
//     image: { quality: string; url: string }[];
//     album: string;
//     url: string;
//     type: string;
//     description: string;
//     primaryArtists: string;
//     singers: string;
//     language: string;
// }

const SongCard = ({ data, search }) => {
    // const setCurrentSong = useSongStore((state) => state.setCurrentSong);
    const [page, setPage] = useState(0);
    const [totalResults, setTotalResults] = useState(0);
    const [songs, setSongs] = useState([]);
    const [loadMorelLoading, setLoadMoreLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const { playSongAndCreateQueue } = useContext(UserContext);
    const limit = 20;

    useEffect(() => {
        setPage(0);
        setSongs([]);
        setTotalResults(0);
    }, [search])

    const handleSongClick = async (song) => {
        if (loading) return;
        try {
            if ("downloadUrl" in song) {
                playSongAndCreateQueue(song);
                return;
            }
            setLoading(true);

            const res = await fetch(`https://saavn.dev/api/songs/${song.id}`);
            const data = await res.json();
            if (data.success) {
                playSongAndCreateQueue(data.data[0])
            } else {
                console.log("Error in fetching")
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    const handleLoadMore = () => {
        if (loadMorelLoading) return;
        setPage(prevPage => prevPage + 1);
        const searchSongs = async () => {
            if (!search) return;

            try {
                setLoadMoreLoading(true);
                const response = await api.searchSongs(search, page, limit);

                if (response.success) {
                    setSongs(response.data.results);
                    setTotalResults(response.data.total || 0);
                }
            } catch (error) {
                console.error('Error searching songs:', error);
            } finally {
                setLoadMoreLoading(false);
            }
        };
        const timeout = setTimeout(searchSongs, 500);
        return () => clearTimeout(timeout);
    };

    return (
        <div style={styles.container}>
            {/* <p>{page}</p> */}
            <Label className="text-xl font-bold text-sky-900 dark:text-sky-300 mb-4">Songs</Label>
            {songs.length == 0 && data.map((song) => (
                <div key={song.id}>
                    <div
                        className="sm:hover:scale-[99%] sm:hover:opacity-90 sm:hover:shadow-md transition duration-300 ease-in-out cursor-pointer"
                        style={styles.card}
                        onClick={() => handleSongClick(song)}
                    >
                        <div>
                            <Image
                                src={song.image?.[1]?.url || song.image?.[0]?.url}
                                style={styles.cover}
                                height={100}
                                width={100}
                                alt="Song cover"
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ color: "white", fontSize: 16 }} ellipsizeMode="tail">{decode(song.title)}</p>
                            <p style={styles.subtitle} ellipsizeMode="tail">{decode(song.primaryArtists)}</p>
                            <p style={styles.subtitle} ellipsizeMode="tail">{decode(song.album) || decode(song.description)}</p>
                        </div>
                    </div>
                    <Separator />
                </div>
            ))}
            {
                songs.length > 0 && songs.map((song, index) => (
                    <div key={song.id}
                        className="sm:hover:scale-[99%] sm:hover:opacity-90 sm:hover:shadow-md transition duration-300 ease-in-out cursor-pointer"
                    >
                        <div

                            style={styles.card}
                            onClick={() => handleSongClick(song)}
                        >
                            <div style={styles.card}>
                                <div>
                                    <Image
                                        src={song.image?.[2]?.url || song.image?.[0]?.url}
                                        height={100}
                                        width={100}
                                        style={styles.cover}
                                        alt="Song Cover"
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ color: "white", fontSize: 16 }} ellipsizeMode="tail">{decode(song.name)}</p>
                                    <p style={styles.subtitle} ellipsizeMode="tail">{song.artists.primary.map(artist => artist.name).join(",")}</p>
                                    <p style={styles.subtitle} ellipsizeMode="tail">{decode(song.album.name)}</p>
                                </div>
                            </div>
                        </div>
                        <Separator />
                    </div>
                ))
            }
            <div style={styles.loadbutton}>
                <Button onClick={handleLoadMore} >
                    {loadMorelLoading ? `Loading...` : "Load More"}
                </Button>
            </div>
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
    loadbutton: {
        borderRadius: 10,
        marginTop: 10
    }
}

export default SongCard;
