'use client'

import React, { useContext } from 'react'
import { UserContext } from "@/context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import SongBar from '../songBar';
import { Separator } from '../ui/separator';
import { decode } from "he";
import Lyrics from '../lyrics/lyrics';


const RightSidebarTabs = () => {
    const { songList, currentSong } = useContext(UserContext);

    return (
        <div className="flex w-full flex-col mt-6">
            <Tabs defaultValue="songlist">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="songlist">Songs</TabsTrigger>
                    <TabsTrigger value="info">Info</TabsTrigger>
                    <TabsTrigger value="lyrics">Lyrics</TabsTrigger>
                </TabsList>
                <TabsContent value="songlist">
                    <div className="">
                        {!songList?.length ? (
                            <p className="text-center text-gray-500">No songs available</p>
                        ) : (
                            songList?.map((song, index) => (
                                <div key={index} className="w-full">
                                    <SongBar song={song} />
                                    {index < songList?.length - 1 && <Separator className="my-2" />}
                                </div>
                            ))
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="info">
                    <div className="space-y-4 text-left p-4">
                        {currentSong ? (
                            <>
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">{currentSong.name}</h3>
                                    <p onClick={() => handleClick(currentSong.album?.name)} className="text-sm text-gray-500 cursor-pointer">{currentSong.album?.name}</p>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Artists</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            {currentSong.artists?.primary?.map((artist, idx) => (
                                                <div key={idx} onClick={() => handleClick(decode(artist.name))} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full pr-3 py-1 cursor-pointer">
                                                    {artist.image?.[0]?.url && (
                                                        <img
                                                            src={artist.image[0].url}
                                                            alt={artist.name}
                                                            className="w-8 h-8 rounded-full object-cover"
                                                        />
                                                    )}
                                                    <span className="text-sm">{decode(artist.name)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {currentSong.artists?.all?.find(a => a.role === 'lyricist') && (
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Lyricist</p>
                                            <div className="flex flex-wrap gap-3">
                                                {currentSong.artists.all.filter(a => a.role === 'lyricist').map((lyricist, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full pr-3 py-1 cursor-pointer">
                                                        {lyricist.image?.[0]?.url && (
                                                            <img
                                                                src={lyricist.image[0].url}
                                                                alt={lyricist.name}
                                                                className="w-8 h-8 rounded-full object-cover"
                                                            />
                                                        )}
                                                        <span className="text-sm">{decode(lyricist.name)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Year</p>
                                        <p className="text-sm mt-1">{currentSong.year}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Duration</p>
                                        <p className="text-sm mt-1">
                                            {Math.floor(currentSong.duration / 60)}:{String(currentSong.duration % 60).padStart(2, '0')}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Language</p>
                                        <p className="text-sm mt-1 capitalize">{currentSong.language}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Label</p>
                                        <p className="text-sm mt-1">{currentSong.label}</p>
                                    </div>

                                    {currentSong.playCount && (
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Plays</p>
                                            <p className="text-sm mt-1">
                                                {new Intl.NumberFormat('en-IN').format(currentSong.playCount)}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {currentSong.copyright && (
                                    <>
                                        <Separator />
                                        <p className="text-xs text-gray-400">{currentSong.copyright}</p>
                                    </>
                                )}
                            </>
                        ) : (
                            <p className="text-center text-gray-500">No song selected</p>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="lyrics">
                    <Lyrics />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default RightSidebarTabs