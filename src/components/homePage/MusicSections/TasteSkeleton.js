'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Label } from '@/components/ui/label';

const ArtistSkeletonCard = () => (
    <div className="flex flex-col items-center gap-3 p-3 min-w-[140px] max-w-[140px]">
        <Skeleton className="aspect-square w-full rounded-full shadow-md" />
        <Skeleton className="h-4 w-24" />
    </div>
);

const SongSkeletonRow = () => (
    <div className="flex items-center gap-3 p-1.5 rounded-lg w-[300px] sm:w-[320px]">
        <Skeleton className="w-12 h-12 rounded-md flex-shrink-0" />
        <Skeleton className="w-5 h-4 flex-shrink-0" />
        <div className="flex flex-col flex-1 gap-1.5 min-w-0">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
        </div>
    </div>
);

const TasteSkeleton = () => (
    <div className="flex flex-col gap-8 mt-4">
        {/* Top Artists skeleton */}
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-7 w-48" />
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                </div>
            </div>
            <div className="relative max-w-full">
                <div className="flex overflow-x-auto no-scrollbar gap-4" style={{ scrollbarWidth: 'none' }}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <ArtistSkeletonCard key={i} />
                    ))}
                </div>
            </div>
        </div>

        {/* Top Songs skeleton */}
        <div className="flex flex-col gap-1 my-6 w-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="w-5 h-5 rounded-full" />
                </div>
                <div className="flex items-center gap-1">
                    <Skeleton className="p-1.5 w-8 h-8 rounded-full" />
                    <Skeleton className="p-1.5 w-8 h-8 rounded-full" />
                </div>
            </div>
            <div
                className="grid grid-rows-4 grid-flow-col gap-x-4 gap-y-1 overflow-hidden pb-2 pt-1"
            >
                {Array.from({ length: 8 }).map((_, i) => (
                    <SongSkeletonRow key={i} />
                ))}
            </div>
        </div>
    </div>
);

export default TasteSkeleton;
