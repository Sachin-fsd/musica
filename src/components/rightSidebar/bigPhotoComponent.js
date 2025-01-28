'use client';
import { UserContext } from "@/context";
import { useContext } from "react";
import MainSongPhoto from "./mainSongPhoto/MainSongPhoto";
import SongBar from "../songBar";
import { Separator } from "../ui/separator";

const BigPhotoComponent = () => {
    const { songList, currentSong } = useContext(UserContext);

    return (
        <div className="h-full w-full p-4 shadow-md overflow-auto">
            {/* Container with responsive layout */}
            <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
                {/* Big Photo Section */}
                <div className="flex justify-center lg:w-1/2">
                    {currentSong && currentSong?.image?.[2]?.url ? (
                        <MainSongPhoto
                            src={currentSong.image[2].url}
                            alt={currentSong.name}
                        />
                    ) : (
                        <p className="text-center text-gray-500">No image available</p>
                    )}
                </div>

                {/* Songs List Section */}
                <div className="lg:w-1/2">
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
        </div>
    );
};

export default BigPhotoComponent;
