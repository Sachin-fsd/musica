import LeftSidebarIcons from "./leftSidebarIcons";

const LeftSidebar = () => {
    return (
        <div
            className="
        flex flex-col  p-4 pt-10 h-screen justify-center items-center
        bg-white dark:bg-[#100023]
        
        w-16 sm:w-20 md:w-20 lg:w-24
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
