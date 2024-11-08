import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { UserContext } from "@/context";
import { useCallback, useContext, useState } from "react";
import { debounce } from "lodash";
import { playAndFetchSuggestions } from "@/utils/playAndFetchSuggestionUtils";
import { Play } from "lucide-react";
import { decodeHtml } from "@/utils";

const SongBarCarousel = ({ song, index }) => {
    const { currentSong, currentIndex, songList, setSongList, setCurrentIndex, setCurrentSong, setPlaying, setCurrentId, currentId, setLoading } = useContext(UserContext);
    const [imageError, setImageError] = useState(false);

    const truncateTitle = (title, maxLength = 15) => {
        let result = title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
        return decodeHtml(result);
    };

    const handlePlayClick = useCallback(
        debounce(async () => {
            setLoading(true);
            try {
                const context = { setCurrentIndex, currentIndex, setSongList, songList, setCurrentSong, setPlaying, setCurrentId, currentSong };
                await playAndFetchSuggestions(song, context);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }, 300),
        [song, currentIndex, songList]
    );

    const imageUrl = song.image && song.image[1]?.url; // Verify if the image URL exists

    return (
        <div
            className="relative flex flex-col items-center border p-1 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden w-full cursor-pointer transition-transform transform hover:scale-101"
            onClick={handlePlayClick}
        >
            <div className="relative w-full pb-[100%]">
                <div className="absolute top-0 left-0 w-full h-full transition-opacity duration-300 hover:opacity-80">
                    {imageUrl && !imageError ? (
                        <img
                            src={imageUrl}
                            alt={`${song.name} cover`}
                            loading="lazy"
                            className="absolute top-0 left-0 w-full h-full rounded-md object-cover"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <Skeleton className="absolute top-0 left-0 w-full h-full rounded" />
                    )}
                </div>
                {/* Play button overlay */}
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100">
                    <div className="bg-black bg-opacity-50 rounded-full p-2">
                        <Play className="w-8 h-8 text-white" />
                    </div>
                </div>
            </div>
            <div className="w-full text-center mt-2 px-2">
                {song.name ? (
                    <Label className={`font-bold text-gray-800 dark:text-gray-300 ${song.id === currentSong.id ? " dark:text-green-700 text-green-700" : ""} truncate text-sm`}>
                        {truncateTitle(song.name)}
                    </Label>
                ) : (
                    <Skeleton className="h-4 w-full rounded" />
                )}
            </div>
        </div>
    );
};

export default SongBarCarousel;