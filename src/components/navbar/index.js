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
import { useSearchStore } from "@/store/useSearchStore";
import Image from "next/image";

const Navbar = () => {
    const pathname = usePathname();
    if (pathname == "/vibes") return null;
    const { searchQuery, setSearchQuery, isLoading: loading } = useSearchStore();
    const [isSearchPopoverOpen, setIsSearchPopoverOpen] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    function showName() {
        toast("Made by Sachin Singh")
    }

    return (
        <div className="flex items-center justify-between p-2 shadow-md">
            <div className="flex items-center">
                <div className="block md:hidden">
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
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex" onDoubleClick={showName}>
                        <span><Image src={'/favicon.png'} alt="Logo" width={30} height={30} /></span>Musi<span className="text-blue-500">ca</span>
                    </p>
                </div>
            </div>
        
        </div>
    );
};

export default Navbar;
