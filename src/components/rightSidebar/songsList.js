import SongBar from "../songBar";
import { Separator } from "../ui/separator";
// import { ScrollArea } from "../ui/scroll-area";

const SongsListComponent = ({ songsList }) => {
    return (
        <div className="overflow-auto p-1 pb-3">
            {songsList.map((song, index) => (
                <div key={index} className="w-full">
                    <SongBar song={song} index={index} />
                    <Separator />
                </div>
            ))}
        </div>
    )
}

export default SongsListComponent;
