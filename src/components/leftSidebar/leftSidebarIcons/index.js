import { leftIcons } from "@/utils";
import Link from "next/link";

const LeftSidebarIcons = () => {
    return (
        <div className="flex flex-col items-center w-full">
            <div className="flex flex-col items-center space-y-6">
                {leftIcons.map(icon => (
                    <div key={icon.label} className="flex flex-col items-center hover:scale-105 transition-all cursor-pointer hover:text-slate-900">
                        <Link href={icon.link}>{icon.image}</Link>
                        <Link className="hidden" href={icon.link}>{icon.label}</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeftSidebarIcons;
