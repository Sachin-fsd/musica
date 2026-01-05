'use client'

import { leftIcons } from "@/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdjustSongQuality from "../AdjustSongQuality";
import InstallPromptIcon from "../installApp/installPrompt";
import JamOnOff from "../jamOnOff";
import { ThemeSwitch } from "@/components/themeSwitch";

const LeftSidebarIcons = ({ setIsSheetOpen }) => {
    const pathname = usePathname();
    return (
        <div className="flex flex-col items-center w-full">
            <div className="flex flex-col items-centre space-y-3">
                {leftIcons.map((icon) => (
                    <Link
                        onClick={setIsSheetOpen ? ()=>setIsSheetOpen(false) : null}
                        key={icon.label}
                        href={icon.link}
                        className={`flex md:flex-col items-center w-full p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-transform duration-200 ease-in-out group ${
                            pathname === icon.link ? 'bg-slate-300 dark:bg-slate-700' : ''
                        }`}
                    >
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-300 ${
                            pathname === icon.link ? 'text-slate-900 dark:text-slate-100' : ''
                        }`}>
                            {icon.image}
                        </div>
                        <span
                            className={`md:text-xs text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-300 font-bold ${
                                pathname === icon.link ? 'text-slate-900 dark:text-slate-100' : ''
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
