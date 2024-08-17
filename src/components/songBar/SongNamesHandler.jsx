'use client'

import { useState, useEffect } from 'react';

export function SongNameHandler({ text }) {
    const [truncatedText, setTruncatedText] = useState(text);

    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;

            if (screenWidth <= 640) {
                const maxLength = Math.floor(screenWidth / 12); // Adjust this factor as needed
                if (text.length > maxLength) {
                    setTruncatedText(`${text.substring(0, maxLength)}...`);
                } else {
                    setTruncatedText(text);
                }
            } else {
                setTruncatedText(text);
            }
        };

        handleResize(); // Call initially
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [text]);

    return <Label>{truncatedText}</Label>;
}
