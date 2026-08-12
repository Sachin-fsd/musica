import BigPhotoComponent from './bigPhotoComponent';
import Player from './player';

const RightSidebar = () => {
    return (
        <div
            className="w-full h-full rounded-t-lg p-2 pt-0 flex flex-col transition-colors duration-700 bg-slate-50 dark:bg-slate-950"
            style={{
                backgroundImage: `linear-gradient(180deg, var(--song-theme-faint) 0%, transparent 40%)`,
                transition: 'background-color 0.8s ease, background-image 0.8s ease'
            }}
        >
            <div className="song-carousel-container overflow-hidden flex-grow mb-2">
                <BigPhotoComponent />
            </div>
            <div className="flex flex-col gap-4">
                <Player />
            </div>
        </div>
    );
};

export default RightSidebar;
