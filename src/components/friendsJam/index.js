"use client";

import { UserContext } from "@/context";
import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { nanoid } from "nanoid";

// 🌐 SSR-safe localStorage
const safeLocalStorage = {
  getItem: (key) => typeof window !== "undefined" ? localStorage.getItem(key) : null,
  setItem: (key, value) => typeof window !== "undefined" && localStorage.setItem(key, value),
};

const PROFANITY_LIST = ["fuck", "shit", "bitch", "cunt", "asshole", "nigga", "fag", "slut"]
  .map(w => w.toLowerCase());

const sanitizeText = (text) =>
  text
    .replace(/[<>"'`]/g, m => ({ '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '`': '&#x60;' }[m]))
    .split(/\b/).map(w => PROFANITY_LIST.includes(w.toLowerCase()) ? "*".repeat(w.length) : w).join("")
    .trim();

const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash) % 360}, 70%, 50%)`;
};

const getInitials = (name) =>
  name.split(" ").map(n => n[0]?.toUpperCase()).join("").substring(0, 2) || "??";

const useUsername = () => {
  const [name, setName] = useState(() =>
    safeLocalStorage.getItem("jam-name") || `user-${nanoid(4)}`
  );

  const updateName = useCallback((newName) => {
    const clean = (newName.trim().substring(0, 16) || `user-${nanoid(4)}`).replace(/\s+/g, "_");
    safeLocalStorage.setItem("jam-name", clean);
    setName(clean);
  }, []);

  return [name, updateName];
};

export default function Jam() {
  const {
    songList, currentSong, playing, currentTime,
    setSongList, setCurrentSong, setPlaying, isJamChecked, currentIndex, setCurrentIndex, handleSeek
  } = useContext(UserContext);

  const socketRef = useRef(null);
  const [username, setUsername] = useUsername();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(username);

  const [myId, setMyId] = useState("");
  const [users, setUsers] = useState([]);
  const [followers, setFollowers] = useState([]); // people following ME
  const [listeningTo, setListeningTo] = useState(null);
  const [hostName, setHostName] = useState(null);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [socketStatus, setSocketStatus] = useState("disconnected");
  const [incomingChange, setIncomingChange] = useState(false);

  // 🧠 One effect to rule them all
  useEffect(() => {
    if (!isJamChecked) {
      setFollowers([]);
      setListeningTo(null);
      setHostName(null);
      setChat([]);
      return
    }
    const socket = io(process.env.NEXT_PUBLIC_JAM_BACKEND_URL, {
      transports: ["websocket"],
      reconnection: false
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setMyId(socket.id);
      setSocketStatus("connected");
      socket.emit("join-jam", { name: username });
    });

    socket.on("connect_error", () => setSocketStatus("disconnected"));
    socket.on("disconnect", () => setSocketStatus("disconnected"));

    socket.on("users-update", setUsers);
    socket.on("update-listeners", setFollowers);

    socket.on("sync-state", (state) => {
      setIncomingChange(true);
      setSongList(state.songList || songList);
      setCurrentSong(state.currentSong || songList[0]);
      setPlaying(!!state.playing);
      handleSeek(state.currentTime || 0);
      setCurrentIndex(state.currentIndex || 0)
    });

    socket.on("chat-message", (msg) => {
      setChat(c => [...c.slice(-49), { ...msg, id: nanoid() }]);
      if (msg.from !== username) navigator.vibrate?.(60);
    });

    return () => {
      socket.disconnect();
      setChat([]);
    };
  }, [isJamChecked, username]);

  // 🔁 Auto-reconnect
  useEffect(() => {
    if (!isJamChecked) return;
    if (socketStatus !== "connected") {
      const t = setTimeout(() => socketRef.current?.connect(), 5000);
      return () => clearTimeout(t);
    }
  }, [socketStatus]);

  // 📤 Send state updates (debounced in practice, but keep simple)
  useEffect(() => {
    if (incomingChange) {
      setIncomingChange(false);
      return;
    }
    const state = { songList, currentSong, playing, currentTime, currentIndex };
    if (socketRef.current?.connected && followers.length > 0) {
      socketRef.current.emit("update-state", { state });
    }
  }, [songList, currentSong, playing, followers.length, currentIndex]);

  const followUser = (id, name) => {
    if (id === myId || !socketRef.current) return;

    const socket = socketRef.current;
    if (listeningTo === id) {
      socket.emit("leave-host", { hostId: id });
      setListeningTo(null);
      setHostName(null);
      setChat([]);
    } else {
      setListeningTo(id);
      setHostName(name);
      setChat([]);
      socket.emit("follow-user", { to: id });
    }
  };

  const isHost = followers.length > 0;
  const canChat = listeningTo || isHost;

  const sendMessage = () => {
    if (!message.trim() || !canChat || !socketRef.current) return;
    const clean = sanitizeText(message);
    if (!clean) return;

    socketRef.current.emit("chat-message", {
      message: clean,
      hostId: listeningTo || myId
    });
    setMessage("");
  };

  if (!useContext(UserContext).isJamChecked) return null;
  const isConnected = socketStatus === "connected";

  const Avatar = ({ name, size = "w-6 h-6" }) => (
    <div className={`${size} rounded-full flex items-center justify-center text-xs font-bold text-white`}
      style={{ backgroundColor: stringToColor(name) }}>
      {getInitials(name)}
    </div>
  );

  return (
    <div className="mt-4 mb-4">
      <div className="p-4 space-y-3 select-none">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>🎧 Live Jam</span>
            {!isConnected && <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>}
          </h2>
          <div className="text-xs text-slate-400">
            {socketStatus === "connecting" && "📡"}
            {socketStatus === "connected" && "✅"}
            {socketStatus === "disconnected" && "⚠️"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Avatar name={username} size="w-8 h-8" />
          {isEditingName ? (
            <div className="flex gap-1">
              <input
                autoFocus
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                onBlur={() => {
                  setUsername(tempName);
                  setIsEditingName(false);
                }}
                onKeyDown={e => {
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
              <button onClick={() => {
                setUsername(tempName);
                setIsEditingName(false);
              }} className="text-xs bg-cyan-600 px-2 py-1 rounded">✓</button>
            </div>
          ) : (
            <button onClick={() => {
              setTempName(username);
              setIsEditingName(true);
            }} className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300">
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
          <b className={hostName ? "text-cyan-400" : "text-slate-500"}>{hostName || "None"}</b>
        </div>

        {isHost && followers.length > 0 && (
          <div className="text-xs text-slate-400 bg-slate-800/40 p-2 rounded">
            <span className="font-medium">Listeners ({followers.length}):</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {followers.map(u => (
                <div key={u.id} className="flex items-center gap-1 bg-slate-700/60 px-2 py-0.5 rounded">
                  <Avatar name={u.name} size="w-4 h-4" />
                  <span className="text-xs">{u.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {users.length === 0 ? (
            <p className="col-span-full text-center text-slate-500 text-sm py-2">No users yet…</p>
          ) : (
            users.map(u => (
              <button
                key={u.id}
                onClick={() => followUser(u.id, u.name)}
                disabled={!isConnected}
                className={`px-2 py-1.5 text-xs rounded-lg flex items-center gap-1.5
                  ${u.id === myId ? "bg-emerald-600/80 text-white" :
                    listeningTo === u.id ? "bg-cyan-600/90 text-white shadow-sm" :
                      "bg-slate-800 hover:bg-slate-700 text-slate-200"
                  } ${!isConnected ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Avatar name={u.name} size="w-4 h-4" />
                <span className="truncate max-w-[70px]">{u.name}</span>
                {listeningTo === u.id && <span className="text-xs">👑</span>}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col border-t border-slate-700/50 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-3 space-y-2 thin-scrollbar">
          {chat.length === 0 ? (
            <p className="text-center text-slate-500 py-4 text-sm">
              {canChat ? "💬 No messages yet — be the first!" : "🔇 Follow someone or be host to chat"}
            </p>
          ) : (
            chat.map(c => (
              <div
                key={c.id}
                className={`p-2.5 rounded-xl max-w-[85%] ${c.from === username ? "ml-auto bg-blue-600/20 border border-blue-600/30" : "bg-slate-800/60"}`}
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
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder={canChat ? "Say something… (Enter to send)" : "Follow someone or be host to chat"}
              disabled={!canChat || !isConnected}
              className="flex-1 bg-slate-800/70 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={sendMessage}
              disabled={!canChat || !message.trim() || !isConnected}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition"
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