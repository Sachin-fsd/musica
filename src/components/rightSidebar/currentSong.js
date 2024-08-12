

const CurrentSong = ({ song }) => {
    return (
        <div className="relative">
            <img src={song.image[song.image.length-1]} alt={song.name} className="rounded-lg w-full h-full object-cover" />
        </div>
    );
};

export default CurrentSong;
