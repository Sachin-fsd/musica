import SongBar from '@/components/songBar';
import { Label } from '@/components/ui/label';
import { songs } from '@/utils/cachedSongs';
import { Ellipsis } from 'lucide-react';

const HomePage = () => {

  return (
    <div className="flex-grow bg-white p-8">
      <div className='flex flex-col md:flex-row justify-between items-start gap-5'>
        <div className='flex-1 w-full md:w-auto'>
          <div className='flex justify-between items-center'>
            <Label className="p-2 text-lg text-sky-900 font-bold">Top Charts</Label>
            <Ellipsis className='p-1 border rounded-xl opacity-50'/>
          </div>
          <div>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index}>
                <SongBar song={songs[index]} index={index}/>
              </div>
            ))}
          </div>
        </div>
        <div className='flex-1 w-full md:w-auto p-2'>
          <div className='flex justify-between items-center'>
            <Label className="p-2 text-lg text-sky-900 font-bold">Listen Again</Label>
            <Ellipsis className='p-1 border rounded-xl opacity-50'/>
          </div>
          <div>
            {songs.length >= 8 ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index}>
                  <SongBar song={songs[index + 4]} index={index + 4}/>
                </div>
              ))
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
