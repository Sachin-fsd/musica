'use client'

import SongComponent from './SongComponent';
import { useContext, useEffect } from 'react';
import { UserContext } from '@/context';
import { toast } from 'react-toastify';
import { All_Albums } from '@/utils/cachedSongs';
import { fetchAlbumsByLinkAction, GetSongsByIdAction } from '@/app/actions';

const SongContent = () => {
    const { songList,setSongList, setCurrentIndex, setCurrentSong, setCurrentId } = useContext(UserContext);

    useEffect(() => {
        const playRandomSong = async () => {
            const toastId = toast.loading("Loading a random song...");

            try {
                const randomLinkIndex = Math.floor(Math.random() * All_Albums.length);
                const selectedLink = All_Albums[randomLinkIndex].link;

                const albums = await fetchAlbumsByLinkAction(selectedLink);

                if (albums && albums.length > 0) {
                    const randomAlbumIndex = Math.floor(Math.random() * albums.length);
                    const selectedAlbum = albums[randomAlbumIndex];

                    const data = await GetSongsByIdAction(selectedAlbum.type, selectedAlbum.id);

                    if (data.success) {
                        setSongList(data.data.songs || data.data.topSongs);
                        setCurrentIndex(0);
                        setCurrentSong(data.data.songs[0]);
                        setCurrentId(data.data.songs[0].id);
                        toast.update(toastId, { render: "Song loaded successfully!", type: "success", isLoading: false, autoClose: 2000 });
                    } else {
                        toast.update(toastId, { render: "Failed to load song!", type: "error", isLoading: false, autoClose: 2000 });
                    }
                } else {
                    toast.update(toastId, { render: "No albums found!", type: "warning", isLoading: false, autoClose: 2000 });
                }
            } catch (error) {
                toast.update(toastId, { render: "An error occurred!", type: "error", isLoading: false, autoClose: 2000 });
            }
        };

        playRandomSong();
    }, []);


    // Create a copy of the songList and remove the last song if the length is odd
    if(!songList || songList.length===0 ){
        return null
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
            <SongComponent songs={firstHalf} heading={"Quick Picks"}/>
            <SongComponent songs={secondHalf} heading={"For You"}/>
        </div>
    );
};

export default SongContent;
