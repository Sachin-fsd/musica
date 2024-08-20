import AlbumCarousel from '@/components/homePage/AlbumsCarousel';
import TopArtists from '@/components/homePage/TopArtists';
import SongBar from '@/components/songBar';
import { Label } from '@/components/ui/label';
import { songs } from '@/utils/cachedSongs';
import { Ellipsis } from 'lucide-react';

const HomePage = () => {

  return (
    <div className="flex-grow bg-gray-100 p-4 md:p-5">
      <div className='flex flex-col lg:flex-row gap-6'>
        {/* Top Charts Section */}
        <div className='flex-1'>
          <div className='flex items-center justify-between mb-4'>
            <Label className="text-xl font-bold text-sky-900">Quick picks</Label>
            <Ellipsis className='p-2 border border-gray-300 rounded-full text-gray-600' />
          </div>
          <div className='space-y-4'>
            {Array.from({ length: 4 }).map((_, index) => (
              <div className='p-2 border bg-gray-300 rounded'>
                <SongBar key={index} song={songs[index]} index={index} />
              </div>
            ))}
          </div>
        </div>

        {/* Listen Again Section */}
        <div className='flex-1'>
          <div className='flex items-center justify-between mb-4'>
            <Label className="text-xl font-bold text-sky-900">For You</Label>
            <Ellipsis className='p-2 border border-gray-300 rounded-full text-gray-600' />
          </div>
          <div className='space-y-4'>
            {songs.length >= 8 ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div className='p-2 border bg-gray-300 rounded'>
                  <SongBar key={index + 4} song={songs[index + 4]} index={index + 4} />
                </div>
              ))
            ) : null}
          </div>
        </div>
      </div>

      {/* Top Artists Section */}
      {/* <div className='my-6 pb-14 md:pb-6 bg-red-300'>
        <div>
          <Label className="text-xl font-bold text-sky-900">Top Albums</Label>
        </div>
        <div className='my-4 mb-14 md:mb-4 '>
          <AlbumCarousel />
        </div>
      </div> */}

      
      {/* <div className="mt-6">
        <TopArtists />
      </div> */}
    </div>
  );
}

export default HomePage;
