import { fetchTopAlbumsOfYear, fetchTrendingAlbums } from "@/utils/fetchContent";
import TopAlbums from "..";

const AlbumContent = async() => {
    const trendingAlbums = await fetchTrendingAlbums(); 
    const topAlbumsoftheYear = await fetchTopAlbumsOfYear();
    // console.log("trendingAlbums",trendingAlbums)
    return (
        <div>
            <div>
                <TopAlbums heading={"Trending Albums"} albums={trendingAlbums}/>
            </div>
            <div>
                <TopAlbums heading={"Top Albums Of Year"} albums={topAlbumsoftheYear}/>
            </div>
        </div>
    )
}

export default AlbumContent