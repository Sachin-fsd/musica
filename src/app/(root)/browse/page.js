import JamComponent from '@/components/friendsJam';
import AlbumContent from '@/components/homePage/TopAlbums/AlbumContent';
import SongContentCarousel from '@/components/homePage/TopSongs';
import ModernSearchResult from '@/components/newSearchResult/ModernSearchResult';
import { Suspense } from 'react';

const HomePage = () => {

  return (
    <div className=" p-4 md:p-5 mb-20 md:mb-0">
      {/* Top Songs Section */}

      <Suspense fallback={<div>Loading...</div>}>
        <ModernSearchResult />
      </Suspense>

      <div>
        <SongContentCarousel />
      </div>

      <div id='jam_section'>
        <JamComponent />
      </div>

      <div>
        <AlbumContent />
      </div>

    </div>
  );
}

export default HomePage;
