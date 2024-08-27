"use client"

import { useEffect, useContext } from "react";
import { fetchAlbumsByLinkAction } from "@/app/actions";
import { All_Albums } from "@/utils/cachedSongs";
import { UserContext } from "@/context";

export function usePlayRandomSong() {
    const { setSongList, setCurrentSong } = useContext(UserContext);

    useEffect(() => {
        const playRandomSong = async () => {
            const randomLinkIndex = Math.floor(Math.random() * All_Albums.length);
            const selectedLink = All_Albums[randomLinkIndex].link;

            const albums = await fetchAlbumsByLinkAction(selectedLink);

            if (albums && albums.length > 0) {
                const randomAlbumIndex = Math.floor(Math.random() * albums.length);
                const selectedAlbum = albums[randomAlbumIndex];

                const randomSongIndex = Math.floor(Math.random() * selectedAlbum.length);

                setSongList(selectedAlbum);
                setCurrentSong(selectedAlbum[randomSongIndex]);
            }
        };

        playRandomSong();
    }, [setSongList, setCurrentSong]);
}
