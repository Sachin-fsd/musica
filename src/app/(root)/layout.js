import LeftSidebar from "@/components/leftSidebar";
import RightSidebar from "@/components/rightSidebar";
import Navbar from "@/components/navbar";
import UserState from "@/context";
import Bottombar from "@/components/bottomBar";
import { usePlayRandomSong } from "@/context/playRandomSong";

export default function RootLayout({ children }) {
  return (
    <UserState>
      <div className="grid h-screen w-screen grid-rows-[auto,1fr] grid-cols-[auto,1fr,auto] sm:max-w-full">

        {/* LeftSidebar only for medium and large screens */}
        <div className="hidden md:block md:row-span-2">
          <LeftSidebar />
        </div>

        {/* Navbar spanning the top row */}
        <div className="col-span-3 md:col-span-2">
          <Navbar />
        </div>

        {/* Main content area */}
        <div className="overflow-y-auto overflow-x-hidden col-span-3 md:col-span-1">
          {children}
        </div>

        {/* RightSidebar only for medium and large screens */}
        <div className="hidden md:block md:row-span-2 w-full min-w-[20%] max-w-[95%]">
          <RightSidebar />
        </div>

        {/* Bottom Player for small screens */}
        <div className="md:hidden fixed bottom-0 w-full col-span-3">
          <Bottombar />
        </div>
      </div>
    </UserState>
  );
}
