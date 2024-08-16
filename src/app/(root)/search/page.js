import { SearchGlobalAction, SearchSongsAction } from "@/app/actions";
import AlbumsSearchResultsComponent from "./AlbumsSearchResultsAlbumsComponent";
import SongsSearchResultsComponent from "./SongsSearchResultsComponent";
import PlaylistSearchResultBar from "@/components/searchPage/playlistSearchResultBar";
import ArtistsSearchResultsComponent from "./ArtistsSearchResultsComponent";
import { Label } from "@/components/ui/label";

export default async function SearchPage({ searchParams }) {
    const query = searchParams.query;
    let searchResults = {};

    if (query) {
        const songResults = await SearchSongsAction(query);

        if (songResults && songResults.success) {
            searchResults.songs = songResults.data;
        }

        if (!songResults.success) return <p>No Song Found</p>;
    }

    if (!query) {
        return (
            <div>
                <Label className="text-lg font-bold">Search A Song...</Label>
            </div>
        );
    }

    return (
        <div className="flex-grow bg-white p-6 overflow-x-hidden"> {/* Ensure no x-scroll */}
            <div className="max-w-full overflow-x-hidden"> {/* Ensure no x-scroll */}
                <SongsSearchResultsComponent querySongs={searchResults.songs} />
            </div>
        </div>
        // Uncomment and adjust the following code if global search is needed
        // <div className="flex-grow bg-white p-8 overflow-x-hidden">
        //     <div className="mb-4">
        //         <SongsSearchResultsComponent querySongs={searchResults.songs} />
        //     </div>
        //     <div className="mb-4">
        //         <AlbumsSearchResultsComponent queryAlbums={searchResults.albums} />
        //     </div>
        //     <div className="mb-4">
        //         <ArtistsSearchResultsComponent queryArtists={searchResults.artists} />
        //     </div>
        //     <div className="mb-4 overflow-x-hidden">
        //         <div>Playlists</div>
        //         {searchResults.playlists?.results?.map((playlist, index) => (
        //             <div key={index}>
        //                 <PlaylistSearchResultBar playlist={playlist} index={index} />
        //             </div>
        //         ))}
        //     </div>
        // </div>
    );
}
