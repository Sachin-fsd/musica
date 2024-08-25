export async function fetchTrendingAlbums() {
    try {
        const response = await fetch(`${process.env.PRODUCTION_URL}/api/trendingAlbums`);
        // console.log("reponse from server-side",response)

        const data = await response.json();

        if (!response.ok) {
            console.error('Failed to fetch trending albums:', data.msg);
            return null;
        }

        return data.data;
    } catch (error) {
        console.error('Error fetching trending albums:', error);
        return null;
    }
}

export async function fetchTopAlbumsOfYear() {
    try {
        const response = await fetch(`${process.env.PRODUCTION_URL}/api/top-albums-of-year`);
        // console.log("reponse from server-side",response)

        const data = await response.json();

        if (!response.ok) {
            console.error('Failed to fetch trending albums:', data.msg);
            return null;
        }

        return data.data;
    } catch (error) {
        console.error('Error fetching trending albums:', error);
        return null;
    }
}
