'use client'

import SongBar from "@/components/songBar"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { UserContext } from "@/context"
import { Plus } from "lucide-react"
import { useContext, useEffect, useRef, useState } from "react"

const SearchResults = () => {
    const { searchResults, setSearchResults, searchQuery, setSearchQuery } = useContext(UserContext)
    const [removeSearch, setRemoveSearch] = useState(false);
    const searchResultsRef = useRef(null);
    useEffect(() => {
        let searchResultsTop = document.getElementById("searchResultsTop");
        searchResultsTop.scrollIntoView({ behavior: "smooth" });
    }, [searchQuery]);
    if (searchQuery.length === 0) return;

    if (removeSearch) return;

    if (!searchResults || searchResults.length === 0) {
        return (
            <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg text-center">
                <p className="text-gray-800 dark:text-gray-300">We are adding it soon 🥺</p>
            </div>
        )
    }
    return (
        <div ref={searchResultsRef} className="flex flex-col lg:flex-row gap-6 mb-4 mt-6">
            <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                    <Label className="text-xl font-bold text-sky-900 dark:text-sky-300">
                        Search Results
                    </Label>
                    <Plus onClick={() => setRemoveSearch(true)} className="cursor-pointer rotate-45 border border-gray-300 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-300" />
                </div>
                <div className="grid gap-4 grid-cols-1 mt-3">
                    {searchResults && searchResults.length > 0 ? (
                        searchResults.map((song, index) => (
                            <div
                                key={index}
                                className=" bg-gray-300 dark:bg-gray-950 rounded"
                            >
                                <SongBar song={song} index={index} searched={true} />
                            </div>
                        ))
                    ) : (
                        <Skeleton className="rounded w-40 h-8" />
                    )}
                </div>
            </div>
        </div>
    )
}

export default SearchResults