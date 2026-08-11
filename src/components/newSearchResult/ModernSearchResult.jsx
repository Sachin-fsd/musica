"use client";

import TopQueryCard from "./TopQueryCard";
import SongCard from "./SongCard";
import AlbumCard from "./AlbumCard";
import ArtistCard from "./ArtistCard";
import { Search, X, Inbox } from "lucide-react";
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
    <div className="flex-1 w-full py-1" ref={searchContainerRef}>

      {/* Redesigned Modern Glow Search Bar */}
      <div className="w-full max-w-3xl mx-auto px-4 relative group">
        {/* Subtle Ambient Backlight Glow on Hover/Focus */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-600/30 to-purple-600/30 rounded-full blur-md opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="relative flex items-center w-full">
          {/* Search Icon */}
          <div
            className="absolute left-4 z-10 pointer-events-none flex items-center justify-center"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-purple-300/60 group-focus-within:text-fuchsia-400 transition-colors" />
          </div>

          {/* Styled Input */}
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-13 pl-12 pr-12 text-base rounded-lg bg-[#130d24]/70 backdrop-blur-md border border-white/10 text-white placeholder:text-purple-200/40 focus-visible:ring-2 focus-visible:ring-fuchsia-500/80 focus-visible:ring-offset-0 focus-visible:border-fuchsia-500/50 shadow-lg shadow-black/40 transition-all duration-300"
            placeholder="Search for songs, artists, or albums..."
            autoComplete="off"
          />

          {/* Clear Button */}
          {search && (
            <button
              onClick={clearSearch}
              className="absolute right-4 z-10 p-1 rounded-full text-purple-300/60 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Loading Skeleton matching the Dark Theme */}
      {loading && (
        <div className="w-full max-w-6xl mx-auto mt-12 px-4 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-40 rounded-md bg-white/5" />
              <Skeleton className="h-[200px] w-full rounded-xl bg-white/5" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-24 rounded-md bg-white/5" />
              {[1, 2, 3, 4].map((i) => (
                <div key={`song-skeleton-${i}`} className="flex flex-row items-center space-x-4">
                  <Skeleton className="w-14 h-14 rounded-md flex-shrink-0 bg-white/5" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 rounded-md bg-white/5" />
                    <Skeleton className="h-3 w-1/2 rounded-md bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 mt-8">
            <Skeleton className="h-8 w-32 rounded-md bg-white/5" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={`album-skeleton-${i}`} className="space-y-3">
                  <Skeleton className="w-full aspect-square rounded-xl bg-white/5" />
                  <Skeleton className="h-4 w-full rounded-md bg-white/5" />
                  <Skeleton className="h-3 w-2/3 rounded-md bg-white/5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center mt-16 p-6 max-w-md mx-auto bg-fuchsia-950/20 backdrop-blur-md rounded-xl border border-fuchsia-500/20 text-fuchsia-200">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && results && !hasResults && (
        <div className="flex flex-col items-center justify-center mt-20 text-purple-200/50">
          <Inbox className="w-16 h-16 mb-4 opacity-40 text-fuchsia-400" />
          <h3 className="text-xl font-semibold text-white">No results found</h3>
          <p className="mt-1 text-sm text-purple-200/60">We couldn't find anything matching "{search}".</p>
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