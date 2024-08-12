'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { UserContext } from "@/context"
import { Label } from "@radix-ui/react-label"
import { Plus } from "lucide-react"
import { useContext } from "react"


const PlaylistSearchResultBar = ({ playlist, index }) => {

    const { setCurrentIndex, currentIndex } = useContext(UserContext)
    // console.log("playlsit",playlist)

    const formatSinger = (singer) => {
        const newSinger = singer.split(",")[0]
        return newSinger
    }

    if (!playlist) {
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
                playlist.image[0].url ? (
                    <img src={playlist.image[0].url} className="w-10 h-10 rounded object-cover mr-4" alt={`${playlist.name} cover`} onClick={() => setCurrentIndex(index)} />
                ) : (
                    <Skeleton className="w-10 h-10 rounded object-cover mr-4" />
                )
            }
            <div className="flex-1">
                {
                    playlist.title ? (
                        <Label className="font-bold text-cyan-950 truncate text-sm cursor-pointer" onClick={() => setCurrentIndex(index)}>{playlist.title}</Label>
                    ) : (
                        <Skeleton className=" min-h-2 p-2 m-2" />
                    )
                }
                {
                    playlist?.description ? (
                        <p className="text-xs text-gray-600 truncate">{playlist.description}</p>
                    ) : null
                }
            </div>
            {/* <Plus className="text-gray-500 hover:text-gray-700 cursor-pointer size-5" /> */}
        </div>
    )
}

export default PlaylistSearchResultBar