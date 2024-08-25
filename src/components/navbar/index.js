'use client';

import { useRouter } from "next/navigation";
import { useContext, useState, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Bell, Loader2, Menu, MessageSquareText, Radar, Search, X } from "lucide-react";
import LeftSidebarIcons from "../leftSidebar/leftSidebarIcons";
import { UserContext } from "@/context";
import { SearchSongsAction } from "@/app/actions";
import SearchSuggestions, { SuggestionCard } from "../searchPage/suggestedSongsList";
import { debounce } from "lodash";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { decodeHtml } from "@/utils";
import SuggestedSongsList from "../searchPage/suggestedSongsList";
import LongPressTooltip from "../songBar/longPressTooltip";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { loading, setLoading } = useContext(UserContext);
    // const [loading, setLoading] = useState(false)
    const [autocompleteSongs, setAutocompleteSongs] = useState([]);
    const [isSuggestionSelected, setIsSuggestionSelected] = useState(false); // New state flag
    const router = useRouter();

    const handleSearch = async (searchQuery) => {
        if (searchQuery.trim()) {
            try {
                setLoading(true);
                router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
                setAutocompleteSongs([]); // Clear suggestions after searching
            } catch (error) {
                console.error("Failed to perform search:", error);
            }
        }
    };

    const handleSearchSuggestions = useCallback(
        debounce(async (query) => {
            if (query.trim() && !isSuggestionSelected) { // Only fetch suggestions if a suggestion wasn't just selected
                const songResults = await SearchSongsAction(query);
                if (songResults && songResults.success) {
                    setAutocompleteSongs(songResults.data.results);
                }
            }
        }, 300), // 300ms debounce delay
        [isSuggestionSelected]
    );

    useEffect(() => {
        console.log("navbar", loading)
    }, [loading])

    const handleSuggestionClick = (song) => {
        setIsSuggestionSelected(true); // Set the flag to true when a suggestion is clicked
        setAutocompleteSongs([]); // Clear the suggestions
        setSearchQuery(song.name);
        handleSearch(song.name); // Perform the search with the selected song
    };

    // Trigger search suggestions on input change
    useEffect(() => {
        if (searchQuery && !isSuggestionSelected) {
            handleSearchSuggestions(searchQuery);
        } else if (!searchQuery) {
            setAutocompleteSongs([]); // Clear suggestions if input is empty
        }
        setIsSuggestionSelected(false); // Reset the flag after handling the effect
    }, [searchQuery]);

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
                    <SheetContent side="left" className="w-3/4 p-4" aria-describedby="this is the left sidebar">
                        <div className="flex items-center justify-between mb-4">
                            <SheetTitle>
                                <div className="font-semibold text-lg">
                                    Musi<span className="text-slate-700">ca</span>
                                </div>
                            </SheetTitle>
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
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer" onClick={() => handleSearch(searchQuery)}>
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
                            <div className="absolute inset-y-0 right-0 flex items-center pr-1">
                                {loading && <Loader2 className="animate-spin text-gray-500" />}
                            </div>
                            {/* Suggestion list for large screens */}
                            {autocompleteSongs && autocompleteSongs.length > 0 && (
                                <div className="absolute z-50 w-full bg-white border-gray-300 rounded-lg shadow-lg mt-1">
                                    {autocompleteSongs.map((song, index) => (
                                        <SuggestionCard
                                            key={index}
                                            song={song}
                                            onClick={() => handleSuggestionClick(song)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </form>
                </div>
                <Popover className="md:hidden">
                    <PopoverTrigger asChild className="md:hidden">
                        <button className="p-2">
                            <Search className="w-6 h-6" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full max-w-xs justify-center items-center" aria-describedby="this is the search input area">
                        <div>
                            <form onSubmit={(e) => { e.preventDefault(); handleSearch(searchQuery); }}>
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
                        </div>
                        <div className="absolute top-1/3 right-5 ">
                            {loading && <Loader2 className="animate-spin text-gray-500" />}
                        </div>
                        <div>
                            <div>
                                {autocompleteSongs && autocompleteSongs.length > 0 && autocompleteSongs.map((song, index) => (
                                    <SuggestionCard
                                        key={index}
                                        song={song}
                                        onClick={() => handleSuggestionClick(song)}
                                    />
                                ))}
                            </div>
                            {/* <SuggestedSongsList autocompleteSongs={autocompleteSongs} handleSuggestionClick={handleSuggestionClick} /> */}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Icons and Profile photo */}
            <div className="flex items-center justify-evenly">
                {/* <button className="p-2 custom-shadow">
                    <LongPressTooltip tooltipText="Jam">
                        <Link href={"/"}>
                            <Radar />
                        </Link>
                    </LongPressTooltip>
                </button>
                <button className="p-2 custom-shadow">
                    <MessageSquareText />
                </button> */}
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

{/* <Image src="https://github.com/shadcn.png" height="20px" width=""/> */}

