import { Label } from "@/components/ui/label";
import { leftIcons } from "@/utils";
import { Cog } from "lucide-react";
import Link from "next/link";
import AdjustSongQuality from "../AdjustSongQuality";
import InstallPromptIcon from "../installApp/installPrompt";

const LeftSidebarIcons = ({ setIsSheetOpen }) => {
    return (
        <div className="flex flex-col items-center w-full">
            <div className="flex flex-col  items-centre space-y-4">
                {leftIcons.map((icon) => (
                    <Link
                        onClick={setIsSheetOpen ? ()=>setIsSheetOpen(false) : null}
                        key={icon.label}
                        href={icon.link}
                        className="flex md:flex-col items-center w-full p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 transition-transform duration-200 ease-in-out group"
                    >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-300">
                            {icon.image}
                        </div>
                        <span
                            className="md:text-xs text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-300  font-bold"
                        >
                            {icon.label}
                        </span>
                    </Link>
                ))}
                <AdjustSongQuality setIsSheetOpen={setIsSheetOpen}/>
                <InstallPromptIcon />
            </div>
        </div>
    );
};

export default LeftSidebarIcons;
