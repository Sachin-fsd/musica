import { All_Albums } from "@/utils/cachedSongs";
import TopAlbums from "..";
import { fetchAlbumsByLinkAction } from "@/app/actions";



const AlbumContent = async () => {
    try {
        // Fetch all albums concurrently
        const albumData = await Promise.all(
            All_Albums.map(async (album) => {
                const data = await fetchAlbumsByLinkAction(album.link);
                return { heading: album.heading, data: data || [] }
            })
        )

        return (
            <div className="p-2 mb-6 rounded-lg">
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
