
import SongBar from "../songBar";

const SongsListComponent = ({ songsList }) => {
    
    return (
        <div className="h-40 overflow-auto scrollbar-hide p-1 pb-3">
            {songsList.map((song, index) => (
                <div key={index}>
                    <SongBar song={song} index={index}/>
                </div>
            ))}
        </div>
    )
}

export default SongsListComponent;
