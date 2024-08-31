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
            <div className="bg-gray-100 dark:bg-gray-900 p-6 overflow-x-hidden">
                <Label className="text-lg font-bold text-gray-900 dark:text-gray-100">Search A Song...</Label>
            </div>
        );
    }

    return (
        <div className="flex-grow bg-gray-100 dark:bg-gray-900 p-4 overflow-x-hidden"> {/* Ensure no x-scroll */}
            <div className="max-w-full overflow-x-hidden"> {/* Ensure no x-scroll */}
                <SongsSearchResultsComponent querySongs={searchResults.songs} />
            </div>
        </div>
    );
}
