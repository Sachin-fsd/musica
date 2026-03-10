"use client";
import React, { useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, X, Music2 } from "lucide-react";
import { debounce } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { UserContext } from "@/context";
import { GetSongsByIdAction } from "@/app/actions";
import SongBar from "@/components/songBar";
import { decode } from "he";

/* ─── tiny helpers ─────────────────────────────────────────── */
const truncate = (str = "", n = 22) =>
    str.length > n ? str.slice(0, n).trimEnd() + "…" : str;

/* ─── overlay / modal variants ─────────────────────────────── */
const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.18 } },
};
const modalVariants = {
    hidden: { opacity: 0, y: 28, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 380, damping: 32 } },
    exit: { opacity: 0, y: 16, scale: 0.97, transition: { duration: 0.16 } },
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export function ExpandableAlbumCarousel({ albums = [], softAlbumsRef }) {
    const id = useId();
    const modalRef = useRef(null);
    const [active, setActive] = useState(null);   // album object | null
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [playingId, setPlayingId] = useState(null);

    const { setSongList, setCurrentIndex, setCurrentSong, setPlaying, setCurrentId } = useContext(UserContext);
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    /* ── URL sync: open from ?album=id ─────────────────────────── */
    useEffect(() => {
        const albumId = searchParams.get("album");
        if (!albumId) { if (active) closeModal(false); return; }
        if (active && String(active.id) === String(albumId)) return;
        const found = albums.find((a) => String(a.id) === String(albumId));
        if (found) openModal(found, false); // false = don't push URL again
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams?.toString()]);

    /* ── keyboard esc ───────────────────────────────────────────── */
    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape" && active == true) closeModal(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);

    /* ── body scroll lock ───────────────────────────────────────── */
    useEffect(() => {
        document.body.style.overflow = active ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [active]);

    /* ── outside click ──────────────────────────────────────────── */
    useEffect(() => {
        if (!active) return;
        const handler = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) closeModal();
        };
        document.addEventListener("mousedown", handler);
        document.addEventListener("touchstart", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
            document.removeEventListener("touchstart", handler);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);

    /* ── open ───────────────────────────────────────────────────── */
    const openModal = useCallback((album, pushUrl = true) => {
        setActive(album);
        setSongs([]);
        fetchSongs(album);
        if (pushUrl) {
            router.push(`${pathname}?album=${encodeURIComponent(album.id)}`, { scroll: false });
        }
    }, [pathname, router]);

    /* ── close ──────────────────────────────────────────────────── */
    const closeModal = useCallback((updateUrl = true) => {
        setActive(null);
        if (updateUrl) {
            window.history.length > 1 ? router.back() : router.replace(pathname);
        }
    }, [pathname, router]);

    /* ── fetch songs ────────────────────────────────────────────── */
    const fetchSongs = useCallback(async (album) => {
        setLoading(true);
        try {
            const type = album.type === "radio_station" ? "artist" : album.type;
            const res = await GetSongsByIdAction(type, album.id);
            if (res.success) {
                const list = res.data.songs || res.data.topSongs || res.data || [];
                setSongs(list);
                setActive((prev) => prev
                    ? { ...prev, image: res.data.image?.[2]?.url ?? prev.image, description: res.data.description ?? prev.description }
                    : prev
                );
            } else {
                setSongs([]);
            }
        } catch { setSongs([]); }
        finally { setLoading(false); }
    }, []);

    /* ── play album ─────────────────────────────────────────────── */
    const handlePlay = useCallback(debounce((album) => {
        if (playingId === album.id) {
            setPlayingId(null); setPlaying(false); return;
        }
        if (!songs.length) return;
        setSongList(songs);
        setCurrentSong(songs[0]);
        setCurrentIndex(0);
        setCurrentId(songs[0]?.id);
        setPlaying(true);
        setPlayingId(album.id);
    }, 280), [songs, playingId]);

    /* ──────────────────────────────────────────────────────────── */
    return (
        <>
            {/* ── Backdrop ── */}
            <AnimatePresence>
                {active && (
                    <motion.div
                        key="backdrop"
                        variants={backdropVariants}
                        initial="hidden" animate="visible" exit="exit"
                        className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-md"
                    />
                )}
            </AnimatePresence>

            {/* ── Modal ── */}
            <AnimatePresence>
                {active && (
                    <motion.div
                        key="modal-wrap"
                        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
                    >
                        <motion.div
                            ref={modalRef}
                            variants={modalVariants}
                            initial="hidden" animate="visible" exit="exit"
                            className="relative w-full sm:max-w-md bg-[#0f0f0f] sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col"
                            style={{ maxHeight: "90dvh" }}
                        >
                            {/* close btn */}
                            <button
                                onClick={() => closeModal()}
                                className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                aria-label="Close"
                            >
                                <X size={15} className="text-white" />
                            </button>

                            {/* cover */}
                            <div className="relative w-full aspect-[16/9] sm:aspect-square flex-none overflow-hidden">
                                {active.image ? (
                                    <img
                                        src={active.image}
                                        alt={active.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                                        <Music2 size={48} className="text-neutral-600" />
                                    </div>
                                )}
                                {/* gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />
                                {/* title pinned on cover bottom */}
                                <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 flex items-end justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-white font-semibold text-lg leading-tight truncate">
                                            {decode(active.title)}
                                        </h2>
                                        {active.description && (
                                            <p className="text-white/60 text-xs mt-0.5 line-clamp-2">
                                                {decode(active.description)}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handlePlay(active)}
                                        disabled={loading}
                                        className="flex-none flex items-center justify-center w-11 h-11 rounded-full bg-green-500 hover:bg-green-400 active:scale-95 transition-all shadow-lg disabled:opacity-40"
                                        aria-label={playingId === active.id ? "Pause" : "Play"}
                                    >
                                        {playingId === active.id
                                            ? <Pause size={18} className="text-black fill-black" />
                                            : <Play size={18} className="text-black fill-black" />}
                                    </button>
                                </div>
                            </div>

                            {/* song list */}
                            <div className="flex-1 overflow-y-auto overscroll-contain">
                                {loading ? (
                                    <SongListSkeleton />
                                ) : songs.length > 0 ? (
                                    songs.map((song, i) => (
                                        <React.Fragment key={song?.id ?? i}>
                                            <SongBar song={song} />
                                            {i < songs.length - 1 && (
                                                <div className="mx-4 h-px bg-white/5" />
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <div className="flex items-center justify-center h-24 text-white/30 text-sm">
                                        No songs found
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Carousel ── */}
            <div
                ref={softAlbumsRef}
                className="flex gap-3 overflow-x-auto py-3 px-1 no-scrollbar"
                style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
            >
                {albums.map((album, i) => (
                    <AlbumCard
                        key={album.id ?? i}
                        album={album}
                        layoutId={`card-${album.title}-${id}`}
                        isPlaying={playingId === album.id}
                        onClick={() => openModal(album)}
                    />
                ))}
            </div>
        </>
    );
}

/* ─── AlbumCard ─────────────────────────────────────────────── */
function AlbumCard({ album, layoutId, isPlaying, onClick }) {
    const [imgErr, setImgErr] = useState(false);

    return (
        <motion.button
            layoutId={layoutId}
            onClick={onClick}
            whileTap={{ scale: 0.95 }}
            className="group flex-none w-36 text-left rounded-xl overflow-hidden bg-neutral-900 hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
        >
            {/* square cover */}
            <div className="relative w-full aspect-square overflow-hidden">
                {album.image && !imgErr ? (
                    <img
                        src={album.image}
                        alt={album.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={() => setImgErr(true)}
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                        <Music2 size={28} className="text-neutral-600" />
                    </div>
                )}
                {/* play badge */}
                <div className="absolute inset-0 flex items-end justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="flex items-center justify-center w-9 h-9 rounded-full bg-green-500 shadow-lg">
                        {isPlaying
                            ? <Pause size={15} className="text-black fill-black" />
                            : <Play size={15} className="text-black fill-black" />}
                    </span>
                </div>
                {isPlaying && (
                    <span className="absolute top-2 left-2 flex gap-0.5 items-end h-4">
                        {[1, 1.6, 0.8].map((d, i) => (
                            <span
                                key={i}
                                className="w-1 bg-green-400 rounded-full animate-bounce"
                                style={{ height: `${d * 14}px`, animationDelay: `${i * 0.12}s` }}
                            />
                        ))}
                    </span>
                )}
            </div>
            {/* title */}
            <div className="px-2.5 py-2">
                <p className="text-white/90 text-xs font-medium leading-snug truncate">
                    {decode(album.title) || <span className="block h-3 bg-neutral-700 rounded animate-pulse w-3/4" />}
                </p>
            </div>
        </motion.button>
    );
}

/* ─── Skeleton loader ───────────────────────────────────────── */
function SongListSkeleton() {
    return (
        <div className="p-4 flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-neutral-800 animate-pulse flex-none" />
                    <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-neutral-800 rounded animate-pulse w-3/4" />
                        <div className="h-2.5 bg-neutral-800 rounded animate-pulse w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ExpandableAlbumCarousel;