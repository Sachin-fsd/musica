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

const SearchResults = () => {
    const { searchQuery, setLoading } = useContext(UserContext);
    const [searchResults, setSearchResults] = useState([]);
    const [topQuery, setTopQuery] = useState({});
    const [removeSearch, setRemoveSearch] = useState(false);
    const searchResultsRef = useRef(null);
    const prevQuery = useRef(""); // Track previous query

    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (!query.trim()) return;

            setLoading(true);
            try {
                const topResult = await SearchGlobalAction(query);
                if (topResult) setTopQuery(topResult.data.topQuery);

                let songResults = await SearchSongsAction(query);

                // If no results, try searching with the first two words separately
                if (songResults?.success && songResults.data.results.length === 0) {
                    const words = query.split(" ");
                    const fallbackQuery1 = words[0] || "";
                    const fallbackQuery2 = words[1] || "";

                    let results1 = fallbackQuery1 ? await SearchSongsAction(fallbackQuery1) : { data: { results: [] } };
                    let results2 = fallbackQuery2 ? await SearchSongsAction(fallbackQuery2) : { data: { results: [] } };

                    // Merge results safely
                    songResults = {
                        success: true,
                        data: { results: [...(results1.data?.results || []), ...(results2.data?.results || [])] }
                    };
                }

                if (songResults?.success) {
                    setSearchResults(songResults.data.results);
                }
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        }, 500),
        [setLoading]
    );

    const debouncedSearchRef = useRef(debouncedSearch);

    useEffect(() => {
        debouncedSearchRef.current = debouncedSearch;
    }, [debouncedSearch]);

    useEffect(() => {
        if (searchQuery !== prevQuery.current) {
            prevQuery.current = searchQuery;
            debouncedSearchRef.current(searchQuery);
        }

        return () => {
            debouncedSearchRef.current.cancel();
        };
    }, [searchQuery]);

    useEffect(() => {
        setRemoveSearch(false);
    }, [searchResults]);

    useEffect(() => {
        if (searchQuery) {
            document.getElementById("searchResultsTop")?.scrollIntoView({ behavior: "smooth" });
        }
    }, [searchQuery]);

    const handleRemoveSearch = useCallback(() => setRemoveSearch(true), []);

    if (searchQuery.length === 0 || removeSearch) return null;

    return (
        <div ref={searchResultsRef} id="searchResultsTop" className="flex flex-col lg:flex-row gap-6 mb-6 mt-4">
            <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                    <Label className="text-xl font-bold text-sky-900 dark:text-sky-300">
                        Search Results
                    </Label>
                    <button
                        onClick={handleRemoveSearch}
                        className="p-2 rounded-full border bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700 sm:hover:bg-gray-300 dark:sm:hover:bg-gray-700 transition"
                    >
                        <Plus className="rotate-45 text-gray-600 dark:text-gray-300" />
                    </button>
                </div>
                <div className="grid gap-1 grid-cols-1 mt-3">
                    <TopSearchResult topQuery={topQuery} />
                    <Separator />
                    {searchResults.length > 0 ? (
                        searchResults.map((song, index) => (
                            <div key={index} className="bg-gray-100 dark:bg-gray-900 border rounded-md shadow-sm sm:hover:shadow-md transition-all">
                                <SongBar song={song} index={index} searched={true} />
                            </div>
                        ))
                    ) : (
                        <Skeleton className="rounded w-full h-8" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchResults;