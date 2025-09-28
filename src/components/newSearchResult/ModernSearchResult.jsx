"use client"

import { useSearchStore } from "@/store/useSearchStore";
import TopQueryCard from "./TopQueryCard";
import SongCard from "./SongCard";
import AlbumCard from "./AlbumCard";
import ArtistCard from "./ArtistCard";
import PlaylistCard from "./PlaylistCard";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";


const ModernSearchResult = () => {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (search === "") return
        const timeout = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://saavn.dev/api/search?query=${search}`
                );
                const data = await res.json();
                setResults(data);
                console.log("response", data);
            } catch (err) {
                console.log("Error fetching:", err);
            }
        }, 500);

        return () => clearTimeout(timeout); // cleanup old timer
    }, [search]);

    return (
        <div style={{ flex: 1, padding: 20 }}>
            <div className='mt-[10%] mb-10 w-[50%] mx-auto flex items-center relative'>
                <div
                    className="absolute inset-y-0 left-0 flex items-center pl-4 cursor-pointer z-10"
                    aria-label="Search"
                >
                    <Search className="text-white dark:text-white hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200" />
                </div>
                <Input onInput={(e) => setSearch(e.target.value)} className="pl-12 h-20 py-4 text-xl" placeholder="Search for songs, artists or albums..." />
            </div>
            <div
                style={{ flex: 1, marginTop: 20 }}
            >
                {results?.data?.topQuery?.results?.[0] && (
                    <TopQueryCard data={results.data.topQuery.results[0]} />
                )}

                {results?.data?.songs?.results?.[0] && (
                    <SongCard data={results.data.songs.results} search={search} />
                )}

                {results?.data?.albums?.results?.[0] && (
                    <AlbumCard data={results.data.albums.results} />
                )}

                {results?.data?.artists?.results?.[0] && (
                    <ArtistCard data={results.data.artists.results} />
                )}

                {results?.data?.playlists?.results?.[0] && (
                    <PlaylistCard data={results.data.playlists.results} />
                )}


            </div>

        </div>
    );
};

export default ModernSearchResult
