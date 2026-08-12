import LeftSidebar from "@/components/leftSidebar";
import RightSidebar from "@/components/rightSidebar";
import Navbar from "@/components/navbar";
import UserState from "@/context";
import Bottombar from "@/components/bottomBar";
import BottomNavBar from "@/components/bottomNavBar/BottomNavBar";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { AuthProvider } from "@/context/AuthContext";
import ThemeColorWatcher from "@/components/ThemeColorWatcher";

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <UserState>
        <ThemeColorWatcher />
        <div className="grid h-screen w-screen grid-rows-[auto,1fr] overflow-hidden relative bg-slate-50 dark:bg-[#080611] transition-colors duration-700">

          {/* Site-wide ambient aura — mild dynamic glow from the playing song */}
          <div
            className="pointer-events-none absolute inset-0 z-0 opacity-50 dark:opacity-30"
            style={{
              background: `radial-gradient(ellipse at 50% -20%, var(--song-theme-soft) 0%, transparent 60%),
                           radial-gradient(ellipse at 100% 100%, var(--song-theme-faint) 0%, transparent 55%)`,
              transition: 'background 0.8s ease'
            }}
          />

          {/* Navbar spans full width */}
          <div className="col-span-full z-20">
            <Navbar />
          </div>

          {/* Content area with sidebars */}
          <div className="grid grid-cols-[auto,1fr] md:grid-cols-[auto,1fr] lg:grid-cols-[auto,1fr,auto] overflow-hidden relative">

            {/* LeftSidebar - starts below navbar. Width is controlled by
                LeftSidebar itself (collapsed vs expanded), so this wrapper
                just needs to not clip it and not grow (flex-shrink-0). */}
            <div className="hidden md:block flex-shrink-0 overflow-y-auto">
              <LeftSidebar />
            </div>

            {/* Main content area */}
            <div className="overflow-y-auto overflow-x-hidden col-span-2 md:col-span-1 pb-36 md:pb-28">
              {children}
            </div>

            {/* RightSidebar - optional */}
            {/* <div className="hidden lg:block w-80 overflow-y-auto">
              <RightSidebar />
            </div> */}
          </div>

          {/* Floating Player Component */}
          <Suspense fallback={<div className="fixed bottom-4 left-1/2 -translate-x-1/2"><Spinner /></div>}>
            <Bottombar />
          </Suspense>

          {/* Fixed Mobile Bottom Navigation Bar */}
          <div className="fixed bottom-0 left-0 right-0 z-50 px-2 md:hidden">
            <BottomNavBar />
          </div>

        </div>
      </UserState>
    </AuthProvider>
  );
}