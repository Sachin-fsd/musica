import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useCallback, useContext } from "react";
import { debounce } from "lodash";
import { UserContext } from "@/context";
import { fetchAlbumSongs } from "@/utils/playAndFetchSuggestionUtils";
import { Disc3, Music, Play, User } from "lucide-react";

const TopSearchResult = ({ topQuery}) => {
    if (!topQuery?.results?.length) return null;

    const result = topQuery.results[0];
    const { id, title, image, type, description } = result;
    const imageUrl = image?.[1]?.url || "/favicon.png"; // Prevent errors

    const {
        currentSong, currentIndex, songList,
        setSongList, setCurrentIndex, setCurrentSong, setPlaying, setCurrentId, audioRef
    } = useContext(UserContext);

    // Type icons mapping
    const typeIcons = {
        song: <Music className="text-blue-500 text-xl" />,
        artist: <User className="text-green-500 text-xl" />,
        album: <Disc3 className="text-purple-500 text-xl" />,
    };

    // Remove the global debounce function and define it inside handleAlbumPlay
const handleAlbumPlay = useCallback(() => {
    debounce(() => {
        fetchAlbumSongs(type, id, {
            currentSong, currentIndex, songList,
            setSongList, setCurrentIndex, setCurrentSong, setPlaying, setCurrentId,audioRef
        });
    }, 200)(); // Immediately invoke debounce
}, [topQuery, currentSong, currentIndex, songList, setSongList, setCurrentIndex, setCurrentSong, setPlaying, setCurrentId]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full flex justify-center my-4"
        >
            <div onClick={handleAlbumPlay} className="cursor-pointer">
                <Card className="flex items-center gap-4 p-4 max-w-lg bg-gray-900 text-white rounded-lg shadow-lg hover:shadow-xl transition-all">
                    <img
                        src={imageUrl}
                        alt={title}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                    />
                    <CardContent className="p-0 flex-1">
                        <div className="flex items-center gap-2">
                            {typeIcons[type] || <Music className="text-gray-400 text-xl" />}
                            <h3 className={`text-lg font-semibold  ${currentSong?.id === id ? "font-bold dark:text-green-600 text-green-700" : ""} truncate`}>{title}</h3>
                        </div>
                        <p className="text-sm text-gray-300 mt-1">{description}</p>
                        <Badge className="mt-2 bg-blue-600 text-white px-2 py-1 text-xs flex items-center gap-1 justify-between">
                            <Play className="w-3 h-3" /> {type.toUpperCase()}
                        </Badge>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
};

export default TopSearchResult;