import LeftSidebar from "@/components/leftSidebar";
import RightSidebar from "@/components/rightSidebar";
import Navbar from "@/components/navbar";
import UserState from "@/context";
import Bottombar from "@/components/bottomBar";

export default function RootLayout({ children }) {
    return (
        <UserState>
            <div className="flex h-screen w-screen">
                {/* LeftSidebar only for medium and large screens */}
                <div className="hidden md:block">
                    <LeftSidebar />
                </div>

                {/* Sheet for small screens */}
                <div className="block md:hidden">
                    {/* Your Sheet code for small screens */}
                </div>

                <div className="flex flex-col flex-grow">
                    <Navbar />
                    <div className="flex flex-grow overflow-hidden">
                        <div className="flex-grow overflow-y-scroll">
                            {children}
                        </div>
                        {/* RightSidebar only for medium and large screens */}
                        <div className="hidden md:block w-1/4 min-w-[240px]">
                            <RightSidebar />
                        </div>
                    </div>
                </div>

                {/* Bottom Player for small screens */}
                <div className="md:hidden">
                    <Bottombar/>
                </div>
            </div>
        </UserState>
    )
}
