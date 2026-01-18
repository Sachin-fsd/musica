import { UserContext } from "@/context";
import { useContext } from "react";
import MainSongPhoto from "./mainSongPhoto/MainSongPhoto";
import RightSidebarTabs from "./RightSidebarTabs";

const BigPhotoComponent = () => {

    return (
        <div className="flex flex-col h-full rounded-lg p-4 shadow-md overflow-auto">
            {/* Carousel - takes up a small portion */}
            <div className="rounded text-center">
                <div className="justify-items-center">
                    <MainSongPhoto />
                </div>
                {/* <SongCarousel songs={songList} /> */}
            </div>

            <RightSidebarTabs />
            {/* Songs List - takes up the remaining space */}

        </div>
    );
};

export default BigPhotoComponent;
