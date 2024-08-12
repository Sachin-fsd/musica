'use client'

import { SearchSongByIdAction } from "@/app/actions"
import { Skeleton } from "@/components/ui/skeleton"
import { UserContext } from "@/context"
import { Label } from "@radix-ui/react-label"
import { Plus } from "lucide-react"
import { useContext } from "react"
import { toast } from "react-toastify"


const SearchResultsSongBar = ({ song, index }) => {

    const { setCurrentIndex, currentIndex,currentId, setCurrentId } = useContext(UserContext)


    const formatSinger = (singer) => {
        const newSinger = singer.split(",")[0]
        return newSinger
    }

    const handleSongClick = async() => {
        try {
            // const songResults = await SearchSongByIdAction(song.id)
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong")
        }
    }

    if (!song) {
        return (
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
                <Skeleton className="w-10 h-10 rounded object-cover mr-4" />

                <div className="flex-1">
                    <Label className="font-bold text-cyan-950 truncate text-sm"></Label>
                </div>
            </div>
        )
    }

    return (
        <div className={`flex justify-between items-center py-1 border-b border-gray-200 cursor-pointer rounded-lg`}>

            {
                song.image[0].url ? (
                    <img src={song.image[0].url} className="w-10 h-10 rounded object-cover mr-4" alt={`${song.name} cover`} onClick={handleSongClick} />
                ) : (
                    <Skeleton className="w-10 h-10 rounded object-cover mr-4" />
                )
            }
            <div className="flex-1">
                {
                    song.title ? (
                        <Label className="font-bold text-cyan-950 truncate text-sm cursor-pointer" onClick={handleSongClick}>{song.title}</Label>
                    ) : (
                        <Skeleton className=" min-h-2 p-2 m-2" />
                    )
                }
                {
                    song?.singers ? (
                        <p className="text-xs text-gray-600 truncate">{song.singers}</p>
                    ) : null
                }
            </div>
            <Plus className="text-gray-500 hover:text-gray-700 cursor-pointer size-5" />
        </div>
    )
}

export default SearchResultsSongBar