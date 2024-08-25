'use client'

import SearchResultsSongBar from "@/components/searchPage/searchResultsSongBar";
import SongBar from "@/components/songBar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserContext } from "@/context";
import { useContext, useEffect } from "react";

const SongsSearchResultsComponent = ({ querySongs }) => {
    const { setLoading } = useContext(UserContext);

    useEffect(() => {
        setLoading(false);
    }, [querySongs]);

    return (
        <div className="flex flex-col space-y-4 w-full overflow-x-hidden bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <div className="label-heading">
                <Label className="text-lg font-bold">Songs</Label>
            </div>
            {querySongs?.results.length > 0 ? (
                querySongs.results.map((song, index) => (
                    <div key={index} className="w-full">
                        <SongBar song={song} index={index} />
                        <Separator />
                    </div>
                ))
            ) : (
                <p>No songs found</p>
            )}
        </div>
    );
};

export default SongsSearchResultsComponent;
