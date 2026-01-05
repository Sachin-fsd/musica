import LeftSidebarIcons from "./leftSidebarIcons";

const LeftSidebar = () => {
    return (
        <div className="flex flex-col p-4 pt-10 h-full justify-center items-center w-12 sm:w-16 md:w-16 lg:w-20">
            <div className="flex-grow flex flex-col items-center">
                <LeftSidebarIcons />
            </div>
        </div>
    );
};

export default LeftSidebar;
