import { Label } from "@/components/ui/label"
import AlbumCarousel from "./AlbumsCarousel"

const TopAlbums = () => {
    return (
        <div className='my-6 pb-14 md:pb-6'>
            <div>
                <Label className="text-xl font-bold ">Top Albums</Label>
            </div>
            <div className='my-4'>
                <AlbumCarousel />
            </div>
        </div>
    )
}

export default TopAlbums