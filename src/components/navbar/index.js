'use client';

import { useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { LogOut, Menu, User, X } from "lucide-react";
import LeftSidebarIcons from "../leftSidebar/leftSidebarIcons";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import AuthModal, { LoginButton } from "@/components/auth/AuthModal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
    const pathname = usePathname();
    if (pathname == "/vibes") return null;

    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const { user, logout, authLoading } = useAuth();

    function showName() {
        toast("Made by Sachin Singh");
    }

    const handleLogout = async () => {
        await logout();
        toast.success("Logged out successfully");
    };

    return (
        <>
            <div className="flex items-center justify-between p-2 shadow-md">
                {/* Left: hamburger + logo */}
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
                                        <Button className="cursor-pointer mb-8 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200">
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
                            <span><Image src={'/favicon.png'} alt="Logo" width={30} height={30} /></span>
                            Musi<span className="text-blue-500">ca</span>
                        </p>
                    </div>
                </div>

                {/* Right: auth controls */}
                <div className="flex items-center gap-2 mr-1">
                    {authLoading ? (
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
                    ) : user ? (
                        /* Logged-in state */
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700" >
                                    <User size={18}  />
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-48">
                                <div className="px-3 py-2 border-b">
                                    <p className="text-xs text-slate-500">Signed in as</p>
                                    <p className="font-medium truncate">{user.name}</p>
                                </div>

                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="cursor-pointer text-red-600 focus:text-red-600"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        /* Logged-out state */
                        <LoginButton onClick={() => setIsAuthModalOpen(true)} />
                    )}
                </div>
            </div>

            {/* Auth Modal — only one can be open at a time (handled inside AuthModal itself) */}
            {isAuthModalOpen && (
                <AuthModal onClose={() => setIsAuthModalOpen(false)} />
            )}
        </>
    );
};

export default Navbar;
