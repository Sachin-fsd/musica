import JamComponent from '@/components/friendsJam';
import AlbumContent from '@/components/homePage/TopAlbums/AlbumContent';
import SongContentCarousel from '@/components/homePage/TopSongs/SongContentCarousel';
import dynamic from 'next/dynamic';
const SearchResults = dynamic(() => import("@/components/homePage/SearchResult"), { ssr: false });
const HomePage = () => {

  return (
    <div className="bg-gradient-to-b from-gray-200 to-gray-100 dark:from-[#100023] dark:to-[#100023] p-4 md:p-5 mb-20 md:mb-0 text-gray-900 dark:text-gray-100">
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

      <div id='jam_section'>
        <JamComponent />
      </div>

      {/* Album Content Section */}
      <div>
        <AlbumContent />
      </div>

    </div>
  );
}

export default HomePage;
