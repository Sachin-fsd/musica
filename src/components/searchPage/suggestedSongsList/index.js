// components/search/SuggestionCard.jsx

"use client";

import { cn } from "@/lib/utils";
import { decodeHtml } from "@/utils";

// import Image from "next/image";
// import { cn } from "@/lib/utils"; // A utility function for conditional classNames

const SuggestionCard = ({ song, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                "flex items-center p-2 rounded-md cursor-pointer",
                "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            )}
        >
            {/* Album Art or Placeholder */}
            <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                <img
                    src={song.image[0].url}
                    alt={song.name}
                    width={40}
                    height={40}
                    className="object-cover"
                />
            </div>

            {/* Song Details */}
            <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                    {decodeHtml(song.name)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {decodeHtml(song.artist)}
                </p>
            </div>
        </div>
    );
};

export default SuggestionCard;
