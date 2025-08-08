'use client';

import { SearchGlobalAction, SearchSongsAction } from "@/app/actions";
import SongBar from "@/components/songBar";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { UserContext } from "@/context";
import { debounce } from "lodash";
import { Plus } from "lucide-react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import TopSearchResult from "./topSearchResult";
import { Separator } from "@/components/ui/separator";
import { useSearchStore } from "@/store/useSearchStore";

const SearchResults = () => {
    const { searchQuery, setIsLoading, setSearchQuery, isLoading } = useSearchStore();
    const [searchResults, setSearchResults] = useState([]);
    const [topQuery, setTopQuery] = useState({});
    const [removeSearch, setRemoveSearch] = useState(false);
    const searchResultsRef = useRef(null);
    const prevQuery = useRef("");

    // ✅ Clean debounce without useCallback complexity
    const handleSearch = debounce(async (query) => {
        if (!query.trim()) return;

        setIsLoading(true);
        try {
            // Get top result
            const topResult = await SearchGlobalAction(query);
            if (topResult) setTopQuery(topResult?.data?.topQuery);

            // Get song results
            let songResults = await SearchSongsAction(query);

            // Fallback if no results
            if (songResults?.success && songResults?.data?.results?.length === 0) {
                const words = query.split(" ");
                const fallbackQuery1 = words[0] || "";
                const fallbackQuery2 = words[1] || "";

                const [results1, results2] = await Promise.all([
                    fallbackQuery1 ? SearchSongsAction(fallbackQuery1) : { data: { results: [] } },
                    fallbackQuery2 ? SearchSongsAction(fallbackQuery2) : { data: { results: [] } }
                ]);

                songResults = {
                    success: true,
                    data: {
                        results: [
                            ...(results1.data?.results || []),
                            ...(results2.data?.results || [])
                        ]
                    }
                };
            }

            if (songResults?.success) {
                setSearchResults(songResults.data.results);
            }
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setIsLoading(false);
        }
    }, 300);

    // ✅ Reset when search is cleared
    const handleClearSearch = () => {
        setRemoveSearch(true);
        setSearchQuery("");
        setSearchResults([]);
        setTopQuery(null);
    };

    // ✅ Trigger search when query changes
    useEffect(() => {
        if (searchQuery && searchQuery !== prevQuery.current) {
            prevQuery.current = searchQuery;
            handleSearch(searchQuery);
        }
        return () => handleSearch.cancel();
    }, [searchQuery]);

    // ✅ Reset removeSearch flag when results load
    useEffect(() => {
        if (searchResults.length > 0) {
            setRemoveSearch(false);
        }
    }, [searchResults]);

    // ✅ Scroll to results when search starts
    useEffect(() => {
        if (searchQuery) {
            document.getElementById("searchResultsTop")?.scrollIntoView({ behavior: "smooth" });
        }
    }, [searchQuery]);

    // ✅ Don't render if no search or removed
    if (!searchQuery || removeSearch) return null;

    return (
        <div ref={searchResultsRef} id="searchResultsTop" className="flex flex-col gap-6 mb-6 mt-4">
            <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                    <Label className="text-xl font-bold text-sky-900 dark:text-sky-300">Search Results</Label>
                    <button
                        onClick={handleClearSearch}
                        className="p-2 rounded-full border bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                        aria-label="Clear search"
                    >
                        <Plus className="rotate-45 text-gray-600 dark:text-gray-300" />
                    </button>
                </div>

                <div className="grid gap-1 grid-cols-1 mt-3">
                    <TopSearchResult topQuery={topQuery} />
                    <Separator />

                    {isLoading ? (
                        // ✅ Better loading state
                        <div className="space-y-3">
                            <Skeleton className="h-16 rounded-lg" />
                            <Skeleton className="h-16 rounded-lg" />
                            <Skeleton className="h-16 rounded-lg" />
                        </div>
                    ) : searchResults.length > 0 ? (
                        // ✅ Results with better styling
                        searchResults.map((song, index) => (
                            <div
                                key={song.id}
                                className="bg-white dark:bg-gray-800 border rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                            >
                                <SongBar song={song} index={index} searched={true} />
                            </div>
                        ))
                    ) : (
                        // ✅ Clear empty state
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <p>No songs found for "{searchQuery}"</p>
                            {searchQuery.split(" ").length > 1 && (
                                <p className="text-sm mt-2">Try searching with fewer words</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default SearchResults;