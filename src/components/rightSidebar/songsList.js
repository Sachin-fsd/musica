import SongBar from "../songBar";
import { Separator } from "../ui/separator";
// import { ScrollArea } from "../ui/scroll-area";

const SongsListComponent = ({ songList }) => {
    return (
        <div className="overflow-auto p-1 pb-3">
            {songList.map((song, index) => (
                <div key={index} className="w-full">
                    <SongBar song={song}/>
                    <Separator />
                </div>
            ))}
        </div>
    )
}

export default SongsListComponent;
