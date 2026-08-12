// Shared styling for every left-sidebar row (nav links, Quality, Install,
// Jam, Theme) so the expanded <-> collapsed behaviour stays identical
// across all of them, and so the "active" color matches the same
// `--song-theme` accent already used by BottomNavBar / HeroSection /
// BottomBar — the color that shifts to match whatever song is playing.
//
// Expanded: icon on the left, label to its right (row).
// Collapsed: icon on top, small label beneath it (column) — YT Music style.

export const sidebarContainerClass = (collapsed, active) =>
    [
        "relative flex w-full rounded-lg cursor-pointer select-none",
        "transition-all duration-300 ease-in-out group",
        collapsed
            ? "flex-col items-center justify-center gap-1 py-2.5 px-1"
            : "flex-row items-center gap-3 px-3 py-2.5",
        active ? "bg-white/10" : "hover:bg-white/5",
    ].join(" ");

export const sidebarIconWrapClass = (collapsed) =>
    `relative flex items-center justify-center shrink-0 ${collapsed ? "w-6 h-6" : "w-5 h-5"}`;

export const sidebarLabelClass = (collapsed) =>
    [
        "font-semibold truncate",
        collapsed ? "text-[10px] leading-tight text-center w-full" : "text-sm text-left flex-1",
    ].join(" ");

// Icon/label color: themed when active, dimmed white otherwise — same
// pattern BottomNavBar uses for its tab icons.
export const sidebarIconStyle = (themeColor, active) => ({
    color: active ? themeColor : "rgba(255, 255, 255, 0.65)",
    transition: "color 0.8s ease",
});

export const sidebarLabelStyle = (themeColor, active) => ({
    color: active ? themeColor : "rgba(255, 255, 255, 0.65)",
    transition: "color 0.8s ease",
});
