'use client'

import { leftIcons } from "@/utils";


import { usePathname } from "next/navigation";
import Link from "next/link";

const BottomNavBar = () => {
    const pathname = usePathname();
    return (
        <nav className=" z-50 w-full max-w-md bg-gradient-to-r from-[#181c2f] via-[#1a223f] to-[#181c2f] rounded-2xl shadow-xl border border-white/10 px-4 py-2 flex items-center justify-between backdrop-blur-md m-auto">
            {leftIcons.map((icon, index) => (
                <NavItem
                    key={index}
                    icon={icon.image}
                    label={icon.label}
                    link={icon.link}
                    show={icon.show}
                    active={pathname === icon.link}
                />
            ))}
        </nav>
    );
};

export default BottomNavBar;


export const NavItem = ({ icon: Icon, label, link, active = false, show = true }) => {
    if (!show) return null;
    return (
        <Link href={link} className="flex flex-col items-center group flex-1">
            <div className={`p-2 rounded-full transition-all duration-300 flex items-center justify-center ${active
                ? 'bg-gradient-neon shadow-glow-neon'
                : 'hover:bg-white/10'
                }`}>
                <div className={`w-6 h-6 flex items-center justify-center ${active ? 'text-darker-surface' : 'text-white/80'
                    }`}>
                    {Icon}
                </div>
            </div>
            <span className={`text-[11px] font-medium mt-1 ${active ? 'text-neon-blue' : 'text-white/60'} hidden xs:block`}>
                {label}
            </span>
        </Link>
    );
};