import Jam from '@/components/friendsJam';
import AlbumContent from '@/components/homePage/TopAlbums/AlbumContent';
import ModernSearchResult from '@/components/newSearchResult/ModernSearchResult';
import { Spinner } from '@/components/ui/spinner';
import { Suspense } from 'react';
import Greeting from '@/components/homePage/Greeting';
import MusicSections from '@/components/homePage/MusicSections';
import HeroSection from '@/components/homePage/HeroSection';

const HomePage = () => {

  return (
    <div className=" p-4 md:p-5 mb-20 md:mb-0">
      <HeroSection />

      <Suspense fallback={<Spinner className="w-auto text-center" />}>
        <ModernSearchResult />
      </Suspense>

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
