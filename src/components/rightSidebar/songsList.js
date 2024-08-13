import SongBar from "../songBar";

const SongsListComponent = ({ songsList }) => {
    return (
        <div className="overflow-auto p-1 pb-3 scrollbar-custom">
            {songsList.map((song, index) => (
                <div key={index} className="w-full">
                    <SongBar song={song} index={index} />
                </div>
            ))}
        </div>
    )
}

export default SongsListComponent;
