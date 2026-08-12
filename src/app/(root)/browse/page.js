import Jam from '@/components/friendsJam';
import AlbumContent from '@/components/homePage/TopAlbums/AlbumContent';
import ModernSearchResult from '@/components/newSearchResult/ModernSearchResult';
import { Spinner } from '@/components/ui/spinner';
import { Suspense } from 'react';
import MusicSections from '@/components/homePage/MusicSections';
import HeroSection from '@/components/homePage/HeroSection';

const HomePage = () => {

  return (
    <div>
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
