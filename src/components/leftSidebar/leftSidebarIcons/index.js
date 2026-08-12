'use client'

import { leftIcons } from "@/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdjustSongQuality from "../AdjustSongQuality";
import InstallPromptIcon from "../installApp/installPrompt";
import InstallPromoCard from "../installApp/InstallPromoCard";
import JamOnOff from "../jamOnOff";
import { ThemeSwitch } from "@/components/themeSwitch";
import { useThemeColorStore } from "@/store/useThemeColorStore";
import React from "react";
import { Disc3, Mic2, ListMusic } from "lucide-react";
import {
    sidebarContainerClass,
    sidebarIconWrapClass,
    sidebarLabelClass,
    sidebarIconStyle,
    sidebarLabelStyle,
} from "../sidebarItemStyles";

// Browse-only destinations: the app doesn't have dedicated /albums,
// /artists or /playlists routes yet, so these route to /browse for now
// and are never shown as "active" (no single route to match against).
// Swap `link` here once dedicated pages exist.
const browseOnlyIcons = [
    { label: "Albums", link: "/browse", Icon: Disc3 },
    { label: "Artists", link: "/browse", Icon: Mic2 },
    { label: "Playlists", link: "/browse", Icon: ListMusic },
];

const LeftSidebarIcons = ({ setIsSheetOpen, collapsed = false }) => {
    const pathname = usePathname();
    const themeColor = useThemeColorStore((s) => s.themeColor);
    // Inside the mobile Sheet drawer we always want the full, labelled
    // layout — collapsing only applies to the persistent desktop sidebar.
    const isCollapsed = setIsSheetOpen ? false : collapsed;

    return (
        <div className="flex flex-col items-center w-full">
            <div className={`flex flex-col w-full ${isCollapsed ? "items-center gap-2" : "gap-1"}`}>
                {leftIcons.map((icon) => {
                    const active = pathname === icon.link;
                    return (
                        <Link
                            onClick={setIsSheetOpen ? () => setIsSheetOpen(false) : null}
                            key={icon.label}
                            href={icon.link}
                            title={isCollapsed ? icon.label : undefined}
                            className={sidebarContainerClass(isCollapsed, active)}
                        >
                            <div className={sidebarIconWrapClass(isCollapsed)} style={sidebarIconStyle(themeColor, active)}>
                                {React.cloneElement(icon.image, {
                                    fill: active ? "currentColor" : "none",
                                    stroke: active ? "none" : "currentColor",
                                    style: { width: "100%", height: "100%" },
                                })}
                            </div>
                            <span className={sidebarLabelClass(isCollapsed)} style={sidebarLabelStyle(themeColor, active)}>
                                {icon.label}
                            </span>
                        </Link>
                    );
                })}

                {browseOnlyIcons.map(({ label, link, Icon }) => (
                    <Link
                        onClick={setIsSheetOpen ? () => setIsSheetOpen(false) : null}
                        key={label}
                        href={link}
                        title={isCollapsed ? label : undefined}
                        className={sidebarContainerClass(isCollapsed, false)}
                    >
                        <div className={sidebarIconWrapClass(isCollapsed)} style={sidebarIconStyle(themeColor, false)}>
                            <Icon size={isCollapsed ? 22 : 20} />
                        </div>
                        <span className={sidebarLabelClass(isCollapsed)} style={sidebarLabelStyle(themeColor, false)}>
                            {label}
                        </span>
                    </Link>
                ))}

                <div className={`w-full border-t border-foreground/10 ${isCollapsed ? "my-1" : "my-2"}`} />

                <AdjustSongQuality setIsSheetOpen={setIsSheetOpen} collapsed={isCollapsed} />
                <InstallPromptIcon collapsed={isCollapsed} />
                <JamOnOff setIsSheetOpen={setIsSheetOpen} collapsed={isCollapsed} />
                <ThemeSwitch collapsed={isCollapsed} />

                {/* No room for the copy in the collapsed rail */}
                {!isCollapsed && <InstallPromoCard />}
            </div>
        </div>
    );
};

export default LeftSidebarIcons;
