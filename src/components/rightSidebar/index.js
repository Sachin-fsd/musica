import { Download, Play, Repeat, StepBack, StepForward, Wifi, Speaker } from 'lucide-react';
import { Slider } from '../ui/slider';
import SongCarousel from './songCarousel';
import { Button } from '../ui/button';
import SongsList from './songsList';
import Player from './player';
import RightSidebarCarouselSliderList from './RightSidebar-Carousel-SliderList';
import { useContext } from 'react';
import { UserContext } from '@/context';


const RightSidebar = () => {
    
    return (
        <div className="w-1/4 h-full bg-fuchsia-200 rounded-s-lg p-4 flex flex-col justify-between">
            <div className="song-carousel-container overflow-hidden flex-grow">
                <RightSidebarCarouselSliderList />
            </div>
            <div className="">
                <Player />
                <div className="p-2 mt-2">
                    <div className="flex p-3 justify-between items-center text-white bg-purple-800 rounded-xl">
                        <Wifi className='size-5' />
                        <p className="text-xs">Connection Status</p>
                        <Speaker className='size-5' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RightSidebar;
