"use client";

import { UserContext } from "@/context";
import { Play, Pause, StepForward, ChevronDown } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import { Label } from "../ui/label";
import { decodeHtml, htmlParser } from "@/utils";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "../ui/sheet";
import RightSidebar from "../rightSidebar";
import { Slider } from "./BottomSlider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Bottombar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isBarOpen = searchParams.get("bar") === "true";
  const [isSheetOpen, setIsSheetOpen] = useState(isBarOpen);
  const [imageError, setImageError] = useState(false);

  const {
    togglePlayPause,
    currentSong,
    playing,
    handleSeek,
    currentTime,
    duration,
    handleNext,
  } = useContext(UserContext);

  // Sync state with URL param on mount / change
  useEffect(() => {
    setIsSheetOpen(isBarOpen);
  }, [isBarOpen]);

  // Back button behavior → close sheet instead of leaving page
  useEffect(() => {
    const handlePop = () => {
      if (isSheetOpen) {
        setIsSheetOpen(false);
        return;
      }
    };

    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, [isSheetOpen]);

  if (pathname === "/vibes") return null;
  if (!currentSong) return null;

  const handleSheetChange = (open) => {
    setIsSheetOpen(open);
    const params = new URLSearchParams(window.location.search);

    if (open) {
      params.set("bar", "true");
      // new history entry → allows going back to close it
      router.push(`${window.location.pathname}?${params.toString()}`, {
        scroll: false,
      });
    } else {
      params.delete("bar");
      // replace instead of push → avoids history spam
      router.replace(
        `${window.location.pathname}${
          params.toString() ? `?${params.toString()}` : ""
        }`,
        { scroll: false }
      );
    }
  };

  return (
    <div className="w-full bg-gray-900 text-white shadow-lg p-4 pt-0 flex flex-col items-center justify-between flex-grow z-10">
      {/* Progress Bar */}
      <div className="w-full pb-1">
        <Slider
          onValueChange={handleSeek}
          value={[currentTime]}
          max={duration || 1}
          className="bg-gray-200 dark:bg-gray-800 rounded-full"
        />
      </div>

      <Sheet open={isSheetOpen} onOpenChange={handleSheetChange}>
        <div className="flex w-full items-center justify-between">
          {/* Song Info */}
          <SheetTrigger asChild>
            <div className="flex items-center space-x-4 cursor-pointer">
              {currentSong?.image?.[0]?.url && !imageError ? (
                <img
                  src={currentSong.image[0].url}
                  loading="lazy"
                  className="rounded-lg w-12 h-12 object-cover"
                  alt={`${currentSong.name} cover`}
                  onError={() => setImageError(true)}
                />
              ) : (
                <Skeleton className="w-12 h-12 rounded-lg bg-gray-700" />
              )}

              <div className="flex flex-col overflow-hidden">
                {currentSong?.name ? (
                  <Label className="font-semibold text-gray-100 truncate text-base cursor-pointer">
                    {decodeHtml(currentSong.name)}
                  </Label>
                ) : (
                  <Skeleton className="w-32 h-4 mb-1 bg-gray-700" />
                )}

                {currentSong?.artists?.primary?.[0]?.name && (
                  <p className="text-sm text-gray-400 truncate">
                    {htmlParser(currentSong.artists.primary[0].name)}
                  </p>
                )}
              </div>
            </div>
          </SheetTrigger>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            <Button
              variant="simple"
              className="p-2 bg-pink-500 rounded-full text-white shadow-md hover:bg-pink-600"
              onClick={togglePlayPause}
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </Button>

            <Button
              variant="simple"
              className="p-2 bg-gray-700 rounded-full text-white shadow-md hover:bg-gray-800"
              onClick={handleNext}
              aria-label="Next song"
            >
              <StepForward className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Expanded Sheet */}
        <SheetContent
          side="bottom"
          className="h-full w-full bg-gradient-to-b bg-fuchsia-300 dark:from-slate-950 dark:to-gray-900 rounded-t-lg p-0"
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center ml-2 mt-2">
              <SheetClose asChild>
                <Button
                  className="cursor-pointer bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                  aria-label="Close"
                >
                  <ChevronDown className="text-2xl font-bold text-gray-900 dark:text-gray-100" />
                </Button>
              </SheetClose>
            </div>

            <div className="flex-1 overflow-hidden">
              <RightSidebar />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Bottombar;