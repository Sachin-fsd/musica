'use client'
// import { All_Albums, mega_menu_3 } from "@/utils/cachedSongs";
import { All_Albums } from "@/utils/cachedSongs";
import TopAlbums from "..";
// import { fetchByLinkAction } from "@/app/actions"; // Remove server action import
import { shuffleArray } from "@/utils/extraFunctions";
import { useEffect, useState } from 'react';

const AlbumContent = () => {
    // const backendUrl = 'http://localhost:5000';
    const [albumData, setAlbumData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jiosaavn-data`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const MegaMenu3Playlists = await response.json();
                console.log("Data from backend:", MegaMenu3Playlists);
                const object_for_megaMenu3 = [
                    { heading: "Charts", data: MegaMenu3Playlists.charts },
                    { heading: "Ultimate Jams", data: MegaMenu3Playlists.top_playlists },
                    { heading: "New Trending", data: MegaMenu3Playlists.new_trending },
                    { heading: "New Albums", data: MegaMenu3Playlists.new_albums },
                    { heading: "Top Hits", data: MegaMenu3Playlists["promo:vx:data:68"] },
                    { heading: "On Repeat", data: MegaMenu3Playlists["promo:vx:data:185"] },
                    { heading: "Chill Vibes", data: MegaMenu3Playlists["promo:vx:data:113"] },
                    { heading: "Vibe Check", data: MegaMenu3Playlists["promo:vx:data:116"] },
                    { heading: "Fresh Finds", data: MegaMenu3Playlists["promo:vx:data:143"] },
                    { heading: "Epic Soundtracks", data: MegaMenu3Playlists["promo:vx:data:76"] },
                    { heading: "Chill Mood", data: MegaMenu3Playlists["promo:vx:data:21"] },
                    { heading: "Liked By All", data: MegaMenu3Playlists["promo:vx:data:31"] },
                    { heading: "Artist Recos", data: MegaMenu3Playlists["artist_recos"] },
                ];
                setAlbumData(object_for_megaMenu3);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data from backend:", err);
                setError("Failed to load albums. Please try again later.");
                setLoading(false);
            }
        };

        fetchAllData();
    }, []); // Empty dependency array to run only once on mount

    if (loading) {
        return <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg text-center">Loading albums...</div>;
    }

    if (error) {
        return (
            <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg text-center">
                <p className="text-gray-800 dark:text-gray-300">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-2 mb-4 rounded-lg hide-scrollbar">
            {
                albumData.map(({ heading, data }) => (
                    <div key={heading}>
                        <TopAlbums
                            heading={heading}
                            albums={data}
                            emptyMessage="No data available."
                        />
                    </div>
                ))
            }
        </div>
    );
}

export default AlbumContent;