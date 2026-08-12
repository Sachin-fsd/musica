'use client'

import { Radio } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { UserContext } from '@/context';
import { useThemeColorStore } from '@/store/useThemeColorStore';
import React, { useContext } from 'react';
import {
    sidebarContainerClass,
    sidebarIconWrapClass,
    sidebarLabelClass,
    sidebarIconStyle,
    sidebarLabelStyle,
} from "../sidebarItemStyles";

const JamOnOff = ({ setIsSheetOpen, collapsed = false }) => {
    const { isJamChecked, setIsJamChecked } = useContext(UserContext);
    const themeColor = useThemeColorStore((s) => s.themeColor);

    function ToogleJam() {
        setIsJamChecked(!isJamChecked);
        setIsSheetOpen && setIsSheetOpen(false);
        const JamSection = document.getElementById("jam_section");

        if (JamSection) {
            JamSection.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }

    return (
        <div
            title={collapsed ? `Jam ${isJamChecked ? "On" : "Off"}` : undefined}
            // When collapsed there's no room for the Switch, so the whole
            // row becomes the toggle instead.
            onClick={collapsed ? ToogleJam : undefined}
            className={sidebarContainerClass(collapsed, false)}
        >
            <div className={sidebarIconWrapClass(collapsed)} style={sidebarIconStyle(themeColor, isJamChecked)}>
                <Radio size={collapsed ? 22 : 20} />
            </div>
            <span className={sidebarLabelClass(collapsed)} style={sidebarLabelStyle(themeColor, isJamChecked)}>
                Jam {isJamChecked ? "On" : "Off"}
            </span>

            {!collapsed && (
                <Switch
                    checked={isJamChecked}
                    onCheckedChange={ToogleJam}
                    className="ml-auto bg-slate-100 dark:bg-slate-500 rounded-full shrink-0"
                />
            )}
        </div>
    );
};

export default JamOnOff;
