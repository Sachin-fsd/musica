import SongBar from "../songBar";
import { Separator } from "../ui/separator";

const SongsListComponent = ({ songList }) => {
    return (
        <div className="overflow-auto p-1 pb-3 ">
            {songList.map((song, index) => (
                <div key={index} className="w-full ">
                    <SongBar song={song}/>
                    {index < songList.length - 1 && <Separator className="my-2" />} 
                </div>
            ))}
        </div>
    );
};

export default SongsListComponent;
