import LeftSidebar from "@/components/leftSidebar";
import RightSidebar from "@/components/rightSidebar";
import Navbar from "@/components/navbar";
import UserState from "@/context";
import Bottombar from "@/components/bottomBar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function RootLayout({ children }) {
  return (
    <AuroraBackground>
      <UserState>
        <div className="grid h-screen w-screen grid-rows-[auto,1fr] grid-cols-[auto,1fr] lg:grid-cols-[auto,1fr,auto] sm:max-w-full">

          {/* LeftSidebar shown for large screens */}
          <div className="hidden lg:block lg:row-span-2">
            <LeftSidebar />
          </div>

          {/* Navbar spanning the top row */}
          <div className="col-span-2 lg:col-span-2">
            <Navbar />
          </div>

          {/* Content Area with Resizable Panels for large screens */}
          <ResizablePanelGroup direction="horizontal" className="hidden lg:flex overflow-hidden">
            <ResizablePanel defaultSize={70} className="h-full overflow-hidden">
              {/* Main content area */}
              <div className="overflow-y-auto h-full">
                {children}
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={30} className="h-full overflow-hidden">
              {/* RightSidebar for large screens */}
              <div className="h-full overflow-y-auto">
                <RightSidebar />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>

          {/* Main Content Area for small and medium screens */}
          <div className="lg:hidden col-span-2 md:col-span-1 overflow-y-auto h-full">
            {children}
          </div>

          {/* Bottom Player for small and medium screens */}
          <div className="lg:hidden fixed bottom-0 w-full col-span-2">
            <Bottombar />
          </div>
        </div>
      </UserState>
    </AuroraBackground>
  );
}
