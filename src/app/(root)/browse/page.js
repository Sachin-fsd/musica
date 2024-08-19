import TopArtists from '@/components/homePage/TopArtists';
import SongBar from '@/components/songBar';
import { Label } from '@/components/ui/label';
import { songs } from '@/utils/cachedSongs';
import { Ellipsis } from 'lucide-react';

const HomePage = () => {

  return (
    <div className="flex-grow bg-gray-100 p-4 md:p-6">
      <div className='flex flex-col md:flex-row gap-6'>
        {/* Top Charts Section */}
        <div className='flex-1'>
          <div className='flex items-center justify-between mb-4'>
            <Label className="text-xl font-bold text-sky-900">Quick picks</Label>
            <Ellipsis className='p-2 border border-gray-300 rounded-full text-gray-600' />
          </div>
          <div className='space-y-4'>
            {Array.from({ length: 4 }).map((_, index) => (
              <div className='bg-gray-500 rounded-lg'>
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
                <SongBar key={index + 4} song={songs[index + 4]} index={index + 4} />
              ))
            ) : null}
          </div>
        </div>
      </div>

      {/* Top Artists Section */}
      {/* <div className="mt-6">
        <TopArtists />
      </div> */}
    </div>
  );
}

export default HomePage;
