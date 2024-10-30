'use client'

import SongBar from "@/components/songBar"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { UserContext } from "@/context"
import { Plus } from "lucide-react"
import { useContext } from "react"

const SearchResults = () => {
    const {searchResults, setSearchResults} = useContext(UserContext)
    if(!searchResults || searchResults.length===0) return null;
    return (
        <div className="flex flex-col lg:flex-row gap-6 mb-4">
            <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                    <Label className="text-xl font-bold text-sky-900 dark:text-sky-300">
                        Search Results
                    </Label>
                    <Plus onClick={()=>setSearchResults([])} className="cursor-pointer rotate-45 border border-gray-300 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-300" />
                </div>
                <div className="grid gap-4 grid-cols-1">
                    {searchResults && searchResults.length > 0 ? (
                        searchResults.map((song, index) => (
                            <div
                                key={index}
                                className=" bg-gray-300 dark:bg-gray-950 rounded"
                            >
                                <SongBar song={song} index={index} />
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