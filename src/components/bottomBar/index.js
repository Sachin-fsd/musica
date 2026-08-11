"use client";

import { UserContext } from "@/context";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  Volume1,
  VolumeX,
  ListMusic,
  ChevronDown
} from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { decode } from "he";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "../ui/sheet";
import RightSidebar from "../rightSidebar";
import { Slider } from "./BottomSlider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import LikeButton from "@/components/LikeButton";

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

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
    handlePrev,
    isLooping,
    isShuffled,
    toggleLoop,
    toggleShuffle,
    volume,
    setVolume,
    isMuted,
    toggleMute,
  } = useContext(UserContext);

  useEffect(() => {
    setIsSheetOpen(isBarOpen);
  }, [isBarOpen]);

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
      router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
    } else {
      params.delete("bar");
      router.replace(
        `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`,
        { scroll: false }
      );
    }
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={handleSheetChange}>
      {/* Container raised up on mobile for bottom navigation spacing */}
      <div className="w-full px-2 sm:px-4 fixed bottom-[72px] md:bottom-3 left-0 right-0 z-40 pointer-events-none">

        {/* Main Floating Deck */}
        <div
          className="pointer-events-auto relative w-full max-w-7xl mx-auto h-16 sm:h-20 rounded-2xl bg-[#080512]/90 backdrop-blur-2xl border border-white/10 shadow-2xl flex items-center justify-between px-3 sm:px-6 overflow-hidden transition-all duration-300"
          style={{
            boxShadow: "0 10px 40px -10px rgba(0,0,0,0.8), inset 0 1px 0 0 rgba(255,255,255,0.1)"
          }}
        >
          {/* Top Dynamic Accent Bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[2.5px] opacity-90 transition-all duration-700"
            style={{
              background: `linear-gradient(90deg, var(--song-theme-strong, #d946ef) 0%, var(--song-theme, #d946ef) 60%, transparent 100%)`,
              transition: 'background 0.8s ease'
            }}
          />

          {/* Left Side: Artwork & Info (Fixed width so layout structure never shifts) */}
          <div className="flex items-center min-w-0 w-36 sm:w-56 md:w-64 flex-shrink-0">
            <SheetTrigger asChild>
              <div className="flex items-center space-x-3 cursor-pointer group min-w-0 w-full">
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl overflow-hidden shadow-lg border border-white/10">
                  {currentSong?.image?.[0]?.url && !imageError ? (
                    <Image
                      height={48}
                      width={48}
                      src={currentSong.image[currentSong.image.length - 1]?.url || currentSong.image[0].url}
                      alt={`${currentSong.name} cover`}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <Skeleton className="w-full h-full bg-white/10" />
                  )}
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  {currentSong?.name ? (
                    <Label className="font-semibold text-white truncate text-xs sm:text-base cursor-pointer tracking-tight group-hover:text-[color:var(--song-theme,#d946ef)] transition-colors duration-700">
                      {decode(currentSong.name)}
                    </Label>
                  ) : (
                    <Skeleton className="w-24 h-4 mb-1 bg-white/10" />
                  )}

                  {currentSong?.artists?.primary?.[0]?.name ? (
                    <p className="text-[11px] sm:text-xs text-white/50 truncate font-normal">
                      {decode(currentSong.artists.primary[0].name)}
                    </p>
                  ) : (
                    <Skeleton className="w-16 h-3 bg-white/10" />
                  )}
                </div>

                <div className="pl-1 hidden md:block flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <LikeButton song={currentSong} size="sm" />
                </div>
              </div>
            </SheetTrigger>
          </div>

          {/* Center: Mobile Simplified Controls & Desktop Expanded Controls */}
          <div className="flex-1 max-w-xl mx-1 sm:mx-4 flex flex-col items-center justify-center space-y-1.5 min-w-0">
            <div className="flex items-center space-x-1 sm:space-x-3">
              <Button
                variant="ghost"
                onClick={(e) => { e.stopPropagation(); toggleShuffle?.(); }}
                className={`transition-colors duration-700 hidden md:block ${isShuffled ? 'text-[color:var(--song-theme,#d946ef)]' : 'text-white/40 hover:text-white'}`}
                aria-label="Shuffle"
              >
                <Shuffle className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                onClick={(e) => { e.stopPropagation(); handlePrev?.(); }}
                className="text-white/70 hover:text-white transition-colors active:scale-95"
                aria-label="Previous"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </Button>

              {/* Play / Pause Glow Button */}
              <Button
                variant="simple"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition-all duration-700 p-0"
                style={{
                  background: `linear-gradient(135deg, var(--song-theme-strong, #d946ef), var(--song-theme, #d946ef))`,
                  boxShadow: `0 0 18px var(--song-theme-faint, rgba(217, 70, 239, 0.4))`,
                  transition: 'background 0.8s ease, box-shadow 0.8s ease, transform 0.2s ease'
                }}
                onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? (
                  <Pause className="w-5 h-5 fill-current text-white" />
                ) : (
                  <Play className="w-5 h-5 fill-current text-white ml-0.5" />
                )}
              </Button>

              <Button
                variant="ghost"
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="text-white/70 hover:text-white transition-colors active:scale-95"
                aria-label="Next"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </Button>

              <Button
                variant="ghost"
                onClick={(e) => { e.stopPropagation(); toggleLoop?.(); }}
                className={`transition-colors duration-700 hidden md:block ${isLooping ? 'text-[color:var(--song-theme,#d946ef)]' : 'text-white/40 hover:text-white'}`}
                aria-label="Repeat"
              >
                <Repeat className={`w-4 h-4 ${isLooping ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Desktop Scrubber */}
            <div className="w-full hidden md:flex items-center space-x-2.5">
              <span className="text-[11px] font-mono text-white/40 min-w-[32px] text-right">
                {formatTime(currentTime)}
              </span>

              <div className="flex-1 relative flex items-center">
                <Slider
                  onValueChange={handleSeek}
                  value={[currentTime]}
                  max={duration || 1}
                  className="w-full cursor-pointer"
                />
              </div>

              <span className="text-[11px] font-mono text-white/40 min-w-[32px]">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Right Side Controls (Fixed width matching left side) */}
          <div className="flex items-center justify-end w-auto sm:w-56 md:w-64 flex-shrink-0">
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="p-1 text-white/50 hover:text-white transition-colors rounded"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-white/40" />
                  ) : volume < 0.5 ? (
                    <Volume1 className="w-4 h-4 text-white/70" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white/70" />
                  )}
                </button>
                <div className="w-20">
                  <Slider
                    value={[isMuted ? 0 : Math.round(volume * 100)]}
                    onValueChange={(val) => setVolume(val[0] / 100)}
                    max={100}
                    className="w-full cursor-pointer"
                  />
                </div>
              </div>

              <SheetTrigger asChild>
                <button
                  className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  aria-label="Open Queue"
                >
                  <ListMusic className="w-5 h-5" />
                </button>
              </SheetTrigger>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Sheet Modal */}
      <SheetContent side="bottom" className="h-full w-full border-none p-0 bg-[#080611] text-white">
        <SheetTitle className="sr-only">Now Playing</SheetTitle>
        <div className="flex flex-col h-full relative">
          <div className="flex justify-between items-center p-4 z-20">
            <SheetClose asChild>
              <Button
                variant="ghost"
                className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Close"
              >
                <ChevronDown className="w-7 h-7" />
              </Button>
            </SheetClose>
          </div>

          <div className="flex-1 overflow-hidden">
            <RightSidebar />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Bottombar;