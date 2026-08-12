import BigPhotoComponent from './bigPhotoComponent';

const RightSidebar = () => {
    return (
        <div
            className="w-full h-full lyrics-scroll rounded-lg p-3 sm:p-4 flex flex-col transition-colors duration-700 "
            style={{
                backgroundImage: `linear-gradient(180deg, var(--song-theme-faint) 0%, transparent 40%)`,
                transition: 'background-color 0.8s ease, background-image 0.8s ease'
            }}
        >
            <div className="song-carousel-container overflow-hidden flex-grow">
                <BigPhotoComponent />
            </div>
        </div>
    );
};

export default RightSidebar;
