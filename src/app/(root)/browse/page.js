import Jam from '@/components/friendsJam';
import AlbumContent from '@/components/homePage/TopAlbums/AlbumContent';
import ModernSearchResult from '@/components/newSearchResult/ModernSearchResult';
import { Spinner } from '@/components/ui/spinner';
import { Suspense } from 'react';
import Greeting from '@/components/homePage/Greeting';
import MusicSections from '@/components/homePage/MusicSections';

const HomePage = () => {

  return (
    <div className=" p-4 md:p-5 mb-20 md:mb-0">
      <div className="px-4 max-w-3xl mx-auto pt-2 pb-6">
        <Greeting />
      </div>

      <ModernSearchResult />

      <MusicSections />

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
