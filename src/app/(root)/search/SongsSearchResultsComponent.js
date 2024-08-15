'use client'

import SearchResultsSongBar from "@/components/searchPage/searchResultsSongBar";
import SongBar from "@/components/songBar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";


const SongsSearchResultsComponent = ({ querySongs }) => {

    // let searchResults = localStorage.getItem("searchResults") || [];
    // console.log("searchResults",searchResults)

    // if (!searchResults || searchResults.length === 0) {
    //     return <p>No results found.</p>;
    // }

    return (
        <div className="flex flex-col space-y-4 w-full"> {/* Ensure full width */}
            <div className="label-heading">
                <Label className="text-lg font-bold">Songs</Label>
            </div>
            {querySongs?.results.length > 0 ? (
                querySongs?.results.map((song, index) => (
                    <div key={index} className="w-full ">
                        <SongBar song={song} index={index} />
                        <Separator/>
                    </div>
                ))
            ) : (
                <p>No song Found</p>
            )}
        </div>
    );
};

export default SongsSearchResultsComponent;
