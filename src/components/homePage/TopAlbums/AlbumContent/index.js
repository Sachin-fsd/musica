import { All_Albums, mega_menu_3 } from "@/utils/cachedSongs";
import TopAlbums from "..";
import { fetchByLinkAction} from "@/app/actions";
import { shuffleArray } from "@/utils/extraFunctions";



const AlbumContent = async () => {
    try {
        let MegaMenu3Playlists = await fetchByLinkAction(mega_menu_3);
        let object_for_megaMenu3 = [
            {
                heading: "Ultimate Jams",
                data: MegaMenu3Playlists.top_playlists
            },
            {
                heading: "New Trending",
                data: MegaMenu3Playlists.new_trending
            },
            {
                heading: "New Albums",
                data: MegaMenu3Playlists.new_albums
            },
            {
                heading: "Top Hits",
                data: MegaMenu3Playlists["promo:vx:data:68"]
            },
            {
                heading: "On Repeat",
                data: MegaMenu3Playlists["promo:vx:data:185"]
            },
            {
                heading: "Chill Vibes",
                data: MegaMenu3Playlists["promo:vx:data:113"]
            },
            {
                heading: "Vibe Check",
                data: MegaMenu3Playlists["promo:vx:data:116"]
            },
            {
                heading: "Fresh Finds",
                data: MegaMenu3Playlists["promo:vx:data:143"]
            },
            {
                heading: "Epic Soundtracks",
                data: MegaMenu3Playlists["promo:vx:data:76"]
            }
        ]

        // Fetch all albums concurrently
        let albumData = await Promise.all(
            All_Albums.map(async (album) => {
                const data = await fetchByLinkAction(album.link);
                return { heading: album.heading, data: data || [] }
            })
        )

        albumData = [...object_for_megaMenu3, ...albumData, ]
        albumData = shuffleArray(albumData);
        albumData = [{heading: "Charts",data: MegaMenu3Playlists.charts},...albumData]

        // const MegaMenu1 = await fetchByLinkAction(mega_menu_1);

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
