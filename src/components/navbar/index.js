'use client';

import { useContext, useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Loader2, Menu, Plus, Search, X } from "lucide-react";
import LeftSidebarIcons from "../leftSidebar/leftSidebarIcons";
import { UserContext } from "@/context";
import { ThemeSwitch } from "../themeSwitch";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const pathname = usePathname();
    if (pathname == "/vibes") return null;
    const { searchQuery, setSearchQuery, loading } = useContext(UserContext);
    const [isSearchPopoverOpen, setIsSearchPopoverOpen] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    function showName() {
        toast("Made by Ujjawal Pandey")
    }

    const placeholders = [
        "Arjit Singh Songs",
        "Search for artists",
        "Search for haryanavi songs",
        "Search you favourite playlist",
        "Latest Albums",
    ];

    return (
        <div className="flex items-center justify-between p-2 bg-gray-200 dark:bg-[#100023] shadow-md">
            <div className="flex items-center">
                <div className="block lg:hidden">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <button className="p-2">
                                <Menu className="text-gray-900 dark:text-gray-300" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-3/4 p-4 dark:bg-gray-800">
                            <div className="flex items-center justify-between mb-4">
                                <SheetTitle>
                                    <div className="cursor-pointer mb-8">
                                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                            Musi<span className="text-blue-500">ca</span>
                                        </p>
                                    </div>
                                </SheetTitle>
                                <SheetClose asChild>
                                    <Button
                                        className="cursor-pointer mb-8 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200"
                                    >
                                        <X className="text-2xl font-bold text-gray-900 dark:text-gray-100" />
                                    </Button>
                                </SheetClose>
                            </div>
                            <LeftSidebarIcons setIsSheetOpen={setIsSheetOpen} />
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="ml-2 md:ml-4 cursor-pointer">
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100" onDoubleClick={showName}>
                        Musi<span className="text-blue-500">ca</span>
                    </p>
                </div>
            </div>

            <div className="flex-grow mx-4 md:mx-8 max-w-lg">
                <div className="hidden md:block">
                    <div
                        onSubmit={(e) => e.preventDefault()}
                        className="relative border dark:from-gray-800 dark:to-gray-900 rounded-full shadow-md transition-all duration-300 hover:shadow-lg"
                    >
                        {/* Search Icon */}
                        <div
                            className="absolute inset-y-0 left-0 flex items-center pl-4 cursor-pointer z-10"
                            onClick={() => setSearchQuery((e)=>e+"")}
                            aria-label="Search"
                        >
                            <Search className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200" />
                        </div>

                        {/* Input Field */}
                        <PlaceholdersAndVanishInput
                            placeholders={placeholders}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoComplete="on"
                            className="block w-full pl-2 py-2 text-sm rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-gray-200 dark:bg-slate-950 placeholder-gray-500 dark:placeholder-gray-600 text-gray-900 dark:text-gray-300 transition-colors duration-200"
                        />

                        {/* Loader or End Icon */}
                        <div className="absolute inset-y-0 right-10 flex items-center">
                            {loading ? (
                                <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" aria-label="Loading" />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>


            <div className="flex items-center justify-center">
                <Popover className="md:hidden" open={isSearchPopoverOpen} onOpenChange={setIsSearchPopoverOpen}>
                    <PopoverTrigger className="md:hidden" asChild>
                        <button
                            className="p-2 flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 
                group-hover:text-slate-900 dark:group-hover:text-slate-300 shadow-md hover:shadow-lg transition-shadow duration-200"
                            aria-label="Open search"
                        >
                            <div className="flex items-center justify-center">
                                <Search className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200" />
                            </div>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="transform transition-transform ease-out duration-200">
                        <div className="relative">
                            {/* <div
                                className="z-10 absolute inset-y-0 left-6 flex items-center pl-6 cursor-pointer"
                                onClick={() => debouncedSearch(searchQuery)}
                                aria-label="Search"
                            >
                                <Search className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200" />
                            </div> */}
                            <div>
                                <PlaceholdersAndVanishInput
                                    placeholders={placeholders}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full py-2 text-sm rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-300 transition-colors duration-200"
                                />
                            </div>
                            <div className="absolute inset-y-0 right-16 flex items-center">
                                {loading ? (
                                    <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" aria-label="Loading" />
                                ) : null}
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                <div className="ml-2 md:ml-6">
                    <ThemeSwitch />
                </div>
                {/* <div className="ml-2 md:ml-6">
                    <InstallPromptIcon />
                </div> */}
            </div>
        </div>
    );
};

export default Navbar;
