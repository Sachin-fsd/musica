'use client'

import { GetAlbumSongsByIdAction } from "@/app/actions";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { UserContext } from "@/context";
import { debounce } from "lodash";
import Image from "next/image";
import { useCallback, useContext } from "react";

const AlbumBar = ({ album }) => {
    const { setSongList, setCurrentIndex, setCurrentSong, setPlaying, setCurrentId, setLoading } = useContext(UserContext);

    const truncateTitle = (title, maxLength = 15) => {
        return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
    };

    const handleAlbumClick = useCallback(() => {
        setLoading(true);
        debounce(async () => {
            try {
                const data = await GetAlbumSongsByIdAction(album.id);
                if (data.success) {
                    setSongList(data.data.songs);
                    setCurrentIndex(0);
                    setCurrentSong(data.data.songs[0]);
                    setPlaying(true);
                    setCurrentId(data.data.songs[0].id);
                }
            } catch (error) {
                console.error("Error fetching album songs:", error);
            } finally {
                setLoading(false);
            }
        }, 300)();
    }, [album.id, setSongList, setCurrentIndex, setCurrentSong, setPlaying, setCurrentId, setLoading]);

    return (
        <div
            className="flex flex-col items-center border border-gray-200 rounded-lg overflow-hidden w-full cursor-pointer transition-transform transform"
            onClick={handleAlbumClick}
        >
            <div className="relative w-full pb-[100%]">
                <div className="absolute top-0 left-0 w-full h-full transition-opacity duration-300 hover:opacity-80">
                    {album.image ? (
                        <Image
                            src={album.image}
                            alt={`${album.name} cover`}
                            fill
                            loading="lazy"
                            quality={100}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="absolute top-0 left-0 w-full h-full rounded object-cover"
                        />
                    ) : (
                        <Skeleton className="absolute top-0 left-0 w-full h-full rounded" />
                    )}
                </div>
            </div>
            <div className="w-full text-center mt-2 px-2">
                {album.title ? (
                    <Label className="font-bold text-gray-800 truncate text-sm">
                        {truncateTitle(album.title)}
                    </Label>
                ) : (
                    <Skeleton className="h-4 w-full rounded" />
                )}
            </div>
        </div>
    );
};

export default AlbumBar;
