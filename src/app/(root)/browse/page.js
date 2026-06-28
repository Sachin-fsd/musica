import { Skeleton } from '@/components/ui/skeleton';
import Jam from '@/components/friendsJam';
import JamPage from '@/components/friendsJam/jam';
import dynamic from 'next/dynamic';
const AlbumContent = dynamic(() => import('@/components/homePage/TopAlbums/AlbumContent'), {
  loading: () => <Skeleton />,
  ssr: false,
});
import SongContentCarousel from '@/components/homePage/TopSongs/SongContentCarousel';
import Lyrics from '@/components/lyrics/lyrics';
const ModernSearchResult = dynamic(() => import('@/components/newSearchResult/ModernSearchResult'), {
  loading: () => <Skeleton />,
  ssr: false,
});
import { Spinner } from '@/components/ui/spinner';
import { Suspense } from 'react';
import StyledLyrics from '@/components/lyrics/styledLyrics';

const HomePage = () => {

  return (
    <div className=" p-4 md:p-5 mb-20 md:mb-0">
      {/* Top Songs Section */}
      {/* <div className='my-4 flex justify-center'>
        <StyledLyrics />
      </div> */}

      <Suspense fallback={<div><Spinner /></div>}>
        <ModernSearchResult />
      </Suspense>

      {/* <div className='my-4 flex justify-center'>
        <Lyrics />
      </div> */}

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
