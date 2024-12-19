'use client';

import { useContext, useState, useEffect, useCallback } from "react";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Loader2, Menu, Search, X } from "lucide-react";
import LeftSidebarIcons from "../leftSidebar/leftSidebarIcons";
import { UserContext } from "@/context";
import { SearchSongsAction } from "@/app/actions";
import { debounce } from "lodash";
import { ThemeSwitch } from "../themeSwitch";
import InstallPromptNav from "./installPromptNav";

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { setSearchResults } = useContext(UserContext);
    const [isSearchPopoverOpen, setIsSearchPopoverOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (!query.trim()) return;

            setLoading(true);  // Start loading before the search request
            try {
                let songResults = await SearchSongsAction(query);

                // Retry with the first word if no results
                if (songResults && songResults.success && songResults.data.results.length === 0) {
                    const fallbackQuery = query.split(" ")[0];
                    songResults = await SearchSongsAction(fallbackQuery);
                }

                if (songResults && songResults.success) {
                    setSearchResults(songResults.data.results);
                }
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);  // Stop loading after the search completes
            }
        }, 500),
        []  // Empty dependency array to ensure `debounce` is not recreated on every render
    );

    useEffect(() => {
        // Scroll to top whenever searchQuery changes 
        window.scrollTo({ top: 0, behavior: 'smooth' });

        debouncedSearch(searchQuery);

        // Cleanup function to cancel pending debounced call when component unmounts
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchQuery, debouncedSearch]);  // `searchQuery` dependency to trigger on input changes


    return (
        <div className="flex items-center justify-between p-4 bg-gray-200 dark:bg-slate-950 shadow-md">
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
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        Musi<span className="text-blue-500">ca</span>
                    </p>
                </div>
            </div>

            <div className="flex-grow mx-4 md:mx-8 max-w-lg">
                <div className="hidden md:block">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer" onClick={() => debouncedSearch(searchQuery)}>
                                <Search className="text-gray-900 dark:text-gray-300 p-0.5" />
                            </div>
                            <input
                                type="search"
                                id="default-search"
                                className="block w-full p-2 pl-10 text-sm text-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-3xl bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                                placeholder="Search"
                                required
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoComplete="on"
                            />

                            <div className="absolute inset-y-0 right-6 flex items-center pr-1">
                                {loading && <Loader2 className="animate-spin text-gray-500 dark:text-gray-400" />}
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="flex items-center justify-center">
                <Popover className="md:hidden" open={isSearchPopoverOpen} onOpenChange={setIsSearchPopoverOpen}>
                    <PopoverTrigger asChild>
                        <button className="p-2 md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-300">
                            <Search className="w-6 h-6 text-gray-900 dark:text-gray-300" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className=" dark:bg-gray-800 p-1">
                        <div>
                            <form onSubmit={(e) => { e.preventDefault(); handleSearchSuggestions(searchQuery); }}>
                                <input
                                    type="search"
                                    id="popover-search"
                                    className="block w-full p-2 text-sm text-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                                    placeholder="Search"
                                    required
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoComplete="off"
                                />

                            </form>
                        </div>
                        <div className="absolute top-1/3 right-16">
                            {loading && <Loader2 className="animate-spin text-gray-500 dark:text-gray-400" />}
                        </div>
                    </PopoverContent>
                </Popover>

                <div className="ml-2 md:ml-6">
                    <ThemeSwitch />
                </div>
{/* 
                <div>
                    <InstallPromptNav />
                </div> */}
            </div>

        </div>
    );
};

export default Navbar