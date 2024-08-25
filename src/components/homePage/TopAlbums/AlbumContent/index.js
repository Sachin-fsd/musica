import { fetchTopAlbumsOfYear, fetchTrendingAlbums } from "@/utils/fetchContent";
import TopAlbums from "..";

const AlbumContent = async () => {
    try {
        const [trendingAlbums, topAlbumsOfTheYear] = await Promise.all([
            fetchTrendingAlbums(),
            fetchTopAlbumsOfYear(),
        ]);

        return (
            <div className="p-2   rounded-lg">
                <div className="mb-6">
                    <TopAlbums
                        heading="Trending Albums"
                        albums={trendingAlbums || []}
                        emptyMessage="No trending albums available."
                    />
                </div>
                <div>
                    <TopAlbums
                        heading="Top Albums Of Year"
                        albums={topAlbumsOfTheYear || []}
                        emptyMessage="No top albums for the year available."
                    />
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error fetching album data:", error);
        return (
            <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg text-center">
                <p className="text-gray-800 dark:text-gray-300">Failed to load albums. Please try again later.</p>
            </div>
        );
    }
};

export default AlbumContent;
