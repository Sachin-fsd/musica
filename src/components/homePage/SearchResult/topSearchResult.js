import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useCallback, useContext, useState } from "react";
import { UserContext } from "@/context";
import { createPlaylistFromEntity, createPlaylistFromSuggestions } from "@/utils/playListUtils";
import { Disc3, Loader, Music, Play, User } from "lucide-react";
import { GetSongsByIdAction } from "@/app/actions";

const TopSearchResult = ({ topQuery }) => {
    // ✅ Move the condition to the very top, before any hooks
    if (!topQuery?.results?.length) return null;

    // ✅ Now it's safe to use hooks because we know we're rendering
    const [isLoading, setIsLoading] = useState(false);

    const {
        songList,
        currentSong,
        setSongList,
        setCurrentIndex,
        setCurrentSong,
        setPlaying,
        setCurrentId
    } = useContext(UserContext);

    const result = topQuery.results[0];
    const { id, title, image, type, description } = result;
    const imageUrl = image?.[2]?.url || image?.[1]?.url || "/favicon.png";

    const typeIcons = {
        song: <Music className="text-blue-500 text-xl" />,
        artist: <User className="text-green-500 text-xl" />,
        album: <Disc3 className="text-purple-500 text-xl" />,
    };

    const handleResultClick = useCallback(async () => {
        setIsLoading(true);

        try {
            if (type === 'album' || type === 'artist') {
                const entityResult = await createPlaylistFromEntity(type, id);
                if (entityResult) {
                    setSongList(entityResult.playlist);
                    setCurrentSong(entityResult.songToPlay);
                    setCurrentId(entityResult.songToPlay.id);
                    setCurrentIndex(0);
                    setPlaying(true);
                }
            } else if (type === 'song') {
                let songData = { ...result };

                if (!songData.downloadUrl) {
                    const res = await GetSongsByIdAction("song", songData.id);
                    if (res.success && res.data?.[0]) {
                        songData = res.data[0];
                    } else {
                        throw new Error("Failed to fetch song details.");
                    }
                }

                const newPlaylist = await createPlaylistFromSuggestions(songData, songList);
                setSongList([songData,...newPlaylist]);
                setCurrentSong(songData);
                setCurrentId(songData.id);
                setCurrentIndex(0);
                setPlaying(true);
            }
        } catch (error) {
            console.error("Failed to handle click:", error);
            setPlaying(false);
        } finally {
            setIsLoading(false);
        }
    }, [
        type,
        id,
        result,
        songList,
        setSongList,
        setCurrentSong,
        setCurrentId,
        setCurrentIndex,
        setPlaying
    ]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full flex justify-center my-4"
        >
            <div onClick={handleResultClick} className="cursor-pointer">
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
                            <h3 className={`text-lg font-semibold ${currentSong?.id === id ? "font-bold text-green-500" : ""} truncate`}>
                                {title}
                            </h3>
                        </div>
                        <p className="text-sm text-gray-300 mt-1">{description}</p>
                        <Badge className="mt-2 bg-blue-600 text-white px-2 py-1 text-xs flex items-center gap-1 justify-between">
                            {isLoading ? <Loader className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                            {type.toUpperCase()}
                        </Badge>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
};

export default TopSearchResult;