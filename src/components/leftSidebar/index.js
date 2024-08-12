import LeftSidebarIcons from "./leftSidebarIcons";

const LeftSidebar = () => {
    return (
        <div className="flex flex-col p-4 h-screen bg-gradient-to-r from-slate-100 to-white
                        w-1/10 sm:w-1/12 md:w-1/14 lg:w-1/16 min-w-[50px]">
            <div className="flex-shrink-0 cursor-pointer">
                <p className="font-semibold">Musi<span className="text-slate-700">ca</span></p>
            </div>
            <div className="flex-grow flex items-center">
                <LeftSidebarIcons />
            </div>
        </div>
    );
};

export default LeftSidebar;
