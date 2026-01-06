'use client'

import { Switch } from '@/components/ui/switch';
import { UserContext } from '@/context';
import React, { useContext } from 'react';

const JamOnOff = ({ setIsSheetOpen }) => {
    const { isJamChecked, setIsJamChecked } = useContext(UserContext);

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
            // onClick={setIsChecked}
            className="flex md:flex-col items-center w-full p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-transform duration-200 ease-in-out group cursor-pointer"
        >
            <div className="flex items-center justify-center w-8 h-8 text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-300">
                <Switch
                    checked={isJamChecked}
                    onCheckedChange={ToogleJam}
                    className="bg-slate-100 dark:bg-slate-500 rounded-full"
                // disabled={false}
                />
            </div>
            <span className="flex-1 text-center md:text-xs text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-300 font-bold">
                Jam {isJamChecked ? "On" : "Off"}
            </span>
        </div>
    );
};

export default JamOnOff;
