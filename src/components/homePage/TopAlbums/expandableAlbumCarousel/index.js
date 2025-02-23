"use client";
import Image from "next/image";
import React, { useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { Pause, Play } from "lucide-react";
import TouchableOpacity from "@/components/ui/touchableOpacity";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { htmlParser } from "@/utils";
import SongsListComponent from "@/components/rightSidebar/songsList";
import { debounce } from "lodash";
import { fetchAlbumSongs } from "@/utils/playAndFetchSuggestionUtils";

import { UserContext } from "@/context";
import { GetSongsByIdAction } from "@/app/actions";
import SongBar from "@/components/songBar";
import { Separator } from "@/components/ui/separator";

export function ExpandableAlbumCarousel({ albums }) {
    const [active, setActive] = useState(null);
    const [songs, setSongs] = useState([]);
    const id = useId();
    const ref = useRef(null);
    const [loading, setLoading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const { setCurrentAlbum, currentAlbum, currentSong, currentIndex, songList, setSongList, setCurrentIndex, setCurrentSong, setPlaying, setCurrentId } = useContext(UserContext);

    const truncateTitle = (title, maxLength = 24) => {
        return htmlParser(title?.length > maxLength ? `${title?.substring(0, maxLength)}...` : title);
    };

    const memoizedFetchAlbumSongs = useCallback(fetchAlbumSongs, []);

    const handleAlbumPlay = useCallback(debounce((album) => {
        if (album?.id === currentAlbum?.id) {
            setPlaying(false);
            return;
        }
        setCurrentAlbum(album);
        const context = { currentSong, currentIndex, songList, setSongList, setCurrentIndex, setCurrentSong, setPlaying, setCurrentId };
        memoizedFetchAlbumSongs(album?.type, album?.id, context);
    }, 300), [currentAlbum]);


    const handleFetchAlbumSongs = async (album) => {
        setLoading(true);
        try {
            const fetchedSongs = await GetSongsByIdAction(album.type, album.id);
            if (fetchedSongs.success) {
                let albumSongs = fetchedSongs.data.songs || fetchedSongs.data.topSongs || fetchedSongs.data;
                setSongs(albumSongs || []);
                setActive((prev) => ({
                    ...prev,
                    image: fetchedSongs.data.image[2].url,
                    description: fetchedSongs.data.description,
                }));
            } else {
                setSongs([]);
            }
        } catch (error) {
            console.error("Error fetching songs:", error);
            setSongs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        function onKeyDown(event) {
            if (event.key === "Escape") {
                setActive(null);
            }
        }

        if (active && typeof active === "object") {
            handleFetchAlbumSongs(active);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [active]);

    useOutsideClick(ref, () => setActive(null));

    return (<>
        <AnimatePresence>
            {active && typeof active === "object" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm h-full w-full z-10" />
            )}
        </AnimatePresence>
        <AnimatePresence>
            {active && typeof active === "object" ? (
                <div className="fixed inset-0 grid place-items-center z-[100]">
                    <motion.button
                        key={`button-${active.title}-${id}`}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.05 } }}
                        className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white dark:bg-gray-200 rounded-full h-6 w-6 shadow-md"
                        onClick={() => setActive(null)}>
                        <CloseIcon />
                    </motion.button>
                    <motion.div
                        layoutId={`card-${active.title}-${id}`}
                        ref={ref}
                        className="w-full max-w-[500px] h-full md:h-fit flex flex-col bg-white dark:bg-gray-900 sm:rounded-3xl">
                        <motion.div layoutId={`image-${active.title}-${id}`}>
                            <img
                                src={active.image || "/placeholder.png"}
                                alt={active.title}
                                className="flex-none w-full h-80 sm:rounded-t-3xl object-cover"
                                onError={() => setImageError(true)}
                            />
                        </motion.div>

                        <div className="flex flex-1 flex-col">
                            <div className="flex-none flex justify-between items-start p-4">
                                <div>
                                    <motion.h3
                                        layoutId={`title-${active.title}-${id}`}
                                        className="font-medium text-gray-700 dark:text-gray-200 text-base">
                                        {active.title}
                                    </motion.h3>
                                    <motion.p
                                        layoutId={`description-${active.title}-${id}`}
                                        className="text-gray-600 dark:text-gray-400 text-sm">
                                        {htmlParser(active.description)}
                                    </motion.p>
                                </div>

                                <motion.button
                                    onClick={() => handleAlbumPlay(active)}
                                    layout
                                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 sm:hover:bg-green-400 text-white">
                                    {
                                        currentAlbum.id == active.id ? <Pause /> : <Play />
                                    }
                                </motion.button>
                            </div>

                            <div className="flex-1 overflow-hidden px-4 pt-4">
                                <motion.div
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-gray-600 text-xs md:text-sm flex flex-col flex-1 items-start overflow-y-auto max-h-[35vh] dark:text-gray-400">
                                    {loading ? (
                                        "Loading..."
                                    ) : (
                                        songs.map((song, index) => (
                                            <React.Fragment key={index}>
                                                <SongBar song={song} />
                                                <Separator />
                                            </React.Fragment>
                                        ))
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            ) : null}
        </AnimatePresence>
        <div className="mx-auto w-full flex overflow-x-auto gap-4 py-4" style={{ scrollSnapType: 'x mandatory' }}>
            {albums.map((card, index) => (
                <div
                    onClick={() => setActive(card)}
                    key={index}
                    className="mr-1 sm:hover:bg-gray-100 dark:sm:hover:bg-gray-800 rounded-lg shadow-sm min-w-[144px] sm:sm:hover:shadow-md transition">
                    <TouchableOpacity>
                        <motion.div
                            style={{ scrollSnapAlign: 'center' }}
                            layoutId={`card-${card.title}-${id}`}
                            className="relative flex flex-col items-center rounded-lg overflow-hidden w-full cursor-pointer transition-transform transform sm:hover:scale-105">
                            <motion.div className="relative w-full pb-[100%]">
                                <div className="absolute top-0 left-0 w-full h-full">
                                    {card?.image && !imageError ? (
                                        <img
                                            src={card?.image}
                                            alt={`${card?.title} cover`}
                                            className="absolute top-0 left-0 w-full h-full rounded-md object-cover"
                                            onError={() => setImageError(true)}
                                        />
                                    ) : (
                                        <Skeleton className="absolute top-0 left-0 w-full h-full rounded" />
                                    )}
                                </div>
                                <div className=" absolute w-full h-full flex bottom-0 right-0  duration-75  sm:sm:hover:translate-x-0 translate-x-12 ">
                                    <div className="absolute bottom-0 right-0 -translate-x-1 -translate-y-1 bg-green-600 bg-opacity-100 rounded-full p-3 sm:hover:scale-105 sm:hover:bg-green-500">
                                        {
                                            card?.id == currentAlbum?.id ? <Pause className="w-5 h-5 text-black fill-black" /> : <Play className="w-5 h-5 text-black fill-black" />
                                        }
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div className="w-full mt-2 px-2">
                                {card?.title ? (
                                    <Label className="font-bold text-gray-800 dark:text-gray-300 text-sm">
                                        {truncateTitle(card.title)}
                                    </Label>
                                ) : (
                                    <Skeleton className="h-4 w-full rounded" />
                                )}
                            </motion.div>
                        </motion.div>
                    </TouchableOpacity>
                </div>
            ))}
        </div>
    </>);
}

export const CloseIcon = () => (
    <motion.svg
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.05 } }}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 text-black">
        <path d="M18 6L6 18" />
        <path d="M6 6l12 12" />
    </motion.svg>
);
