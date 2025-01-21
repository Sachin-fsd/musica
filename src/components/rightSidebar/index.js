import BigPhotoComponent from './bigPhotoComponent';
import Player from './player';

const RightSidebar = () => {
    return (
        <div className="w-full h-full bg-gradient-to-b bg-fuchsia-300 dark:from-slate-950 dark:to-gray-900 rounded-t-lg p-2 pt-0 flex flex-col">
            <div className="song-carousel-container overflow-hidden flex-grow mb-2">
                <BigPhotoComponent />
            </div>
            <div className="flex flex-col gap-4">
                <Player />
                {/* <div className="p-2">
                    <ConnectionStatus />
                </div> */}
            </div>
        </div>
    );
};

export default RightSidebar;
