'use client';

import SongComponent from './SongComponent';
import { useContext } from 'react';
import { UserContext } from '@/context';
import { songs as songList } from '@/utils/cachedSongs';

const SongContent = () => {
    // const { songList } = useContext(UserContext);

    // Handle the case where songList is empty or undefined
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
