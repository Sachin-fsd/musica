"use client";

import TopQueryCard from "./TopQueryCard";
import SongCard from "./SongCard";
import AlbumCard from "./AlbumCard";
import ArtistCard from "./ArtistCard";
import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const ModernSearchResult = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const queryFromUrl = searchParams?.get("query") || "";
    const [search, setSearch] = useState(queryFromUrl);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // sync search input with URL param
    useEffect(() => {
        setSearch(queryFromUrl);
        if (!queryFromUrl) {
            setResults(null);
        }
    }, [queryFromUrl]);

    // fetch when search changes
    useEffect(() => {
        if (search === "") {
            if (router && typeof router.replace === "function") {
                router.replace("/browse", { scroll: false });
            }
            setResults(null);
            setError("");
            return;
        }

        setLoading(true);
        setError("");
        const url = `?query=${encodeURIComponent(search)}`;
        if (router && typeof router.replace === "function") {
            router.replace(url, { scroll: false });
        }

        const timeout = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://saavn.dev/api/search?query=${encodeURIComponent(search)}`
                );
                if (!res.ok) throw new Error("API error");
                const data = await res.json();
                setResults(data);
            } catch (err) {
                setError("Failed to fetch results.");
                setResults(null);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [search, router]);

    const clearSearch = () => {
        setSearch("");
        setResults(null);
        setError("");
        if (router && typeof router.replace === "function") {
            router.replace("/browse", { scroll: false });
        }
    };

    return (
        <div style={{ flex: 1, padding: 20 }}>
            {/* Search box */}
            <div className="mt-[10%] mb-10 w-[90%] sm:w-[60%] mx-auto flex items-center relative">
                {/* search icon */}
                <div
                    className="absolute inset-y-0 left-0 flex items-center pl-4 z-10"
                    aria-label="Search"
                >
                    <Search className="text-white" />
                </div>

                {/* input */}
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 pr-12 h-20 py-4 text-xl"
                    placeholder="Search for songs, artists or albums..."
                    autoComplete="off"
                />

                {/* clear button */}
                {search && (
                    <button
                        onClick={clearSearch}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-white transition-colors"
                        aria-label="Clear search"
                    >
                        <X size={22} />
                    </button>
                )}
            </div>

            {/* Loading/Error */}
            {loading && (
                <div className="text-center text-white/80 py-8">Loading...</div>
            )}
            {error && (
                <div className="text-center text-red-400 py-8">{error}</div>
            )}

            {/* Results with fade in/out */}
            <AnimatePresence>
                {results && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ flex: 1, marginTop: 20 }}
                    >
                        {results?.data?.topQuery?.results?.[0] && (
                            <TopQueryCard data={results.data.topQuery.results[0]} />
                        )}
                        {Array.isArray(results?.data?.songs?.results) && results.data.songs.results.length > 0 && (
                            <SongCard data={results.data.songs.results} search={search} />
                        )}
                        {Array.isArray(results?.data?.albums?.results) && results.data.albums.results.length > 0 && (
                            <AlbumCard data={results.data.albums.results} />
                        )}
                        {Array.isArray(results?.data?.artists?.results) && results.data.artists.results.length > 0 && (
                            <ArtistCard data={results.data.artists.results} />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ModernSearchResult;