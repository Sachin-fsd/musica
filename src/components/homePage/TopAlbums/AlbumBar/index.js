import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

const AlbumBar = ({song}) => {
    return (
        <div className="flex flex-col justify-between items-center py-1 border-gray-200 rounded-lg w-full">
            {song.image[0].url ? (
                // <img src={song.image[0].url} className="w-10 h-10 rounded object-cover cursor-pointer mr-3" alt={`${decodedName} cover`} onClick={handleClick} />
                <Image src={song.image[1].url} height={140} width={140} loading="lazy" quality={100} className="rounded object-cover cursor-pointer mr-3"   />
            ) : (
                <Skeleton className="w-10 h-10 rounded object-cover" />
            )}
            <div className="flex-1 overflow-hidden cursor-pointer">
                {true ? (
                    <Label className="font-bold text-cyan-950 truncate text-sm cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis">
                        {song.name}
                    </Label>
                ) : (
                    <Skeleton className="min-h-2 p-2 m-2" />
                )}
                
            </div>
            {/* <Label variant="simple" disabled={loading}>
                {
                    songList.find(s => s.id === song.id) ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="simple">
                                    <EllipsisVertical className="text-gray-500 hover:text-gray-700 cursor-pointer size-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={handleRemoveSong} className="bg-red-300">
                                        <Trash2 className="mr-2 h-4 w-4 " />
                                        <span>Remove from queue</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleAddNextSong}>
                                        <ListMusic className="mr-2 h-4 w-4" />
                                        <span>Play next</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <LongPressTooltip tooltipText="Add to queue">
                            <Plus onClick={handlePlusClick} className="text-gray-500 hover:text-gray-700 cursor-pointer size-5 mr-3" />
                        </LongPressTooltip>
                    )
                }
            </Label> */}
        </div>
    )
}

export default AlbumBar