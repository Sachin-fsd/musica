"use client";

import { UserContext } from "@/context";
import { useContext, useEffect, useRef, useState, useCallback, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import { nanoid } from "nanoid";

// 🌐 SSR-safe localStorage
const safeLocalStorage = {
  getItem(key) {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  },
  setItem(key, value) {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, value);
  },
};

// 🔒 Profanity filter
const PROFANITY_LIST = [
  "fuck", "shit", "bitch", "cunt", "asshole", "nigga", "fag", "slut"
].map(w => w.toLowerCase());

const sanitizeText = (text) => {
  const clean = text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/`/g, "&#x60;")
    .split(/\b/).map(word =>
      PROFANITY_LIST.includes(word.toLowerCase())
        ? "*".repeat(word.length)
        : word
    ).join("");
  return clean.trim();
};

// 🎨 Avatar helpers
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = Math.abs(hash) % 360;
  return `hsl(${color}, 70%, 50%)`;
};

const getInitials = (name) => {
  return name
    .split(" ")
    .map(n => n[0]?.toUpperCase())
    .join("")
    .substring(0, 2) || "??";
};

// ✅ SSR-safe username
const useUsername = () => {
  const [name, setName] = useState(() => {
    if (typeof window === "undefined") return "guest";
    return safeLocalStorage.getItem("jam-name") || `user-${nanoid(4)}`;
  });

  const updateName = useCallback((newName) => {
    const clean = newName.trim().substring(0, 16) || `user-${nanoid(4)}`;
    safeLocalStorage.setItem("jam-name", clean);
    setName(clean);
  }, []);

  return [name, updateName];
};

export default function Jam() {
  const {
    isJamChecked,
    songList,
    currentSong,
    playing,
    currentTime,
    setSongList,
    setCurrentSong,
    setPlaying,
    setCurrentTime,
  } = useContext(UserContext);

  const socketRef = useRef(null);

  const [username, setUsername] = useUsername();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(username);

  const [myId, setMyId] = useState("");
  const [users, setUsers] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [listeningTo, setListeningTo] = useState(null);
  const [hostName, setHostName] = useState(null);
  const [listeners, setListeners] = useState([]);

  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panelRef = useRef(null);

  // PWA install prompt
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e) => e.preventDefault();
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const onPointerDown = (e) => {
    if ((e.target).closest("button,input,textarea")) return;
    setDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    e.preventDefault();
  };

  const onPointerMove = (e) => {
    if (!dragging || !panelRef.current) return;
    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;
    setPosition({ x: newX, y: newY });
  };

  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    if (typeof window === "undefined" || !panelRef.current) return;

    const panel = panelRef.current;
    const rect = panel.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;

    setPosition({
      x: Math.max(0, Math.min(position.x, maxX)),
      y: Math.max(0, Math.min(position.y, maxY)),
    });
  };

  useEffect(() => {
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [dragging, position]);

  const [socketStatus, setSocketStatus] = useState("disconnected");
  const reconnectTimeoutRef = useRef(null);

  const connectSocket = useCallback(() => {
    if (!isJamChecked) return;

    setSocketStatus("connecting");
    const socket = io(process.env.NEXT_PUBLIC_JAM_BACKEND_URL, {
      transports: ["websocket"],
      reconnection: false,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setMyId(socket.id);
      setSocketStatus("connected");
      socket.emit("join-jam", { name: username });
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    });

    socket.on("connect_error", () => setSocketStatus("disconnected"));
    socket.on("disconnect", () => setSocketStatus("disconnected"));

    socket.on("users-list", setUsers);
    socket.on("user-joined", (user) => {
      setUsers(u => u.some(x => x.id === user.id) ? u : [...u, user]);
    });
    socket.on("user-left", (id) => {
      setUsers(u => u.filter(x => x.id !== id));
      setFollowers(f => f.filter(x => x.id !== id));
      if (listeningTo === id) {
        setListeningTo(null);
        setHostName(null);
        setChat([]);
      }
    });

    socket.on("new-follower", (follower) => {
      setFollowers(f => [...new Set([...f, follower])]);
    });

    socket.on("sync-state", (state) => {
      setSongList(state.songList || []);
      setCurrentSong(state.currentSong || null);
      setPlaying(!!state.playing);
      setCurrentTime(state.currentTime || 0);
    });

    socket.on("state-updated", (state) => {
      setSongList(state.songList || []);
      setCurrentSong(state.currentSong || null);
    });

    socket.on("media-event", ({ type, payload }) => {
      if (type === "PLAY") {
        setCurrentTime(payload.time || 0);
        setPlaying(true);
      } else if (type === "PAUSE") {
        setCurrentTime(payload.time || 0);
        setPlaying(false);
      }
    });

    socket.on("chat-message", (msg) => {
      setChat(c => [...c.slice(-49), { ...msg, id: nanoid() }]);
      if (msg.from !== username) navigator.vibrate?.(60);
    });

    socket.on("host-left", () => {
      setListeningTo(null);
      setHostName(null);
      setChat([]);
      setPlaying(false);
    });

    socket.on("update-listeners", setListeners);

    return () => {
      socket.disconnect();
    };
  }, [isJamChecked, username]);

  // Auto-reconnect
  useEffect(() => {
    if (!isJamChecked) return;

    const tryReconnect = () => {
      if (socketStatus !== "connected") {
        connectSocket();
      }
      reconnectTimeoutRef.current = setTimeout(tryReconnect, 10_000);
    };

    reconnectTimeoutRef.current = setTimeout(tryReconnect, 10_000);
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [isJamChecked, socketStatus, connectSocket]);

  // Initial connect
  useEffect(() => {
    if (isJamChecked) connectSocket();
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [isJamChecked, connectSocket]);

  // ✅ OPTIMIZED: Sync song list & current song (only when changed)
  const songListId = useMemo(() => songList.map(s => s.id).join(','), [songList]);
  useEffect(() => {
    if (!followers.length || !socketRef.current || socketStatus !== "connected") return;

    const followerIds = followers.map(f => f.id);
    socketRef.current.emit("state-updated", {
      to: followerIds,
      state: { songList, currentSong }
    });
  }, [
    songListId,
    currentSong?.id,
    followers.length,
    socketStatus
  ]);

  // ✅ OPTIMIZED: Sync playback (only on play/pause/seek)
  const prevPlayingRef = useRef(playing);
  const prevCurrentTimeRef = useRef(currentTime);

  useEffect(() => {
    if (!followers.length || !socketRef.current || socketStatus !== "connected") return;

    const followerIds = followers.map(f => f.id);
    const hasPlayStateChanged = playing !== prevPlayingRef.current;
    const hasSeeked = Math.abs(currentTime - prevCurrentTimeRef.current) > 0.8; // >0.8s = seek

    if (hasPlayStateChanged || hasSeeked) {
      socketRef.current.emit("media-event", {
        to: followerIds,
        type: playing ? "PLAY" : "PAUSE",
        payload: { time: currentTime }
      });
    }

    prevPlayingRef.current = playing;
    prevCurrentTimeRef.current = currentTime;
  }, [playing, currentTime, followers.length, socketStatus]);

  const followUser = (id, name) => {
    if (id === myId) return;
    const socket = socketRef.current;
    if (!socket) return;

    if (listeningTo === id) {
      socket.emit("leave-host", { hostId: id });
      setListeningTo(null);
      setHostName(null);
      setChat([]);
      return;
    }

    setListeningTo(id);
    setHostName(name);
    setChat([]);
    socket.emit("follow-user", { to: id });
  };

  const isHost = followers.length > 0;
  const canChat = listeningTo || isHost;

  const sendMessage = () => {
    if (!message.trim() || !canChat || !socketRef.current) return;
    const cleanMsg = sanitizeText(message);
    if (!cleanMsg) return;

    socketRef.current.emit("chat-message", {
      message: cleanMsg,
      hostId: listeningTo || myId,
    });
    setMessage("");
  };

  if (!isJamChecked) return null;

  const isConnected = socketStatus === "connected";

  const Avatar = ({ name, size = "w-6 h-6", className = "" }) => (
    <div
      className={`${size} rounded-full flex items-center justify-center text-xs font-bold text-white ${className}`}
      style={{ backgroundColor: stringToColor(name) }}
    >
      {getInitials(name)}
    </div>
  );

  return (
    <div
      ref={panelRef}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        willChange: "transform",
        touchAction: "none",
        inset: "env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)",
      }}
      className="fixed right-4 bottom-20 sm:right-6 sm:bottom-28 w-full sm:w-[400px] max-w-[95vw] max-h-[85vh]
        bg-slate-900/95 backdrop-blur-md text-white rounded-xl shadow-2xl border border-slate-700
        flex flex-col z-50 overflow-hidden"
    >
      {/* DRAG HANDLE */}
      <div
        onPointerDown={onPointerDown}
        className="h-2.5 w-full flex items-center justify-center cursor-grab active:cursor-grabbing
          bg-gradient-to-b from-slate-800/50 to-transparent touch-none select-none"
      >
        <div className="w-8 h-1 bg-slate-500/60 rounded-full"></div>
      </div>

      {/* HEADER */}
      <div
        onPointerDown={onPointerDown}
        className="p-4 space-y-3 cursor-grab active:cursor-grabbing select-none"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>🎧 Live Jam</span>
            {!isConnected && (
              <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
            )}
          </h2>
          <div className="text-xs flex gap-1 items-center text-slate-400">
            {socketStatus === "connecting" && "📡"}
            {socketStatus === "connected" && "✅"}
            {socketStatus === "disconnected" && "⚠️"}
          </div>
        </div>

        {/* Username */}
        <div className="flex items-center gap-2">
          <Avatar name={username} size="w-8 h-8" />
          {isEditingName ? (
            <div className="flex gap-1">
              <input
                autoFocus
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={() => {
                  setUsername(tempName);
                  setIsEditingName(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setUsername(tempName);
                    setIsEditingName(false);
                  }
                  if (e.key === "Escape") {
                    setTempName(username);
                    setIsEditingName(false);
                  }
                }}
                className="bg-slate-800 px-2 py-1 rounded text-sm text-white outline-none border border-cyan-500"
              />
              <button
                onClick={() => {
                  setUsername(tempName);
                  setIsEditingName(false);
                }}
                className="text-xs bg-cyan-600 px-2 py-1 rounded"
              >
                ✓
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setTempName(username);
                setIsEditingName(true);
              }}
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
            >
              <span>{username}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          )}
          {isHost && <span className="ml-1 text-yellow-400">👑 Host</span>}
        </div>

        <div className="text-sm">
          Listening to:{" "}
          <b className={hostName ? "text-cyan-400" : "text-slate-500"}>
            {hostName || "None"}
          </b>
        </div>

        {/* Listeners (host only) */}
        {isHost && listeners.length > 0 && (
          <div className="text-xs text-slate-400 bg-slate-800/40 p-2 rounded">
            <span className="font-medium">Listeners ({listeners.length}):</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {listeners.map((u) => (
                <div key={u.id} className="flex items-center gap-1 bg-slate-700/60 px-2 py-0.5 rounded">
                  <Avatar name={u.name} size="w-4 h-4" />
                  <span className="text-xs">{u.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User List */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {users.length === 0 ? (
            <p className="col-span-full text-center text-slate-500 text-sm py-2">
              No users yet…
            </p>
          ) : (
            users.map((u) => (
              <button
                key={u.id}
                onClick={() => followUser(u.id, u.name)}
                disabled={!isConnected}
                className={`px-2 py-1.5 text-xs rounded-lg flex items-center gap-1.5
                  ${u.id === myId
                    ? "bg-emerald-600/80 text-white"
                    : listeningTo === u.id
                      ? "bg-cyan-600/90 text-white shadow-sm"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                  }
                  ${!isConnected ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Avatar name={u.name} size="w-4 h-4" />
                <span className="truncate max-w-[70px]">{u.name}</span>
                {listeningTo === u.id && <span className="text-xs">👑</span>}
              </button>
            ))
          )}
        </div>
      </div>

      {/* CHAT */}
      <div className="flex-1 flex flex-col border-t border-slate-700/50 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-3 space-y-2 thin-scrollbar">
          {chat.length === 0 ? (
            <p className="text-center text-slate-500 py-4 text-sm">
              {canChat
                ? "💬 No messages yet — be the first!"
                : "🔇 Follow someone or be host to chat"}
            </p>
          ) : (
            chat.map((c) => (
              <div
                key={c.id}
                className={`p-2.5 rounded-xl max-w-[85%] ${c.from === username
                  ? "ml-auto bg-blue-600/20 border border-blue-600/30"
                  : "bg-slate-800/60"
                  }`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <Avatar name={c.from} size="w-5 h-5" />
                  <b className={c.from === username ? "text-blue-300" : "text-cyan-400"}>{c.from}</b>
                </div>
                <div className="text-slate-200" dangerouslySetInnerHTML={{ __html: c.message }} />
              </div>
            ))
          )}
        </div>

        <div className="p-2 border-t border-slate-700/30 bg-slate-900/50">
          <div className="flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={
                canChat
                  ? "Say something… (Enter to send)"
                  : "Follow someone or be host to chat"
              }
              disabled={!canChat || !isConnected}
              className="flex-1 bg-slate-800/70 border border-slate-700 rounded-lg px-3 py-2
                text-sm text-white outline-none placeholder-slate-500
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={sendMessage}
              disabled={!canChat || !message.trim() || !isConnected}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700
                px-3 py-2 rounded-lg text-sm font-medium transition"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1 text-center">
            Messages are sanitized (no profanity/HTML)
          </p>
        </div>
      </div>
    </div>
  );
}