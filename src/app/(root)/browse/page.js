import TopAlbums from '@/components/homePage/TopAlbums';
import AlbumContent from '@/components/homePage/TopAlbums/AlbumContent';
import AlbumCarousel from '@/components/homePage/TopAlbums/AlbumsCarousel';
import TopArtists from '@/components/homePage/TopArtists';
import TopSongs from '@/components/homePage/TopSongs';
import SongBar from '@/components/songBar';
import { Label } from '@/components/ui/label';
import { songs } from '@/utils/cachedSongs';
import { Ellipsis } from 'lucide-react';

const HomePage = () => {
  return (
    // <div className="bg-gray-100 dark:bg-gray-900 p-4 md:p-5 mb-20 md:mb-0 text-gray-900 dark:text-gray-100">
    <div className="bg-gradient-to-b from-gray-200 to-gray-100 dark:from-slate-950 dark:to-gray-900 p-4 md:p-5 mb-20 md:mb-0 text-gray-900 dark:text-gray-100">

      {/* Top Songs Section */}
      <div>
        <TopSongs />
      </div>

      {/* Album Content Section */}
      <div>
        <AlbumContent />
      </div>

      {/* Uncomment sections as needed */}

      {/* <div>
        <TopAlbums />
      </div> */}

      {/* <div className="mt-6">
        <TopArtists />
      </div> */}
    </div>
  );
}

export default HomePage;
