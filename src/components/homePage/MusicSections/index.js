'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserTasteProfileAction } from '@/app/actions/tasteProfile';
import TopArtists from '../TopArtists';
import TopSongsTaste from '../TopSongsTaste';
import SongContentCarousel from '../TopSongs/SongContentCarousel';
import TasteSkeleton from './TasteSkeleton';

const MusicSections = () => {
    const { user, authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [topArtists, setTopArtists] = useState([]);
    const [topSongs, setTopSongs] = useState([]);
    const [profileFetched, setProfileFetched] = useState(false);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            setTopArtists([]);
            setTopSongs([]);
            setProfileFetched(true);
            setLoading(false);
            return;
        }

        let cancelled = false;
        setLoading(true);

        getUserTasteProfileAction()
            .then((res) => {
                if (cancelled) return;
                setTopArtists(res?.topArtists || []);
                setTopSongs(res?.topSongs || []);
            })
            .catch((err) => {
                console.error('Failed to fetch taste profile:', err);
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                    setProfileFetched(true);
                }
            });

        return () => { cancelled = true; };
    }, [user, authLoading]);

    const showSkeleton = authLoading || (user && loading && !profileFetched);
    const hasTaste = topArtists.length > 0 || topSongs.length > 0;

    return (
        <div className="flex flex-col gap-8 mt-4">
            {showSkeleton ? (
                <TasteSkeleton />
            ) : (
                hasTaste && (
                    <div className="animate-fadeInUp flex flex-col gap-8">
                        <TopArtists artists={topArtists} />
                        <TopSongsTaste songs={topSongs} />
                    </div>
                )
            )}

            <SongContentCarousel />
        </div>
    );
};

export default MusicSections;
