'use client';

import { useRouter } from "next/navigation";
import { useContext, useState, useEffect, useCallback } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Bell, Loader2, Menu, MessageSquareText, Radar, Search, X } from "lucide-react";
import LeftSidebarIcons from "../leftSidebar/leftSidebarIcons";
import { UserContext } from "@/context";
import { SearchSongsAction } from "@/app/actions";
import { SuggestionCard } from "../searchPage/suggestedSongsList";
import { debounce } from "lodash";
// import { Label } from "../ui/label";
// import { Separator } from "../ui/separator";
import { decodeHtml } from "@/utils";
// import LongPressTooltip from "../songBar/longPressTooltip";
// import Link from "next/link";
// import Image from "next/image";
import { ThemeSwitch } from "../themeSwitch";

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { setSearchResults } = useContext(UserContext);
    const [autocompleteSongs, setAutocompleteSongs] = useState([]);
    const [isSuggestionSelected, setIsSuggestionSelected] = useState(false);
    const [isSearchPopoverOpen, setIsSearchPopoverOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const router = useRouter();

    // goes to searcg page with query
    const handleSearch = async (searchQuery) => {
        if (searchQuery.trim()) {
            try {
                setLoading(true);
                router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
                setAutocompleteSongs([]);
                setIsSearchPopoverOpen(false)
            } catch (error) {
                console.error("Failed to perform search:", error);
            }
        }
    };

    const handleSearchSuggestions = useCallback(
        debounce(async (query) => {
            if (query.trim() && !isSuggestionSelected) {
                const songResults = await SearchSongsAction(query);
                if (songResults && songResults.success) {
                    setSearchResults(songResults.data.results)
                    setLoading(false)
                    // setAutocompleteSongs(songResults.data.results);
                }
            }
        }, 300),
        [isSuggestionSelected]
    );

    const handleSuggestionClick = (song) => {
        setIsSuggestionSelected(true);
        setAutocompleteSongs([]);
        setSearchQuery(decodeHtml(song.name));
        handleSearch(song.name);
    };

    useEffect(() => {
        if (searchQuery && !isSuggestionSelected) {
            setLoading(true)
            handleSearchSuggestions(searchQuery);
        } else if (!searchQuery) {
            setAutocompleteSongs([]);
        }
        setIsSuggestionSelected(false);
    }, [searchQuery]);

    return (
        <div className="flex items-center justify-between p-4 bg-gray-200 dark:bg-slate-950 shadow-md">

            <div className="flex items-center">
                <div className="block md:hidden">
                    <Sheet>
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
                            <LeftSidebarIcons />
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
                    <form onSubmit={(e) => { e.preventDefault(); handleSearch(searchQuery); }}>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer" onClick={() => handleSearch(searchQuery)}>
                                <Search className="text-gray-900 dark:text-gray-300 p-0.5" />
                            </div>
                            <input
                                type="search"
                                id="default-search"
                                className="block w-full p-2 pl-10 text-sm text-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                                placeholder="Search"
                                required
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoComplete="off"
                            />
                            
                            <div className="absolute inset-y-0 right-6 flex items-center pr-1">
                                {loading && <Loader2 className="animate-spin text-gray-500 dark:text-gray-400" />}
                            </div>

                            {/* {autocompleteSongs && autocompleteSongs.length > 0 && (
                                <div className="absolute z-50 w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-lg shadow-lg mt-1">
                                    {autocompleteSongs.map((song, index) => (
                                        <SuggestionCard
                                            key={index}
                                            song={song}
                                            onClick={() => handleSuggestionClick(song)}
                                        />
                                    ))}
                                </div>
                            )} */}
                        </div>
                    </form>
                </div>
            </div>

            <div className="flex items-center justify-center">
                <Popover className="md:hidden" open={isSearchPopoverOpen} onOpenChange={setIsSearchPopoverOpen}>
                    <PopoverTrigger asChild>
                        <button className="p-2 md:hidden">
                            <Search className="w-6 h-6 text-gray-900 dark:text-gray-300" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className=" dark:bg-gray-800 p-1">
                        <div>
                            <form onSubmit={(e) => { e.preventDefault(); handleSearch(searchQuery); }}>
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
                        {/* <div>
                            {autocompleteSongs && autocompleteSongs.length > 0 && autocompleteSongs.map((song, index) => (
                                <SuggestionCard
                                    key={index}
                                    song={song}
                                    onClick={() => handleSuggestionClick(song)}
                                />
                            ))}
                        </div> */}
                    </PopoverContent>
                </Popover>

                <div className="ml-4 md:ml-6">
                    <ThemeSwitch />
                </div>
            </div>

        </div>
    );
};

export default Navbar