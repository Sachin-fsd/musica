import SongBar from "@/components/songBar";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Ellipsis } from "lucide-react";

const SongComponent = ({ songs, heading }) => {
    return (
        <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
                <Label className="text-xl font-bold text-sky-900 dark:text-sky-300">
                    {heading}
                </Label>
                <Ellipsis className="p-2 border border-gray-300 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-300" />
            </div>
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                {songs && songs.length > 0 ? (
                    songs.map((song, index) => (
                        <div
                            key={index}
                            className="p-2 border bg-gray-300 dark:bg-gray-800 rounded-lg"
                        >
                            <SongBar song={song} index={index} />
                        </div>
                    ))
                ) : (
                    <Skeleton className="rounded w-40 h-8" />
                )}
            </div>
        </div>
    );
};

export default SongComponent;
