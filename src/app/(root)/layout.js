import LeftSidebar from "@/components/leftSidebar";
import RightSidebar from "@/components/rightSidebar";
import Navbar from "@/components/navbar";
import UserState from "@/context";

export default function RootLayout({ children }) {
    return (
        <UserState> {/* userContext that stores information of song */}
            <div className="flex h-screen">
                <LeftSidebar />
                <div className="flex flex-col flex-grow">
                    <Navbar />
                    <div className="flex flex-grow overflow-hidden">
                        {/* Wrapping children in a div to manage scrolling */}
                        <div className="flex-grow overflow-y-scroll">
                            {children}
                        </div>
                        <RightSidebar className="w-1/4 min-w-[240px]" />
                    </div>
                </div>
            </div>
        </UserState>
    );
}
