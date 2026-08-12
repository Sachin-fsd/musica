'use client';

import { useContext, useEffect } from "react";
import { UserContext } from "@/context";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSidebarStore } from "@/store/useSidebarStore";
import RightSidebar from "./index";
import { ChevronDown } from "lucide-react";

/**
 * Lightweight "Now Playing" panel — deliberately NOT built on the Radix
 * Sheet/Dialog primitives (no portal, no overlay, no focus-trap). It stays
 * mounted at all times and just slides via a CSS transform, so open/close
 * is instant and never jank.
 *
 * Mobile (< md): fixed full-screen overlay that covers navbar + content + bottom bar.
 * Desktop (md+): absolute within the content column, docked above the floating bottom bar.
 */
const NowPlayingPanel = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { currentSong } = useContext(UserContext);
    const collapsed = useSidebarStore((state) => state.collapsed);

    const isOpen = searchParams.get("bar") === "true";

    const close = () => {
        const params = new URLSearchParams(window.location.search);
        params.delete("bar");
        router.replace(
            `${pathname}${params.toString() ? `?${params.toString()}` : ""}`,
            { scroll: false }
        );
    };

    // Escape key closes it
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") close();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    if (pathname === "/vibes") return null;
    if (!currentSong) return null;

    return (
        <>
            {/* Mobile: fixed full-screen overlay (covers navbar, content, everything) */}
            <div
                className={`md:hidden fixed inset-0 z-50 transition-[transform,opacity] duration-300 ease-out will-change-transform ${
                    isOpen
                        ? "translate-y-0 opacity-100"
                        : "translate-y-full opacity-0 pointer-events-none"
                }`}
                aria-hidden={!isOpen}
            >
                <div className="h-full w-full bg-white dark:bg-[#080611] flex flex-col">
                    {/* Close header bar — sits above the image, not on it */}
                    <div className="flex items-center px-3 pt-3 pb-1 flex-shrink-0">
                        <button
                            onClick={close}
                            className="p-2 -ml-1 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors"
                            aria-label="Close now playing"
                        >
                            <ChevronDown className="w-5 h-5 text-foreground/70" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <RightSidebar />
                    </div>
                </div>
            </div>

            {/* Desktop: absolute within the content column */}
            <div
                className={`hidden md:block absolute top-0 right-0 bottom-[76px] left-0 ${
                    collapsed ? "md:left-20" : "md:left-60"
                } z-30 transition-[transform,opacity] duration-300 ease-out will-change-transform ${
                    isOpen
                        ? "translate-y-0 opacity-100"
                        : "translate-y-full opacity-0 pointer-events-none"
                }`}
                aria-hidden={!isOpen}
            >
                <div className="h-full w-full">
                    <div className="h-full w-full rounded-3xl overflow-hidden shadow-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#080611]">
                        <RightSidebar />
                    </div>
                </div>
            </div>
        </>
    );
};

export default NowPlayingPanel;
