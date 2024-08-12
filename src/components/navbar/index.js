// components/Navbar.js
'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e) => {
        console.log("searchQuery",searchQuery)
        if (searchQuery.trim()) {
            router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
        }
        // if (e.key === 'Enter' && searchQuery.trim()) {
        //     router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
        // }
    };

    return (
        <div className="flex items-center justify-between p-4 bg-white">
            {/* Left-most text */}
            <div className="text-lg font-semibold glow-primary font-serif">
                Good morning, Sachin
            </div>

            {/* Search area */}
            <div className="flex-grow mx-8 glow-primary">
                <form className="max-w-xs mx-auto" onSubmit={(e) => { e.preventDefault(); handleSearch(searchQuery); }}>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer">
                            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input
                            type="search"
                            id="default-search"
                            className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                            placeholder="Search for songs..."
                            required
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoComplete="off"
                        />
                    </div>
                </form>
            </div>

            {/* Icons and Profile photo */}
            <div className="flex items-center space-x-4">
                <div className="text-xl cursor-pointer p-2 custom-shadow hover:scale-110 transition-transform duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell">
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                    </svg>
                </div>
                <div className="text-xl cursor-pointer p-2 custom-shadow hover:scale-110 transition-transform duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-text">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        <path d="M13 8H7" />
                        <path d="M17 12H7" />
                    </svg>
                </div>
                <div className="w-10 h-9 bg-white rounded-lg overflow-hidden cursor-pointer p-1 custom-shadow hover:scale-110 transition-transform duration-200">
                    <svg className="w-full h-full object-cover lucide lucide-circle-user-round" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 20a6 6 0 0 0-12 0" />
                        <circle cx="12" cy="10" r="4" />
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default Navbar;