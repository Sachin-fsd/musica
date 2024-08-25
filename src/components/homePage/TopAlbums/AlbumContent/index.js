import { fetchTopAlbumsOfYear, fetchTrendingAlbums } from "@/utils/fetchContent";
import TopAlbums from "..";

const AlbumContent = async () => {
    try {
        const [trendingAlbums, topAlbumsOfTheYear] = await Promise.all([
            fetchTrendingAlbums(),
            fetchTopAlbumsOfYear(),
        ]);

        return (
            <div>
                <div>
                    <TopAlbums heading={"Trending Albums"} albums={trendingAlbums || []} />
                </div>
                <div>
                    <TopAlbums heading={"Top Albums Of Year"} albums={topAlbumsOfTheYear || []} />
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error fetching album data:", error);
        return (
            <div>
                <p>Failed to load albums. Please try again later.</p>
            </div>
        );
    }
};

export default AlbumContent;
