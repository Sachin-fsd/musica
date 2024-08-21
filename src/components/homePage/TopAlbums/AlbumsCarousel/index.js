
import SongBar from "@/components/songBar";
import { Label } from "@/components/ui/label";
import { songs } from "@/utils/cachedSongs";
import AlbumBar from "../AlbumBar";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const AlbumCarousel = () => {

    const moveRight = () => {
        document.getElementById("move").classList.add("-translate-x-40")
    }

    return (
        <div className='flex gap-6'>
            {/* Top Charts Section */}
            <div className='flex-1'>
                <div>
                    <div className='flex items-center justify-between mb-4'>
                        <Label className="text-xl font-bold text-sky-900">Moody Pics</Label>
                    </div>
                    <div>
                        <Button
                            className={"absolute h-8 w-8 rounded-full top-0 left-10 bg-slate-700"} >
                            <ArrowLeft className="h-4 w-4 " />
                            <span className="sr-only">Previous slide</span>
                        </Button>
                    </div>
                </div>
                <div className='flex space-y-4   overflow-x-hidden'>

                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className='p-2 border bg-gray-300 rounded flex-shrink-0  transition-all ' id="move">
                            <AlbumBar song={songs[index]} index={index} />
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default AlbumCarousel;
