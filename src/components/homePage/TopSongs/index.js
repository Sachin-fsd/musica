import SongBar from '@/components/songBar';
import { Label } from '@/components/ui/label';
import { songs } from '@/utils/cachedSongs';
import { Ellipsis } from 'lucide-react';

const TopSongs = () => {
    return (
        <div className="flex flex-col lg:flex-row gap-6 ">
            {/* Top Charts Section */}
            <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                    <Label className="text-xl font-bold text-sky-900 dark:text-sky-300">
                        Quick picks
                    </Label>
                    <Ellipsis className="p-2 border border-gray-300 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-300" />
                </div>
                <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="p-2 border bg-gray-300 dark:bg-gray-800 rounded"
                        >
                            <SongBar song={songs[index]} index={index} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Listen Again Section */}
            <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                    <Label className="text-xl font-bold text-sky-900 dark:text-sky-300">
                        For You
                    </Label>
                    <Ellipsis className="p-2 border border-gray-300 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-300" />
                </div>
                <div className="space-y-4">
                    {songs.length >= 8 ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index + 4}
                                className="p-2 border bg-gray-300 dark:bg-gray-800 rounded"
                            >
                                <SongBar song={songs[index + 4]} index={index + 4} />
                            </div>
                        ))
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default TopSongs;
