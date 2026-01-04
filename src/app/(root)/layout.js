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
      <div className="grid h-screen w-screen grid-rows-[auto,1fr] grid-cols-[auto,1fr] md:grid-cols-[auto,1fr,auto] sm:max-w-full">

        {/* LeftSidebar shown for medium and large screens */}
        <div className="hidden md:block md:row-span-2">
          <LeftSidebar />
        </div>

        <div className="col-span-2 md:col-span-2">
          <Navbar />
        </div>

        {/* Main content area */}
        <div className="overflow-y-auto overflow-x-hidden col-span-2 md:col-span-1">
          {children}
        </div>

        {/* RightSidebar only for large screens */}
        <div className="hidden lg:block lg:row-span-2 w-full min-w-[20%] max-w-[100%]">
          <RightSidebar />
        </div>

        {/* Bottom Player for small and medium screens */}
        <div className="md:fixed z-10 md:bottom-0 w-full col-span-2 lg:hidden">
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
