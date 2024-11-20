import { All_Albums, mega_menu_1, mega_menu_2 } from "@/utils/cachedSongs";
import TopAlbums from "..";
import { fetchAlbumsByLinkAction, fetchArtistsByPermaLinkAction } from "@/app/actions";
import TopArtists from "../../TopArtists";



const AlbumContent = async () => {
    try {
        // Fetch all albums concurrently
        const albumData = await Promise.all(
            All_Albums.map(async (album) => {
                const data = await fetchAlbumsByLinkAction(album.link);
                return { heading: album.heading, data: data || [] }
            })
        )

        const MegaMenu2 = await fetchAlbumsByLinkAction(mega_menu_2);
        // const MegaMenu1 = await fetchAlbumsByLinkAction(mega_menu_1);

        // const artists = await Promise.all(
        //     MegaMenu2.playlist.map(async (artist) => {
        //         const data = await fetchArtistsByPermaLinkAction(artist.perma_url);
        //         return data.data || [] 
        //     })
        // )

        // console.log("artists: ",artists);

        return (
            <div className="p-2 mb-4 rounded-lg">
                {
                    albumData.map(({ heading, data }) => (
                        <div key={heading}>
                            <TopAlbums
                                heading={heading}
                                albums={data}
                                emptyMessage="No trending albums available."
                            />
                        </div>
                    ))
                }
                {/* <div>
                    <TopArtists
                        heading={"Top Artists"}
                        albums={artists}
                        emptyMessage="No trending albums available."
                    />
                </div> */}
            </div>
        )

    } catch (error) {
        console.error("Error fetching album data:", error);
        return (
            <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg text-center">
                <p className="text-gray-800 dark:text-gray-300">Failed to load albums. Please try again later.</p>
            </div>
        );
    }
}

export default AlbumContent;
