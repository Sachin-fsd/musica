'use client';

import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export default function LikeButton({ song, size = 'md', className = '' }) {
    const { user, likedSongIds, toggleLike } = useAuth();

    // O(1) lookup — no DB, no useEffect, no loading state needed
    const liked = !!song?.id && likedSongIds.has(song.id);

    const handleClick = (e) => {
        e.stopPropagation();
        e.preventDefault(); 

        if (!user) {
            toast.error('Sign in to like songs');
            return;
        }
        if (!song?.id) return;

        toggleLike(song); 
    };

    // Clean, standard icon sizes
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6', // Perfect size for list rows
        lg: 'w-8 h-8',
    };

    const currentSize = sizeClasses[size] || sizeClasses.md;

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={liked ? 'Unlike song' : 'Like song'}
            title={liked ? 'Unlike' : 'Like'}
            // The p-2 -m-2 trick creates a larger clickable area without breaking layouts
            className={`group relative flex items-center justify-center p-2 -m-2 focus:outline-none ${className}`}
        >
            <Heart
                className={`
                    ${currentSize}
                    transition-all duration-300 ease-out
                    group-active:scale-75
                    ${liked
                        ? 'fill-pink-500 text-pink-500 scale-110 drop-shadow-sm'
                        : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:scale-110'
                    }
                `}
            />
        </button>
    );
}