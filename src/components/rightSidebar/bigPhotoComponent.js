'use client'
import { UserContext } from "@/context";
import { Slider } from "../ui/slider";
import { useContext } from "react";
import MainSongPhoto from "./mainSongPhoto/MainSongPhoto";
import SongBar from "../songBar";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useRouter } from "next/navigation";
import { decode } from "he";
import RightSidebarTabs from "./RightSidebarTabs";

const BigPhotoComponent = () => {
    const router = useRouter();

    const { currentTime, duration, handleSeek, songList, currentSong, currentIndex } = useContext(UserContext);
    function handleClick(name) {
        const url = `/browse?query=${encodeURIComponent(name)}`;
        router.push(url, { scroll: false });
    }
    return (
        <div className="flex flex-col h-full rounded-lg p-4 shadow-md overflow-auto">
            {/* Carousel - takes up a small portion */}
            <div className="rounded text-center">
                <div className="justify-items-center">
                    {currentSong && currentSong?.image?.[2]?.url && (
                        <MainSongPhoto src={currentSong.image[2].url} alt={currentSong.name} />
                    )}
                </div>
                {/* <SongCarousel songs={songList} /> */}
            </div>

            <RightSidebarTabs />
            {/* Songs List - takes up the remaining space */}

        </div>
    );
};

export default BigPhotoComponent;
