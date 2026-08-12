'use client';

import { Download } from "lucide-react";
import { useInstallPrompt } from "./useInstallPrompt";
import { useThemeColorStore } from "@/store/useThemeColorStore";
import {
    sidebarContainerClass,
    sidebarIconWrapClass,
    sidebarLabelClass,
    sidebarIconStyle,
    sidebarLabelStyle,
} from "../sidebarItemStyles";

const InstallPromptIcon = ({ collapsed = false }) => {
    const { isStandalone, handleDownloadClick } = useInstallPrompt();
    const themeColor = useThemeColorStore((s) => s.themeColor);

    // Hide the button if the app is already installed
    if (isStandalone) return null;

    return (
        <div
            onClick={handleDownloadClick}
            title={collapsed ? "Install App" : undefined}
            className={sidebarContainerClass(collapsed, false)}
        >
            <div className={sidebarIconWrapClass(collapsed)} style={sidebarIconStyle(themeColor, false)}>
                <Download size={collapsed ? 22 : 20} />
            </div>
            <span className={sidebarLabelClass(collapsed)} style={sidebarLabelStyle(themeColor, false)}>
                {collapsed ? "Install" : "Install App"}
            </span>
        </div>
    );
};

export default InstallPromptIcon;
