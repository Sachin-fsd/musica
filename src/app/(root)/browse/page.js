import Jam from '@/components/friendsJam';
import JamPage from '@/components/friendsJam/jam';
import AlbumContent from '@/components/homePage/TopAlbums/AlbumContent';
import SongContentCarousel from '@/components/homePage/TopSongs/SongContentCarousel';
import Lyrics from '@/components/lyrics/lyrics';
import ModernSearchResult from '@/components/newSearchResult/ModernSearchResult';
import { Spinner } from '@/components/ui/spinner';
import { Suspense } from 'react';

const HomePage = () => {

  return (
    <div className=" p-4 md:p-5 mb-20 md:mb-0">
      {/* Top Songs Section */}

      <Suspense fallback={<div><Spinner /></div>}>
        <ModernSearchResult />
      </Suspense>

      <div className='my-4 flex justify-center'>
        <Lyrics />
      </div>

      <div>
        <SongContentCarousel />
      </div>

      <div id='jam_section'>
        <Jam />
      </div>

      <div>
        <AlbumContent />
      </div>

    </div>
  );
}

export default HomePage;
