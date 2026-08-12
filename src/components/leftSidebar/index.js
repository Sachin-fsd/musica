'use client'

import { useEffect } from "react";
import LeftSidebarIcons from "./leftSidebarIcons";
import { useSidebarStore } from "@/store/useSidebarStore";

const LeftSidebar = () => {
    const collapsed = useSidebarStore((state) => state.collapsed);

    // Pull in the persisted choice after mount (see useSidebarStore for why).
    useEffect(() => {
        useSidebarStore.persist.rehydrate();
    }, []);

    return (
        <div
            className={`flex flex-col h-full pt-6 pb-4 transition-[width] duration-200 ease-in-out ${
                collapsed ? "w-20 px-2 items-center" : "w-60 px-3 items-stretch"
            }`}
        >
            <div className="flex-grow flex flex-col w-full overflow-y-auto overflow-x-hidden">
                <LeftSidebarIcons collapsed={collapsed} />
            </div>
        </div>
    );
};

export default LeftSidebar;
