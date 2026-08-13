'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { getUserTasteProfileAction } from '@/app/actions/tasteProfile';
import TopArtists from '../TopArtists';
import TopSongsTaste from '../TopSongsTaste';
import SongContentCarousel from '../TopSongs/SongContentCarousel';
import TasteSkeleton from './TasteSkeleton';

const MusicSections = () => {
    const { user, authLoading } = useAuth();

    const { data, isLoading } = useQuery({
        queryKey: ['taste-profile', user?.id],
        queryFn: () => getUserTasteProfileAction(),
        enabled: !!user && !authLoading,
        staleTime: 10 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
    });

    const topArtists = data?.topArtists || [];
    const topSongs = data?.topSongs || [];
    const showSkeleton = authLoading || (!!user && isLoading);
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
