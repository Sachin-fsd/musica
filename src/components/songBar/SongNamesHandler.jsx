'use client'

import { useState, useEffect } from 'react';
import { Label } from '../ui/label';

export function SongNameHandler({ text }) {
    const [truncatedText, setTruncatedText] = useState(text);

    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;

            if (screenWidth <= 640) {
                const maxLength = Math.floor(screenWidth / 20); // Adjust this factor as needed
                if (text.length > maxLength) {
                    setTruncatedText(`${text?.substring(0, maxLength)}...`);
                } else {
                    setTruncatedText(text);
                }
            }
            else if (screenWidth <= 340) {
                const maxLength = Math.floor(screenWidth / 45); // Adjust this factor as needed
                if (text.length > maxLength) {
                    setTruncatedText(`${text?.substring(0, maxLength)}...`);
                } else {
                    setTruncatedText(text);
                }
            }
            else {
                setTruncatedText(text);
            }
        };

        handleResize(); // Call initially
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [text]);

    return <Label>{truncatedText}</Label>;
}
