'use client'

import { leftIcons } from "@/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdjustSongQuality from "../AdjustSongQuality";
import InstallPromptIcon from "../installApp/installPrompt";
import JamOnOff from "../jamOnOff";
import { ThemeSwitch } from "@/components/themeSwitch";
import React from "react";

const LeftSidebarIcons = ({ setIsSheetOpen }) => {
    const pathname = usePathname();
    return (
        <div className="flex flex-col items-center w-full">
            <div className="flex flex-col items-centre space-y-4">
                {leftIcons.map((icon) => (
                    <Link
                        onClick={setIsSheetOpen ? ()=>setIsSheetOpen(false) : null}
                        key={icon.label}
                        href={icon.link}
                        className={`flex md:flex-col items-center w-full p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-transform duration-200 ease-in-out group ${
                            pathname === icon.link ? 'bg-slate-300 dark:bg-slate-700' : ''
                        }`}
                    >
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-white group-hover:text-slate-900 dark:group-hover:text-slate-300 ${
                            pathname === icon.link ? 'text-white' : ''
                        }`}>
                            {React.cloneElement(icon.image, {
                                fill: pathname === icon.link ? "currentColor" : "none",
                                stroke: pathname === icon.link ? "none" : "currentColor"
                            })}
                        </div>
                        <span
                            className={`flex-1 text-center md:text-left md:text-xs text-white group-hover:text-slate-900 dark:group-hover:text-slate-300 font-bold ${
                                pathname === icon.link ? 'text-white' : ''
                            }`}
                        >
                            {icon.label}
                        </span>
                    </Link>
                ))}
                <AdjustSongQuality setIsSheetOpen={setIsSheetOpen}/>
                <InstallPromptIcon />
                <JamOnOff setIsSheetOpen={setIsSheetOpen}/>
                <ThemeSwitch />
            </div>
        </div>
    );
};

export default LeftSidebarIcons;
