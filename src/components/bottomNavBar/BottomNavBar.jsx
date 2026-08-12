'use client';

import { leftIcons } from "@/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

const BottomNavBar = () => {
    const pathname = usePathname();

    return (
        <nav className="w-full bg-white/80 dark:bg-[#0d0818]/90 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-2xl flex items-center justify-around shadow-2xl relative transition-colors duration-700">
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
        <Link
            href={link}
            className="relative flex flex-col items-center justify-center flex-1 py-1 group transition-all duration-300"
        >
            {/* Active Top Glow Pill Indicator */}
            {active && (
                <div
                    className="absolute -top-1.5 w-8 h-1 rounded-full shadow-[0_0_12px_var(--song-theme,#d946ef)] transition-all duration-700"
                    style={{ background: 'var(--song-theme, #d946ef)', transition: 'background 0.8s ease, box-shadow 0.8s ease' }}
                />
            )}

            {/* Active Background Capsule / Glow */}
            <div
                className={`relative w-12 h-10 rounded-xl transition-all duration-500 flex items-center justify-center ${active ? 'bg-foreground/10' : 'hover:bg-foreground/5'
                    }`}
            >
                <div
                    className={`w-6 h-6 flex items-center justify-center transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-105'
                        }`}
                    style={{
                        color: active ? 'var(--song-theme, #d946ef)' : 'currentColor',
                        transition: 'color 0.8s ease, transform 0.3s ease'
                    }}
                >
                    {React.cloneElement(Icon, {
                        className: "w-5 h-5 transition-colors duration-700",
                        fill: active ? "currentColor" : "none",
                        stroke: active ? "none" : "currentColor"
                    })}
                </div>
            </div>

            <span
                className={`text-[10px] font-medium tracking-tight mt-0.5 transition-colors duration-700 ${active ? 'text-foreground font-semibold' : 'text-foreground/40 group-hover:text-foreground/70'
                    }`}
                style={{
                    color: active ? 'var(--song-theme, #d946ef)' : undefined,
                    transition: 'color 0.8s ease'
                }}
            >
                {label}
            </span>
        </Link>
    );
};