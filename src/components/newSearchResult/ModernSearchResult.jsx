"use client";

import TopQueryCard from "./TopQueryCard";
import SongCard from "./SongCard";
import AlbumCard from "./AlbumCard";
import ArtistCard from "./ArtistCard";
import { Search, X, SlidersHorizontal, Inbox } from "lucide-react";
import { Input } from "../ui/input";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "../ui/skeleton";
import { SearchGlobalAction } from "@/app/actions";

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const ModernSearchResult = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams?.get("query") || "";

  const [search, setSearch] = useState(queryFromUrl);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchContainerRef = useRef(null);
  const debouncedSearch = useDebounce(search, 500);

  // Fetch results when debounced search changes
  useEffect(() => {
    if (!router) return;

    const executeSearch = async () => {
      if (!debouncedSearch) {
        setResults(null);
        setError("");
        setLoading(false);
        if (window.location.pathname !== "/browse" || window.location.search) {
          router.push("/browse", { scroll: false });
        }
        return;
      }

      if (searchContainerRef.current) {
        searchContainerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      const url = `/browse?query=${encodeURIComponent(debouncedSearch)}`;
      const currentUrl = `${window.location.pathname}${window.location.search}`;

      if (currentUrl !== url) {
        router.push(url, { scroll: false });
      }

      setLoading(true);
      setError("");
      setResults(null);

      try {
        const data = await SearchGlobalAction(debouncedSearch);
        if (!data) throw new Error(`API error: ${data.statusText}`);

        if (data.success) {
          setResults(data);
        } else {
          throw new Error("API returned unsuccessful response.");
        }
      } catch (err) {
        console.error("Search fetch error:", err);
        setError("Failed to fetch results. Please try again.");
        setResults(null);
      } finally {
        setLoading(false);
      }
    };

    executeSearch();
  }, [debouncedSearch, router]);

  const clearSearch = useCallback(() => {
    setSearch("");
    router.push("/browse", { scroll: false });
  }, [router]);

  // Data Extraction & Deduplication Logic
  const topQueryData = results?.data?.topQuery?.results?.[0];
  const topQueryId = topQueryData?.id;

  const songsData = results?.data?.songs?.results?.filter(song => song.id !== topQueryId) || [];
  const albumsData = results?.data?.albums?.results || [];
  const artistsData = results?.data?.artists?.results || [];

  const hasResults = results && (
    !!topQueryData ||
    songsData.length > 0 ||
    albumsData.length > 0 ||
    artistsData.length > 0
  );

  return (
    <div className="flex-1 w-full" ref={searchContainerRef}>

      {/* Transparent Frosted Glass Capsule Search Bar */}
      <div className="w-full max-w-3xl mx-auto px-4 relative group">

        {/* Ambient Backlight Glow from Dynamic Song Theme */}
        <div
          className="absolute -inset-1 rounded-2xl blur-lg opacity-15 group-hover:opacity-35 group-focus-within:opacity-50 transition-opacity duration-500 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, var(--song-theme-strong, #d946ef), var(--song-theme-faint, rgba(217, 70, 239, 0.2)))' }}
        />

        <div className="relative flex items-center w-full">
          {/* Left Search Icon */}
          <div
            className="absolute left-4 z-10 pointer-events-none flex items-center justify-center text-foreground/40 group-focus-within:text-foreground transition-colors duration-300"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </div>

          {/* Translucent Frosted Glass Input */}
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-14 pl-12 pr-12 text-base font-normal rounded-2xl bg-black/5 dark:bg-white/[0.04] backdrop-blur-xl border border-black/10 dark:border-white/10 text-foreground placeholder:text-foreground/35 focus-visible:ring-1 focus-visible:ring-[color:var(--song-theme-strong)] focus-visible:ring-offset-0 focus-visible:border-[color:var(--song-theme-mid)] shadow-2xl transition-all duration-300"
            placeholder="Search for songs, artists, or albums..."
            autoComplete="off"
          />

          {/* Right Action Button (Clear Cross when active / Sliders when empty) */}
          {search ? (
            <button
              onClick={clearSearch}
              className="absolute right-3.5 z-10 p-1.5 rounded-full text-foreground/50 hover:text-foreground hover:bg-foreground/10 active:scale-95 transition-all"
              aria-label="Clear search text"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <div className="absolute right-4 z-10 pointer-events-none flex items-center justify-center text-foreground/35">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="w-full max-w-6xl mx-auto mt-12 px-4 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-40 rounded-md bg-foreground/5" />
              <Skeleton className="h-[200px] w-full rounded-xl bg-foreground/5" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-24 rounded-md bg-foreground/5" />
              {[1, 2, 3, 4].map((i) => (
                <div key={`song-skeleton-${i}`} className="flex flex-row items-center space-x-4">
                  <Skeleton className="w-14 h-14 rounded-md flex-shrink-0 bg-foreground/5" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 rounded-md bg-foreground/5" />
                    <Skeleton className="h-3 w-1/2 rounded-md bg-foreground/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 mt-8">
            <Skeleton className="h-8 w-32 rounded-md bg-foreground/5" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={`album-skeleton-${i}`} className="space-y-3">
                  <Skeleton className="w-full aspect-square rounded-xl bg-foreground/5" />
                  <Skeleton className="h-4 w-full rounded-md bg-foreground/5" />
                  <Skeleton className="h-3 w-2/3 rounded-md bg-foreground/5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center mt-16 p-6 max-w-md mx-auto rounded-xl border transition-colors duration-700"
          style={{ background: 'var(--song-theme-faint)', borderColor: 'var(--song-theme-soft)', color: 'var(--song-theme-strong)' }}
        >
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && results && !hasResults && (
        <div className="flex flex-col items-center justify-center mt-20 text-foreground/50">
          <Inbox className="w-16 h-16 mb-4 opacity-40 text-[color:var(--song-theme,#d946ef)]" />
          <h3 className="text-xl font-semibold text-foreground">No results found</h3>
          <p className="mt-1 text-sm text-foreground/60">We couldn&apos;t find anything matching &quot;{search}&quot;.</p>
        </div>
      )}

      {/* Results Rendering */}
      <AnimatePresence mode="wait">
        {!loading && !error && hasResults && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-6xl mx-auto mt-10 px-4 space-y-12 pb-20"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {topQueryData && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold tracking-tight text-white">Top Result</h2>
                  <TopQueryCard data={topQueryData} />
                </div>
              )}
              {songsData.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold tracking-tight text-white">Songs</h2>
                  <SongCard data={songsData} search={search} />
                </div>
              )}
            </div>

            {albumsData.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight text-white">Albums</h2>
                <AlbumCard data={albumsData} />
              </div>
            )}

            {artistsData.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight text-white">Artists</h2>
                <ArtistCard data={artistsData} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ModernSearchResult;