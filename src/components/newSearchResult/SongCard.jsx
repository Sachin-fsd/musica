import { useContext, useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import api from "@/lib/api";
import { Separator } from "../ui/separator";
import { UserContext } from "@/context";
import { decode } from "he";
import { Label } from "../ui/label";

// --- FIX 1: The Normalizer Function ---
// This function takes a song in ANY format and returns a consistent object.
const normalizeSong = (song) => {
    // Check if the song is from the "Load More" API (Structure 2)
    const isDetailedStructure = !!song.artists?.primary;

    if (isDetailedStructure) {
        return {
            id: song.id,
            title: song.name || "",
            image: song.image || [],
            album: song.album?.name || "",
            artists: song.artists?.primary?.map(artist => artist.name).join(", ") || "",
            downloadUrl: song.downloadUrl, // Keep downloadUrl if it exists
        };
    } else {
        // Otherwise, it's from the initial search (Structure 1)
        return {
            id: song.id,
            title: song.title || "",
            image: song.image || [],
            album: song.album || "", // album is already a string
            artists: song.primaryArtists || "", // artists are in primaryArtists
            downloadUrl: song.downloadUrl,
        };
    }
};


const SongCard = ({ data, search }) => {
    const [page, setPage] = useState(1); // Start with page 1 for "Load More"
    const [songs, setSongs] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [loadMoreLoading, setLoadMoreLoading] = useState(false);
    const [songDetailsLoading, setSongDetailsLoading] = useState(null); // Track loading for a specific song
    const { playSongAndCreateQueue } = useContext(UserContext);

    // --- FIX 2: Initialize and update state from props ---
    // This effect runs when the initial `data` prop changes.
    useEffect(() => {
        if (data && data.length > 0) {
            const normalizedInitialSongs = data.map(normalizeSong);
            setSongs(normalizedInitialSongs);
        } else {
            setSongs([]);
        }
        // Reset page for new searches
        setPage(1);
    }, [data]); // Depend only on the initial data prop

    const handleSongClick = async (song) => {
        if (songDetailsLoading === song.id) return;
        try {
            // If the song object already has the download URL, just play it.
            if (song.downloadUrl && song.downloadUrl.length > 0) {
                playSongAndCreateQueue(song);
                return;
            }

            setSongDetailsLoading(song.id);
            const res = await fetch(`https://saavn.dev/api/songs/${song.id}`);
            const result = await res.json();
            
            if (result.success && result.data.length > 0) {
                playSongAndCreateQueue(result.data[0]);
            } else {
                console.log("Error in fetching song details");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setSongDetailsLoading(null);
        }
    };

    // --- FIX 3: Correct "Load More" Logic ---
    const handleLoadMore = async () => {
        if (loadMoreLoading || !search) return;

        setLoadMoreLoading(true);
        try {
            // Use the current page state, then increment it for the next click
            const response = await api.searchSongs(search, page + 1, 20);

            if (response.success && response.data.results.length > 0) {
                const newNormalizedSongs = response.data.results.map(normalizeSong);
                // Append new songs to the existing list
                setSongs(prevSongs => [...prevSongs, ...newNormalizedSongs]);
                setPage(prevPage => prevPage + 1);
                setTotalResults(response.data.total || 0);
            }
        } catch (error) {
            console.error('Error searching songs:', error);
        } finally {
            setLoadMoreLoading(false);
        }
    };

    if (!songs || songs.length === 0) {
        return null; // Don't render anything if there are no songs
    }

    return (
        <div style={styles.container}>
            <Label className="text-xl font-bold text-sky-900 dark:text-sky-300 mb-4">Songs</Label>

            {/* --- FIX 4: A Single, Unified Render Block --- */}
            {songs.map((song) => (
                <div key={song.id}>
                    <div
                        className="sm:hover:scale-[99%] sm:hover:opacity-90 sm:hover:shadow-md transition duration-300 ease-in-out cursor-pointer"
                        style={styles.card}
                        onClick={() => handleSongClick(song)}
                    >
                        <div>
                            <Image
                                src={song.image?.[1]?.url || song.image?.[0]?.url || '/placeholder.png'} // Added placeholder
                                style={styles.cover}
                                height={100}
                                width={100}
                                alt="Song cover"
                            />
                        </div>
                        <div style={{ flex: 1, marginLeft: 10 }}>
                            <p style={{ color: "white", fontSize: 16 }} ellipsizeMode="tail">
                                {songDetailsLoading === song.id ? "Loading..." : decode(song.title)}
                            </p>
                            <p style={styles.subtitle} ellipsizeMode="tail">{decode(song.artists)}</p>
                            <p style={styles.subtitle} ellipsizeMode="tail">{decode(song.album)}</p>
                        </div>
                    </div>
                    <Separator />
                </div>
            ))}

            {/* Show load more button if there are more results */}
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


// (Your styles object remains the same)
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