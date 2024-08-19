'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import React, { useState, useEffect } from 'react';

const LongPressTooltip = ({ onLongPress, children, tooltipText }) => {
    const [pressTimer, setPressTimer] = useState(null);
    const [showTooltip, setShowTooltip] = useState(false);

    const startPress = () => {
        setPressTimer(setTimeout(() => {
            setShowTooltip(true);
            if (onLongPress) onLongPress();
        }, 500)); // Duration for long press
    };

    const endPress = () => {
        clearTimeout(pressTimer);
        setPressTimer(null);
        setShowTooltip(false);
    };

    const handleMouseEnter = () => {
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
        endPress();
    };

    useEffect(() => {
        return () => clearTimeout(pressTimer); // Clean up timer on unmount
    }, [pressTimer]);

    return (
        <div
            onMouseDown={startPress}
            onMouseUp={endPress}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            onTouchStart={startPress}
            onTouchEnd={endPress}
            onTouchCancel={endPress}
        >
            <TooltipProvider>
                <Tooltip open={showTooltip}>
                    <TooltipTrigger asChild>
                        {children}
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{tooltipText}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export default LongPressTooltip;
