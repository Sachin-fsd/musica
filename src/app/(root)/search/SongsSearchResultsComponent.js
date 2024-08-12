'use client'

import SearchResultsSongBar from "@/components/searchPage/searchResultsSongBar";
import SongBar from "@/components/songBar";
import { Label } from "@/components/ui/label";


const SongsSearchResultsComponent = ({ querySongs }) => {

    // let searchResults = localStorage.getItem("searchResults") || [];
    // console.log("searchResults",searchResults)

    // if (!searchResults || searchResults.length === 0) {
    //     return <p>No results found.</p>;
    // }

    return (
        <div >
            <div>
                <Label className="text-lg font-bold">Songs</Label>
            </div>
            {
                querySongs?.results.length > 0 ? (
                    querySongs?.results.map((song, index) => (
                        <div key={index}>
                            {/* <SearchResultsSongBar song={song} index={index} /> */}
                            <SongBar song={song} index={index}/>
                        </div>
                    ))
                ) : (
                    <p>No song Found</p>
                )
            }
        </div>
    );
};

export default SongsSearchResultsComponent;
