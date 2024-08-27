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
