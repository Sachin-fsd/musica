import MainSongPhoto from "./mainSongPhoto/MainSongPhoto";
import RightSidebarTabs from "./RightSidebarTabs";

const BigPhotoComponent = () => {

    return (
        <div className="flex flex-col md:flex-row h-full gap-4 overflow-auto md:overflow-hidden">
            <div className="basis-[42%] shrink-0 flex justify-center items-center">
                <MainSongPhoto />
            </div>

            <div className="flex-1 min-w-0 px-1 overflow-visible md:overflow-auto">
                <RightSidebarTabs />
            </div>
        </div>
    );
};

export default BigPhotoComponent;
