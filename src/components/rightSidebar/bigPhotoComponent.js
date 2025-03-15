'use client'
import { UserContext } from "@/context";
import { Slider } from "../ui/slider";
import { useContext } from "react";
import MainSongPhoto from "./mainSongPhoto/MainSongPhoto";
import SongBar from "../songBar";
import { Separator } from "../ui/separator";

const BigPhotoComponent = () => {
    const { currentTime, duration, handleSeek, songList, currentSong, currentIndex } = useContext(UserContext);

    return (
        <div className="flex flex-col h-full rounded-lg p-4 shadow-md overflow-auto">
            {/* Carousel - takes up a small portion */}
            <div className="rounded text-center">
                <div>
                    {currentSong && currentSong?.image?.[2]?.url && (
                        <MainSongPhoto src={currentSong.image[2].url} alt={currentSong.name} />
                    )}
                </div>
                {/* <SongCarousel songs={songList} /> */}
            </div>

            <Separator className="my-2" />

            {/* Songs List - takes up the remaining space */}
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
        </div>
    );
};

export default BigPhotoComponent;
