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

// --- Helper Hook for Debouncing ---
// This hook takes a value and returns a new value that only updates after the specified delay.
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup function to cancel the timeout if the value changes again
        return () => {
            clearTimeout(handler);
        };
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

    // Use the debounced value for API calls and URL updates
    const debouncedSearch = useDebounce(search, 500);

    // Effect 1: Sync the local search state if the URL query parameter changes (e.g., back/forward button)
    useEffect(() => {
        if (queryFromUrl !== search) {
            setSearch(queryFromUrl);
        }
    }, [queryFromUrl]);

    // Effect 2: Fetch data and update URL based on the debounced search term.
    // This effect is the core logic.
    useEffect(() => {
        const fetchAndSetResults = async () => {
            if (!debouncedSearch) {
                // If the search is empty, clear everything and go back to the browse page.
                setResults(null);
                setError("");
                setLoading(false);
                // Ensure router is available before using it
                if (router) {
                    router.replace("/browse", { scroll: false });
                }
                return;
            }

            // Update the URL to match the current debounced search query
            if (router) {
                const url = `/browse?query=${encodeURIComponent(debouncedSearch)}`;
                router.replace(url, { scroll: false });
            }

            setLoading(true);
            setError("");
            setResults(null); // Clear previous results immediately

            try {
                const res = await fetch(
                    `https://saavn.dev/api/search?query=${encodeURIComponent(
                        debouncedSearch
                    )}`
                );

                if (!res.ok) {
                    throw new Error(`API error: ${res.statusText}`);
                }

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

        fetchAndSetResults();
    }, [debouncedSearch, router]); // Dependency array is now much cleaner

    const clearSearch = useCallback(() => {
        setSearch("");
        setResults(null);
        setError("");
        // No need to manually call router.replace here, the useEffect above will handle it
        // when `debouncedSearch` becomes empty.
    }, []);

    return (
        <div style={{ flex: 1, padding: 20 }}>
            {/* Search box */}
            <div className="mt-[10%] mb-10 w-[90%] sm:w-[60%] mx-auto flex items-center relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 z-10" aria-label="Search">
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

            {/* Loading/Error State */}
            {loading && <div className="text-center text-white/80 py-8">Loading...</div>}
            {error && <div className="text-center text-red-400 py-8">{error}</div>}

            {/* Results with animation */}
            <AnimatePresence>
                {!loading && !error && results && (
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