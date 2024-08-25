import { Menu } from "lucide-react";
import LeftSidebarIcons from "./leftSidebarIcons";

const LeftSidebar = () => {
    return (
        <div
            className="
        flex flex-col  p-4 h-screen justify-center items-center
        bg-white dark:bg-black
        border-r border-gray-200 dark:border-gray-700
        w-16 sm:w-20 md:w-24 lg:w-28
      "
        >
            {/* <div className="flex-shrink-0 cursor-pointer mb-8">
                <Menu className="text-2xl font-bold text-gray-800 dark:text-gray-100" />
            </div> */}
            <div className="flex-grow flex flex-col items-center space-y-6">
                <LeftSidebarIcons />
            </div>
        </div>
    );
};

export default LeftSidebar;
