import { Label } from "@/components/ui/label";
import { leftIcons } from "@/utils";
import Link from "next/link";

const LeftSidebarIcons = () => {
    return (
        <div className="flex flex-col items-center w-full">
            <div className="flex flex-col items-start space-y-4">
                {leftIcons.map((icon) => (
                    <Link key={icon.label} href={icon.link} className="flex items-center w-full p-2 rounded-md hover:bg-slate-200 hover:scale-105 transition-transform duration-200 ease-in-out group">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-800 group-hover:text-slate-900">
                            {icon.image}
                        </div>
                        <span className="ml-4 text-slate-800 group-hover:text-slate-900 md:hidden font-bold">
                            {icon.label}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default LeftSidebarIcons;
