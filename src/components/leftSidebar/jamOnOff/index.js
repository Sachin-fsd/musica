'use client'

import { Switch } from '@/components/ui/switch';
import { UserContext } from '@/context';
import React, { useContext } from 'react';

const JamOnOff = () => {
    const { isJamChecked, setIsJamChecked } = useContext(UserContext);
    return (
        <div
            // onClick={setIsChecked}
            className="flex flex-row-reverse justify-between md:flex-col items-center w-full p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 transition-transform duration-200 ease-in-out group cursor-pointer"
        >
            <div className="flex items-center justify-center w-10 h-10 text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-300">
                <Switch
                    checked={isJamChecked}
                    onCheckedChange={setIsJamChecked}
                    className="bg-slate-100 dark:bg-slate-500 rounded-full"
                    // disabled={false}
                />
            </div>
            <span className="md:text-xs ml-1 text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-300 font-bold">
                Jam {isJamChecked ? "On" : "Off"}
            </span>
        </div>
    );
};

export default JamOnOff;
