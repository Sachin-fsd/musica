'use client'

import SongComponent from './SongComponent';
import { useContext, useEffect } from 'react';
import { UserContext } from '@/context';
import { toast } from 'react-toastify';
import { All_Albums } from '@/utils/cachedSongs';
import { fetchAlbumsByLinkAction, GetSongsByIdAction } from '@/app/actions';
import { songs as defaultSongs } from '@/utils/cachedSongs';  // Import your default songs

const SongContent = () => {
    const { songList, setSongList, setCurrentIndex, setCurrentSong, setCurrentId } = useContext(UserContext);

    useEffect(() => {
        const playRandomSong = async () => {
            const toastId = toast.loading("Loading a random song...");

            try {
                const randomLinkIndex = Math.floor(Math.random() * All_Albums.length);
                const selectedLink = All_Albums[randomLinkIndex].link;

                console.log("selectedLink", selectedLink);

                const albums = await fetchAlbumsByLinkAction(selectedLink);

                console.log("albums", albums);

                if (albums && albums.length > 0) {
                    const randomAlbumIndex = Math.floor(Math.random() * albums.length);
                    const selectedAlbum = albums[randomAlbumIndex];
                    console.log("selectedAlbum", selectedAlbum);
                    const data = await GetSongsByIdAction(selectedAlbum.type, selectedAlbum.id);
                    console.log("data", data);
                    if (data.success) {
                        console.log("data.data", data.data);
                        const songs = data.data.songs || data.data.topSongs;
                        console.log("songs", songs);
                        setSongList(songs);
                        setCurrentIndex(0);
                        setCurrentSong(songs[0]);
                        setCurrentId(songs[0].id);
                        toast.update(toastId, { render: "Song loaded successfully!", type: "success", isLoading: false, autoClose: 2000 });
                    } else {
                        toast.update(toastId, { render: "Failed to load song!", type: "error", isLoading: false, autoClose: 2000 });
                        setSongList(defaultSongs);  // Set default songs if loading fails
                    }
                } else {
                    toast.update(toastId, { render: "No albums found!", type: "warning", isLoading: false, autoClose: 2000 });
                    setSongList(defaultSongs);  // Set default songs if no albums are found
                }
            } catch (error) {
                toast.update(toastId, { render: "An error occurred!", type: "error", isLoading: false, autoClose: 2000 });
                setSongList(defaultSongs);  // Set default songs if an error occurs
            }
        };

        playRandomSong();
    }, []);

    // Create a copy of the songList and remove the last song if the length is odd
    if (!songList || songList.length === 0) {
        return null;
    }
    const adjustedSongList = [...songList];
    if (adjustedSongList.length % 2 !== 0) {
        adjustedSongList.pop();
    }

    // Split the adjusted list into two equal halves
    const halfLength = adjustedSongList.length / 2;
    const firstHalf = adjustedSongList.slice(0, halfLength);
    const secondHalf = adjustedSongList.slice(halfLength);

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <SongComponent songs={firstHalf} heading={"Quick Picks"} />
            <SongComponent songs={secondHalf} heading={"For You"} />
        </div>
    );
};

export default SongContent;
