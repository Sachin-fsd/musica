// import { Label } from "@/components/ui/label";
// import { Skeleton } from "@/components/ui/skeleton";
// import Image from "next/image";

// const AlbumBar = ({ album }) => {
//     // Function to truncate the title if it exceeds a certain length
//     const truncateTitle = (title, maxLength = 20) => {
//         return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
//     };

//     return (
//         <div className="flex flex-col items-center border-gray-200 rounded-lg w-full">
//             <div className="relative w-full pb-[100%]">
//                 {album.image ? (
//                     <Image
//                         src={album.image}
//                         alt={`${album.name} cover`}
//                         fill
//                         loading="lazy"
//                         quality={100}
//                         className="absolute top-0 left-0 rounded object-cover cursor-pointer"
//                     />
//                 ) : (
//                     <Skeleton className="absolute top-0 left-0 w-full h-full rounded" />
//                 )}
//             </div>
//             <div className="w-full text-center mt-2">
//                 {album.title ? (
//                     <Label className="font-bold text-cyan-950 truncate text-xs cursor-pointer">
//                         {truncateTitle(album.title)}
//                     </Label>
//                 ) : (
//                     <Skeleton className="h-4 w-full rounded" />
//                 )}
//             </div>
//         </div>
//     );
// };

// export default AlbumBar;

'use client'

import { GetAlbumSongsByIdAction } from "@/app/actions";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { UserContext } from "@/context";
import { debounce } from "lodash";
import Image from "next/image";
import { useCallback, useContext } from "react";

const AlbumBar = ({ album }) => {

    const { setSongList, setCurrentIndex, setCurrentSong, setPlaying, setCurrentId, setLoading

    } = useContext(UserContext)

    // Function to truncate the title if it exceeds a certain length
    const truncateTitle = (title, maxLength = 20) => {
        return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
    };

    const handleAlbumClick = useCallback(() => {
        setLoading(true);
        debounce(async () => {
            try {
                const data = await GetAlbumSongsByIdAction(album.id);
                if (data.success) {
                    console.log(data)
                    setSongList(data.data.songs)
                    setCurrentIndex(0);
                    setCurrentSong(data.data.songs[0]);
                    setPlaying(true);
                    setCurrentId(data.data.songs[0].id);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }, 300)();
    }, [setCurrentIndex, setSongList, setCurrentSong, setPlaying, setCurrentId]);


    return (
        <div className="flex flex-col items-center border-gray-200 rounded-lg w-full" onClick={handleAlbumClick}>
            <div className="relative w-full pb-[100%]">
                {album.image ? (
                    <Image
                        src={album.image}
                        alt={`${album.name} cover`}
                        fill
                        loading="lazy"
                        quality={100}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="absolute top-0 left-0 w-full h-full rounded object-cover cursor-pointer"
                    />
                ) : (
                    <Skeleton className="absolute top-0 left-0 w-full h-full rounded" />
                )}
            </div>
            {/* <div className="w-full text-center mt-2">
                {album.title ? (
                    <Label className="font-bold text-cyan-950 truncate text-[2%] cursor-pointer">
                        {truncateTitle(album.title)}
                    </Label>
                ) : (
                    <Skeleton className="h-4 w-full rounded" />
                )}
            </div> */}
        </div>
    );
};

export default AlbumBar;
