// components/Navbar.jsx

"use client";


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
import { debounce } from "lodash";
// import { Label } from "../ui/label";
// import { Separator } from "../ui/separator";
import { decodeHtml } from "@/utils";
// import LongPressTooltip from "../songBar/longPressTooltip";
// import Link from "next/link";
// import Image from "next/image";
import { ThemeSwitch } from "../themeSwitch";
import { cn } from "@/lib/utils";
import SuggestionCard from "../searchPage/suggestedSongsList";


const Navbar = () => {
    const router = useRouter();
    const { loading, setLoading } = useContext(UserContext);

    const [searchQuery, setSearchQuery] = useState("");
    const [autocompleteSongs, setAutocompleteSongs] = useState([]);
    const [isSuggestionSelected, setIsSuggestionSelected] = useState(false);
    const [isSearchPopoverOpen, setIsSearchPopoverOpen] = useState(false);

    // Handle Search Submission
    const handleSearch = async (query) => {
        if (query.trim()) {
            try {
                setLoading(true);
                router.push(`/search?query=${encodeURIComponent(query.trim())}`);
                setAutocompleteSongs([]);
                setSearchQuery("");
            } catch (error) {
                console.error("Failed to perform search:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    // Fetch Search Suggestions
    const fetchSearchSuggestions = useCallback(
        debounce(async (query) => {
            setLoading(true)
            if (query.trim()) {
                const songResults = await SearchSongsAction(query);
                if (songResults && songResults.success) {
                    setAutocompleteSongs(songResults.data.results);
                }
            } else {
                setAutocompleteSongs([]);
            }
            setLoading(false)
        }, 300),
        []
    );

    // Handle Suggestion Click
    const handleSuggestionClick = (song) => {
        setIsSuggestionSelected(true);
        handleSearch(song.name);
        setIsSearchPopoverOpen(false)
    };

    // Effect to Fetch Suggestions on Query Change
    useEffect(() => {
        if (!isSuggestionSelected) {
            fetchSearchSuggestions(searchQuery);
        } else {
            setIsSuggestionSelected(false);
        }
    }, [searchQuery, isSuggestionSelected, fetchSearchSuggestions]);

    return (
        <nav className="bg-white dark:bg-gray-900 shadow">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Mobile Menu Button */}
                    <div className="flex items-center">
                        <Sheet>
                            <SheetTrigger asChild>
                                {/* <Button className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white focus:outline-none">
                                    <Menu className="w-6 h-6" />
                                </Button> */}
                                <button className="p-2">
                                    <Menu className="text-gray-900 dark:text-gray-300" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-64 bg-white dark:bg-gray-800 p-4">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                        Musi<span className="text-blue-500">ca</span>
                                    </h2>
                                    <SheetTrigger asChild>
                                        <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white focus:outline-none">
                                            <X className="w-6 h-6" />
                                        </button>
                                    </SheetTrigger>
                                </div>
                                <LeftSidebarIcons />
                            </SheetContent>
                        </Sheet>
                        {/* Logo */}
                        <div className=" md:flex items-center">
                            <h1
                                className="text-2xl font-bold text-gray-800 dark:text-white cursor-pointer"
                                onClick={() => router.push("/")}
                            >
                                Musi<span className="text-blue-500">ca</span>
                            </h1>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 mx-4">
                        <div className="hidden md:block relative">
                            <form onSubmit={(e) => e.preventDefault()}>
                                <div className="flex items-center justify-center">
                                    <div className="relative w-[70%]">
                                        <input
                                            type="text"
                                            className={cn(
                                                "w-full py-2 pl-10 pr-4 text-sm rounded-md",
                                                "bg-gray-100 dark:bg-gray-800",
                                                "text-gray-700 dark:text-gray-300",
                                                "focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            )}
                                            placeholder="Search for songs..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onFocus={() => fetchSearchSuggestions(searchQuery)}
                                        />
                                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500 dark:text-gray-400" />
                                        {loading && (
                                            <Loader2 className="absolute right-3 top-2.5 w-5 h-5 text-gray-500 dark:text-gray-400 animate-spin" />
                                        )}
                                    </div>
                                </div>
                            </form>
                            {/* Suggestions Dropdown */}
                            {autocompleteSongs.length > 0 && (
                                <div className="absolute mt-2 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 max-h-60 overflow-auto">
                                    {autocompleteSongs.map((song) => (
                                        <SuggestionCard
                                            key={song.id}
                                            song={song}
                                            onClick={() => handleSuggestionClick(song)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Search & Theme Switch */}
                    <div className="flex items-center justify-center">
                        {/* Mobile Search */}
                        <Popover open={isSearchPopoverOpen} onOpenChange={setIsSearchPopoverOpen}>
                            <PopoverTrigger asChild>
                                <button className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white focus:outline-none">
                                    <Search className="w-6 h-6" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="p-4 bg-white dark:bg-gray-800 mt-2 shadow-lg rounded-md">
                                <form onSubmit={(e) => e.preventDefault()}>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className={cn(
                                                "w-full py-2 pl-10 pr-4 text-sm rounded-md",
                                                "bg-gray-100 dark:bg-gray-700",
                                                "text-gray-700 dark:text-gray-300",
                                                "focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            )}
                                            placeholder="Search for songs..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onFocus={() => fetchSearchSuggestions(searchQuery)}
                                        />
                                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500 dark:text-gray-400" />
                                        {loading && (
                                            <Loader2 className="absolute right-3 top-2.5 w-5 h-5 text-gray-500 dark:text-gray-400 animate-spin" />
                                        )}
                                    </div>
                                </form>
                                {/* Suggestions Dropdown */}
                                {autocompleteSongs.length > 0 && (
                                    <div className="mt-2 max-h-60 overflow-auto">
                                        {autocompleteSongs.map((song) => (
                                            <SuggestionCard
                                                key={song.id}
                                                song={song}
                                                onClick={() => handleSuggestionClick(song)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </PopoverContent>
                        </Popover>

                        {/* Theme Switch */}
                        <div className="ml-4">
                            <ThemeSwitch />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
