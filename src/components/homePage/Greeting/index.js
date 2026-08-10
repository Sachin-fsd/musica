'use client';

import { useEffect, useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { TEMPLATES, SUBTITLES, ACCENTS, DAY_KEYS } from './greetingsData';

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Build the greeting text: time buckets, day-of-week, then the generic pool.
function pickGreetingText() {
    const hour = new Date().getHours();
    const dayKey = DAY_KEYS[new Date().getDay()];

    let bucket;
    const roll = Math.random();

    if (roll < 0.4) {
        // Time-of-day feels the most "alive"
        if (hour < 5) bucket = 'lateNight';
        else if (hour < 12) bucket = 'morning';
        else if (hour < 17) bucket = 'afternoon';
        else if (hour < 21) bucket = 'evening';
        else bucket = 'night';
    } else if (roll < 0.7) {
        // Day-of-week flavor
        bucket = dayKey;
    } else {
        bucket = 'generic';
    }

    return rand(TEMPLATES[bucket]);
}

const fillName = (template, name) => template.replaceAll('{name}', name);

const Greeting = () => {
    const { user, authLoading } = useAuth();
    const firstName = user?.name?.split(' ')[0] || 'there';

    const [text, setText] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [accent, setAccent] = useState('');

    const roll = useCallback(() => {
        setText(fillName(pickGreetingText(), firstName));
        setSubtitle(rand(SUBTITLES));
        setAccent(rand(ACCENTS));
    }, [firstName]);

    // Pick on mount (after auth resolves) — random every session/reload.
    // Runs in an effect so server render never mismatches the client.
    useEffect(() => {
        roll();
    }, [roll]);

    if (authLoading || !text) {
        return <div className="h-16" aria-hidden />;
    }

    return (
        <div className="relative group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={text + subtitle}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
                        {/* <span className="mr-2 inline-block">{accent}</span> */}
                        {text}
                    </h1>
                    {/* <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                        {subtitle}
                    </p> */}
                </motion.div>
            </AnimatePresence>

        </div>
    );
};

export default Greeting;
