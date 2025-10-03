import { useContext, useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import api from "@/lib/api";
import { Separator } from "../ui/separator";
import { UserContext } from "@/context";
import { decode } from "he";
import { Label } from "../ui/label";

// 🔥 Universal normalizer → always detailed schema
const toDetailedSong = (song) => {
    if (!song) return null;

    // Already looks detailed (artists.primary exists), merge with slim props if needed
    const isDetailed = !!song.artists?.primary;

    return {
        id: song.id || "",
        name: song.name || song.title || "",              // prefer detailed.name
        title: song.title || song.name || "",             // keep slim.title if exists
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
            const normalized = data.map(toDetailedSong);
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
            const res = await fetch(`https://saavn.dev/api/songs/${song.id}`);
            const result = await res.json();
            if (result.success && result.data.length > 0) {
                playSongAndCreateQueue(result.data[0]); // already detailed
            } else {
                console.log("Error in fetching song details");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setSongDetailsLoading(null);
        }
    };

    // Load more → normalize again
    const handleLoadMore = async () => {
        if (loadMoreLoading || !search) return;
        setLoadMoreLoading(true);
        try {
            const response = await api.searchSongs(search, page + 1, 20);
            if (response.success && response.data.results.length > 0) {
                const newNormalized = response.data.results.map(toDetailedSong);
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
        <div style={styles.container}>
            <Label className="text-xl font-bold text-sky-900 dark:text-sky-300 mb-4">
                Songs
            </Label>

            {songs.map((song, index) => {
                const display = getSongDisplay(song);
                return (
                    <div
                        key={`${song.id}-${index}`}
                    >
                        <div
                            className="sm:hover:scale-[99%] sm:hover:opacity-90 sm:hover:shadow-md transition duration-300 ease-in-out cursor-pointer"
                            style={styles.card}
                            onClick={() => handleSongClick(song)}
                        >
                            <div>
                                <Image
                                    src={display.image}
                                    style={styles.cover}
                                    height={100}
                                    width={100}
                                    alt="Song cover"
                                />
                            </div>
                            <div style={{ flex: 1, marginLeft: 10 }}>
                                <p className={`${currentSong.id === song.id ? "font-bold text-green-600" : "text-white"}`} style={{ fontSize: 16 }}>
                                    {songDetailsLoading === song.id
                                        ? "Loading..."
                                        : decode(display.title)}
                                </p>
                                <p style={styles.subtitle}>{decode(display.artists)}</p>
                                <p style={styles.subtitle}>{decode(display.album)}</p>
                            </div>
                        </div>
                        <Separator />
                    </div>
                );
            })}

            {songs.length < totalResults && (
                <div style={styles.loadbutton}>
                    <Button onClick={handleLoadMore} disabled={loadMoreLoading}>
                        {loadMoreLoading ? `Loading...` : "Load More"}
                    </Button>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { marginTop: 20 },
    cover: { flex: 1, width: 100, height: 100, borderRadius: 10, margin: 10 },
    card: { display: "flex", flexDirection: "row", marginBottom: 10, alignItems: "center" },
    subtitle: { color: "grey", fontSize: 14, width: "auto" },
    loadbutton: { borderRadius: 10, marginTop: 10 },
};

export default SongCard;