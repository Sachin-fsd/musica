"use client";

import TopQueryCard from "./TopQueryCard";
import SongCard from "./SongCard";
import AlbumCard from "./AlbumCard";
import ArtistCard from "./ArtistCard";
import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "../ui/skeleton";

// Debounce hook
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

const ModernSearchResult = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const queryFromUrl = searchParams?.get("query") || "";

    const [search, setSearch] = useState(queryFromUrl);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [navigationUpdate, setNavigationUpdate] = useState(false); // ✅ flag

    const debouncedSearch = useDebounce(search, 500);

    // ✅ When queryFromUrl changes due to navigation (back/forward)
    useEffect(() => {
        if (navigationUpdate) {
            setSearch(queryFromUrl);
            setNavigationUpdate(false); // reset flag
        }
    }, [queryFromUrl, navigationUpdate]);

    // Fetch results when debounced search changes
    useEffect(() => {
        if (!router) return;

        const executeSearch = async () => {
            if (!debouncedSearch) {
                setResults(null);
                setError("");
                setLoading(false);

                if (window.location.pathname !== "/browse" || window.location.search) {
                    setNavigationUpdate(false); // this is our push, not back/forward
                    router.push("/browse", { scroll: false });
                }
                return;
            }

            const url = `/browse?query=${encodeURIComponent(debouncedSearch)}`;
            setNavigationUpdate(false); // ✅ mark as push event
            router.push(url, { scroll: false });

            setLoading(true);
            setError("");
            setResults(null);

            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_FETCH_URL}/search?query=${encodeURIComponent(debouncedSearch)}`
                );
                if (!res.ok) throw new Error(`API error: ${res.statusText}`);

                const data = await res.json();
                if (data.success) {
                    setResults(data);
                } else {
                    throw new Error("API returned unsuccessful response.");
                }
            } catch (err) {
                console.error("Search fetch error:", err);
                setError("Failed to fetch results. Please try again.");
                setResults(null);
            } finally {
                setLoading(false);
            }
        };

        executeSearch();
    }, [debouncedSearch, router]);

    // ✅ Detect browser navigation (back/forward)
    useEffect(() => {
        const handler = () => setNavigationUpdate(true);
        window.addEventListener("popstate", handler);
        return () => window.removeEventListener("popstate", handler);
    }, []);

    const clearSearch = useCallback(() => {
        setSearch("");
        setNavigationUpdate(false); // it’s our action, not back nav
        router.push("/browse", { scroll: false });
    }, [router]);

    return (
        <div style={{ flex: 1, padding: 20 }}>
            {/* Search Bar */}
            <div className="mt-[8%] w-[90%] sm:w-[80%] mx-auto flex items-center relative">
                <div
                    className="absolute inset-y-0 left-0 flex items-center pl-4 z-10"
                    aria-label="Search"
                >
                    <Search className="text-white" />
                </div>

                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 pr-12 h-20 py-4 text-xl"
                    placeholder="Search for songs, artists or albums..."
                    autoComplete="off"
                />

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

            {/* Loading / Error */}
            {loading && <div className="text-center text-white/80 py-8">
                <div className="space-y-2">
                    <Skeleton className="h-16 rounded-lg" />
                    <Skeleton className="h-16 rounded-lg" />
                    <Skeleton className="h-16 rounded-lg" />
                </div>
            </div>}
            {error && <div className="text-center text-red-400 py-8">{error}</div>}

            {/* Results */}
            <AnimatePresence>
                {!loading && !error && results && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        style={{ flex: 1, marginTop: 20 }}
                    >
                        {results?.data?.topQuery?.results?.[0] && (
                            <TopQueryCard data={results.data.topQuery.results[0]} />
                        )}
                        {results?.data?.songs?.results?.length > 0 && (
                            <SongCard data={results.data.songs.results} search={search} />
                        )}
                        {results?.data?.albums?.results?.length > 0 && (
                            <AlbumCard data={results.data.albums.results} />
                        )}
                        {results?.data?.artists?.results?.length > 0 && (
                            <ArtistCard data={results.data.artists.results} />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ModernSearchResult;