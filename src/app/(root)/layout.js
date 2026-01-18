import LeftSidebar from "@/components/leftSidebar";
import RightSidebar from "@/components/rightSidebar";
import Navbar from "@/components/navbar";
import UserState from "@/context";
import Bottombar from "@/components/bottomBar";
import BottomNavBar from "@/components/bottomNavBar/BottomNavBar";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function RootLayout({ children }) {
  return (
    <UserState>
      <div className="grid h-all w-screen grid-rows-[auto,1fr] overflow-hidden">

        {/* Navbar spans full width */}
        <div className="col-span-full">
          <Navbar />
        </div>

        {/* Content area with sidebars */}
        <div className="grid grid-cols-[auto,1fr] md:grid-cols-[auto,1fr] lg:grid-cols-[auto,1fr,auto] overflow-hidden">
          
          {/* LeftSidebar - starts below navbar */}
          <div className="hidden md:block max-w-28 overflow-y-auto">
            <LeftSidebar />
          </div>

          {/* Main content area */}
          <div className="overflow-y-auto overflow-x-hidden col-span-2 md:col-span-1">
            {children}
          </div>

          {/* RightSidebar - starts below navbar */}
          <div className="hidden lg:block w-80 overflow-y-auto">
            <RightSidebar />
          </div>
        </div>

        {/* Bottom Player for small and medium screens */}
        <div className="md:fixed z-10 md:bottom-0 w-full lg:hidden">
          <Suspense fallback={<div><Spinner /></div>}>
            <Bottombar />
          </Suspense>

          <div className="md:hidden">
            <BottomNavBar />
          </div>
        </div>
      </div>
    </UserState>
  );
}