import { SearchGlobalAction, SearchSongsAction } from "@/app/actions";
import AlbumsSearchResultsComponent from "./AlbumsSearchResultsAlbumsComponent";
import SongsSearchResultsComponent from "./SongsSearchResultsComponent";
import PlaylistSearchResultBar from "@/components/searchPage/playlistSearchResultBar";
import ArtistsSearchResultsComponent from "./ArtistsSearchResultsComponent";
import { Label } from "@/components/ui/label";

export default async function SearchPage({ searchParams }) {
    const query = searchParams.query;
    // console.log("query", query);

    let searchResults = {};

    // Perform server-side fetching using server action
    if (query) {
        // NextTopLoader.start();  // Start the loader
        // Fetch songs using SearchSongsAction
        const songResults = await SearchSongsAction(query);
        // console.log("searchResults1", songResults);


        if (songResults && songResults.success) {
            searchResults.songs = songResults.data;
        }

        // console.log("searchResults", searchResults);
        if (!songResults.success) return <p>No Song Found</p>
        // NextTopLoader.done();  // Stop the loader
    }

    //for global search
    // if (query) {
    //     // NextTopLoader.start();  // Start the loader
    //     // Fetch songs using SearchSongsAction
    //     const songResults = await SearchGlobalAction(query);
    //     console.log("searchResults1", songResults);


    //     if (songResults && songResults.success) {
    //         searchResults.topQuery = songResults.data.topQuery;
    //         searchResults.songs = songResults.data.songs;
    //         searchResults.albums = songResults.data.albums;
    //         searchResults.artists = songResults.data.artists;
    //         searchResults.playlists = songResults.data.playlists;
    //     }

    //     // console.log("searchResults", searchResults);
    //     if (!songResults.success) return <p>No Song Found</p>
    //     // NextTopLoader.done();  // Stop the loader
    // }

    if(!query) return (
        <div>
            <Label className="text-lg font-bold">Search A Song...</Label>
        </div>
    )
    return (
        <div className="flex-grow bg-white p-6">
            <div>
                <SongsSearchResultsComponent querySongs={searchResults.songs} />
            </div>
        </div>
        // <div className="flex-grow bg-white p-8">
        //     {/* {query && <h1>Search results for "{query}"</h1>} */}
        //     <div className="mb-4">
        //         <SongsSearchResultsComponent querySongs={searchResults.songs} />
        //     </div>
        //     <div className="mb-4">
        //         <AlbumsSearchResultsComponent queryAlbums={searchResults.albums} />
        //     </div>
        //     <div className="mb-4">
        //         <ArtistsSearchResultsComponent queryArtists={searchResults.artists} />
        //     </div>
        //     <div className="mb-4">
        //         <div>Playlists</div>
        //         {
        //             searchResults.playlists.results.map((playlist, index) => (
        //                 <div key={index}>
        //                     <PlaylistSearchResultBar playlist={playlist} index={index} />
        //                 </div>
        //             ))
        //         }
        //     </div>

        // </div>
    );
}
