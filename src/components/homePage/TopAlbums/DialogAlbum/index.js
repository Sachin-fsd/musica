import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import TouchableOpacity from '@/components/ui/touchableOpacity'
import { Play } from 'next/font/google'
import React from 'react'

const DialogAlbum = ({ album }) => {
    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <div
                        // onClick={() => setActive(card)}
                        // key={index}
                        className="mr-1 sm:hover:bg-gray-100 dark:sm:hover:bg-gray-800 rounded-lg shadow-sm min-w-[144px] sm:sm:hover:shadow-md transition">
                        <TouchableOpacity>
                            <div
                                style={{ scrollSnapAlign: 'center' }}
                                className="relative flex flex-col items-center rounded-lg overflow-hidden w-full cursor-pointer transition-transform transform sm:hover:scale-105">
                                <div className="relative w-full pb-[100%]">
                                    <div className="absolute top-0 left-0 w-full h-full">
                                        {album?.image ? (
                                            <img
                                                src={album?.image}
                                                alt={`${album?.title} cover`}
                                                className="absolute top-0 left-0 w-full h-full rounded-md object-cover"
                                            // onError={() => setImageError(true)}
                                            />
                                        ) : (
                                            <Skeleton className="absolute top-0 left-0 w-full h-full rounded" />
                                        )}
                                    </div>
                                    <div className=" absolute w-full h-full flex bottom-0 right-0  duration-75  sm:sm:hover:translate-x-0 translate-x-12 ">
                                        <div className="absolute bottom-0 right-0 -translate-x-1 -translate-y-1 bg-green-600 bg-opacity-100 rounded-full p-3 sm:hover:scale-105 sm:hover:bg-green-500">
                                            <Play className="w-5 h-5 text-black fill-black" />
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full mt-2 px-2">
                                    {album?.title ? (
                                        <Label className="font-bold text-gray-800 dark:text-gray-300 text-sm">
                                            {truncateTitle(album.title)}
                                        </Label>
                                    ) : (
                                        <Skeleton className="h-4 w-full rounded" />
                                    )}
                                </div>
                            </div>
                        </TouchableOpacity>
                    </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Share link</DialogTitle>
                        <DialogDescription>
                            Anyone who has this link will be able to view this.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="link" className="sr-only">
                                Link
                            </Label>
                            <Input
                                id="link"
                                defaultValue="https://ui.shadcn.com/docs/installation"
                                readOnly
                            />
                        </div>
                        <Button type="submit" size="sm" className="px-3">
                            <span className="sr-only">Copy</span>
                            <Copy />
                        </Button>
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default DialogAlbum