'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Bell, Menu, MessageSquareText, Search, X } from "lucide-react";
import LeftSidebarIcons from "../leftSidebar/leftSidebarIcons";

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <div className="flex items-center justify-between p-4 bg-white shadow-md">
            {/* Menu button on small screens */}
            <div className="block md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <button className="p-2">
                            <Menu />
                        </button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-3/4 p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="font-semibold text-lg">
                                Musi<span className="text-slate-700">ca</span>
                            </div>
                            <SheetClose asChild>
                                <Button variant="ghost" aria-label="Close">
                                    <X className="w-6 h-6 text-gray-400" />
                                </Button>
                            </SheetClose>
                        </div>
                        <LeftSidebarIcons />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Welcome text or site name */}
            <div className="flex items-center space-x-4">
                <div className="text-lg font-semibold glow-primary font-serif">
                    Welcome
                </div>
            </div>

            {/* Search area with popover */}
            <div className="flex-grow mx-8 max-w-lg">
                <div className="hidden md:block">
                    <form className="max-w-xs mx-auto" onSubmit={(e) => { e.preventDefault(); handleSearch(searchQuery); }}>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer">
                               <Search />
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
                <Popover className="md:hidden">
                    <PopoverTrigger asChild className="md:hidden">
                        <button className="p-2">
                            <Search className="w-6 h-6 " />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full max-w-xs">
                        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                            <input
                                type="search"
                                id="popover-search"
                                className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                                placeholder="Search for songs..."
                                required
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoComplete="off"
                            />
                        </form>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Icons and Profile photo */}
            <div className="flex items-center space-x-4">
                
                <button className="p-2 custom-shadow">
                    <Bell />
                </button>
                <button className="p-2 custom-shadow">
                    <MessageSquareText />
                </button>
                <div className="rounded-full overflow-hidden">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
