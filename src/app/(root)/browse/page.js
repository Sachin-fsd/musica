import JamComponent from '@/components/friendsJam';
// import SearchResults from '@/components/homePage/SearchResult';
import AlbumContent from '@/components/homePage/TopAlbums/AlbumContent';
import SongContent from '@/components/homePage/TopSongs';
import SongContentCarousel from '@/components/homePage/TopSongs/SongContentCarousel';
import dynamic from 'next/dynamic';
const SearchResults = dynamic(() => import("@/components/homePage/SearchResult"), { ssr: false });
const HomePage = () => {

  return (
    <div className="bg-gradient-to-b from-gray-200 to-gray-100 dark:from-slate-950 dark:to-gray-900 p-4 md:p-5 mb-20 md:mb-0 text-gray-900 dark:text-gray-100">
      {/* Top Songs Section */}
      <div id='searchResultsTop'>
        <SearchResults />
      </div>
      {/* <div>
        <SongContent />
      </div> */}

      <div>
        <SongContentCarousel />
      </div>

      {/* Album Content Section */}
      <div>
        <AlbumContent />
      </div>

      <div>
        <JamComponent />
      </div>

    </div>
  );
}

export default HomePage;
