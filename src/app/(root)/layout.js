import LeftSidebar from "@/components/leftSidebar";
import RightSidebar from "@/components/rightSidebar";
import Navbar from "@/components/navbar";
import UserState from "@/context";
import Bottombar from "@/components/bottomBar";

export default function RootLayout({ children }) {
    return (
        <UserState>
            {/* 
            
            <div className="max-w-full h-screen overflow-hidden flex flex-col">
          <Navbar />
          <div className="flex flex-grow overflow-hidden">
            <div className="hidden md:block">
              <LeftSidebar />
            </div>
            <div className="flex-grow overflow-y-auto overflow-x-hidden">
              {children}
            </div>
            <div className="hidden md:block w-1/4 min-w-[240px]">
              <RightSidebar />
            </div>
          </div>
          <div className="md:hidden fixed bottom-0 w-full">
            <Bottombar />
          </div>
        </div>

            */}
            <div className="flex h-screen w-screen sm:max-w-full flex-grow overflow-hidden">
                {/* LeftSidebar only for medium and large screens */}
                <div className="hidden md:block">
                    <LeftSidebar />
                </div>

                <div className="flex flex-col flex-grow w-full">
                    <Navbar />
                    <div className="flex flex-grow overflow-hidden">
                        <div className="flex-grow overflow-y-auto overflow-x-hidden">
                            {children}
                        </div>
                        {/* RightSidebar only for medium and large screens */}
                        <div className="hidden md:block w-1/5 flex-grow min-w-[20%]">
                            <RightSidebar />
                        </div>
                    </div>
                </div>

                {/* Bottom Player for small screens */}
                <div className=" md:hidden w-full fixed bottom-0 min-w-full flex-grow z-20">
                    <Bottombar />
                </div>
            </div>
        </UserState>
    )
}
