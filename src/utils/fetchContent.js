const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_PRODUCTION_URL
    : process.env.NEXT_PUBLIC_LOCAL_URL;

export async function fetchTrendingAlbums() {
    try {
        const response = await fetch(`${BASE_URL}/api/trending-albums`);

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
        const response = await fetch(`${BASE_URL}/api/top-albums-of-year`);

        const data = await response.json();

        if (!response.ok) {
            console.error('Failed to fetch top albums of the year:', data.msg);
            return null;
        }

        return data.data;
    } catch (error) {
        console.error('Error fetching top albums of the year:', error);
        return null;
    }
}
