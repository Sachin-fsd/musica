// components/RightSidebar.js

import { Wifi, Speaker } from 'lucide-react';
import Player from './player';
import RightSidebarCarouselSliderList from './RightSidebar-Carousel-SliderList';
import ConnectionStatus from './connectionStatusComponent';

const RightSidebar = () => {
    return (
        <div className="w-full h-full bg-fuchsia-200 rounded-t-lg p-4 flex flex-col">
            <div className="song-carousel-container overflow-hidden flex-grow mb-4">
                <RightSidebarCarouselSliderList />
            </div>
            <div className="flex flex-col gap-4">
                <Player />
                <div className="p-2">
                    <ConnectionStatus />
                </div>
            </div>
        </div>
    );
};

export default RightSidebar;
