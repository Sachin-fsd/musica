import TopAlbums from '@/components/homePage/TopAlbums';
import AlbumCarousel from '@/components/homePage/TopAlbums/AlbumsCarousel';
import TopArtists from '@/components/homePage/TopArtists';
import TopSongs from '@/components/homePage/TopSongs';
import SongBar from '@/components/songBar';
import { Label } from '@/components/ui/label';
import { songs } from '@/utils/cachedSongs';
import { Ellipsis } from 'lucide-react';

const HomePage = () => {

  return (
    <div className="flex-grow bg-gray-100 p-4 md:p-5">

      {/* Top Songs */}

      <div>
        <TopSongs />
      </div>

      {/* Top Albums Section */}
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
