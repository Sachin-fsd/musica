'use client';

import SongComponent from './SongComponent';
import { useContext, useEffect } from 'react';
import { UserContext } from '@/context';
import { songs as defaultSongs } from '@/utils/cachedSongs';

const SongContent = () => {
    const { setSongList, songList } = useContext(UserContext);

    useEffect(() => {
        let savedSongList = null;
        try {
            const storedData = localStorage.getItem('songList');
            savedSongList = storedData ? JSON.parse(storedData) : null;
        } catch (error) {
            console.error("Error parsing song list from localStorage:", error);
            localStorage.removeItem('songList'); // Remove invalid data
        }

        if (savedSongList) {
            setSongList(savedSongList);
        } else {
            setSongList(defaultSongs);
        }
    }, [setSongList]);

    useEffect(() => {
        try {
            localStorage.setItem('songList', JSON.stringify(songList));
        } catch (error) {
            console.error("Error saving song list to localStorage:", error);
        }
    }, [songList]);

    if (!songList || songList.length === 0) {
        return (
            <div className="text-center text-gray-500 dark:text-gray-400">
                No songs available. Please try again later.
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <SongComponent songs={songList} heading="Now Playing" />
        </div>
    );
};

export default SongContent;
