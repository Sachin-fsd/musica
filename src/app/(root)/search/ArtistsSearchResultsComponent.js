import ArtistSearchResultBar from "@/components/searchPage/artistSearchResultBar";
import SearchResultsAlbumBar from "@/components/searchPage/searchResultsArtistBar";
import { Label } from "@/components/ui/label";


const ArtistsSearchResultsComponent = ({ queryArtists }) => {

    // console.log("artists",artists)
    // localStorage.setItem("artists",(artists))

    return (
        <div >
            <div>
                <Label className="text-lg font-bold">Artists</Label>
            </div>
            {
                queryArtists?.results.length > 0 ? (
                    queryArtists?.results.map((artist, index) => (
                        <div key={index}>
                            <ArtistSearchResultBar artist={artist} index={index} />
                        </div>
                    ))
                ) : (
                    <p>No Artists Found</p>
                )
            }
        </div>
    );
};

export default ArtistsSearchResultsComponent;
