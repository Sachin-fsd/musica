'use client';

import SongBar from "@/components/songBar";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { UserContext } from "@/context";
import { Plus } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";

const SearchResults = () => {
    const { searchResults, searchQuery } = useContext(UserContext);
    const [removeSearch, setRemoveSearch] = useState(false);
    const searchResultsRef = useRef(null);

    useEffect(()=>{
        setRemoveSearch(false);
    },[searchResults]);

    useEffect(() => {
        if (searchQuery) {
            const searchResultsTop = document.getElementById("searchResultsTop");
            searchResultsTop?.scrollIntoView({ behavior: "smooth" });
        }
    }, [searchQuery]);

    if (searchQuery.length === 0 || removeSearch) return null;

    const handleRemoveSearch = () => setRemoveSearch(true);

    return (
        <div
            ref={searchResultsRef}
            id="searchResultsTop"
            className="flex flex-col lg:flex-row gap-6 mb-6 mt-4"
        >
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
                    {searchResults && searchResults.length > 0 ? (
                        searchResults.map((song, index) => (
                            <div
                                key={index}
                                className=
                                "bg-gray-100 dark:bg-gray-900 border rounded-md shadow-sm sm:hover:shadow-md transition-all"
                            >
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
