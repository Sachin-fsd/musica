'use client'

import SearchResultsAlbumBar from "@/components/searchPage/searchResultsArtistBar";
import { Label } from "@/components/ui/label";


const AlbumsSearchResultsComponent = ({queryAlbums}) => {

    // console.log("artists",artists)
    // localStorage.setItem("artists",(artists))

    return (
        <div >
            <div>
                <Label className="text-lg font-bold">Albums</Label>
            </div>
            {
                queryAlbums?.results.length > 0 ? (
                    queryAlbums?.results.map((album,index)=>(
                        <div key={index}>
                            <SearchResultsAlbumBar album={album} index={index} />
                        </div>
                    ))
                ) : (
                    <p>No song Found</p>
                )
            }
        </div>
    );
};

export default AlbumsSearchResultsComponent;
