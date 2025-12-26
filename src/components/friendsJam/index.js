"use client";

import { UserContext } from "@/context";
import { useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { nanoid } from "nanoid";

const getUsername = () => {
  let name = localStorage.getItem("jam-name");
  if (!name) {
    name = "user-" + nanoid(4);
    localStorage.setItem("jam-name", name);
  }
  return name;
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
    setCurrentTime
  } = useContext(UserContext);

  const socketRef = useRef(null);
  const latestStateRef = useRef({});

  const [myId, setMyId] = useState("");
  const [users, setUsers] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [listeningTo, setListeningTo] = useState(null);
  const [hostName, setHostName] = useState(null);

  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    latestStateRef.current = {
      songList,
      currentSong,
      playing,
      currentTime
    };
  }, [songList, currentSong, playing, currentTime]);

  useEffect(() => {
    if (!isJamChecked) {
      setUsers([]);
      setFollowers([]);
      setListeningTo(null);
      setHostName(null);
      setChat([]);
      return;
    }

    const socket = io(`${process.env.NEXT_PUBLIC_JAM_BACKEND_URL}`);
    socketRef.current = socket;

    socket.on("connect", () => {
      setMyId(socket.id);
      socket.emit("join-jam", { name: getUsername() });
    });

    socket.on("users-list", setUsers);

    socket.on("user-joined", (user) => {
      setUsers(u => u.some(x => x.id === user.id) ? u : [...u, user]);
    });

    socket.on("user-left", (id) => {
      setUsers(u => u.filter(x => x.id !== id));
      setFollowers(f => f.filter(x => x !== id));
      if (listeningTo === id) {
        setListeningTo(null);
        setHostName(null);
        setChat([]);
      }
    });

    socket.on("new-follower", (id) => {
      setFollowers(f => [...new Set([...f, id])]);

      socket.emit("sync-state", {
        to: id,
        state: latestStateRef.current
      });

      socket.emit("media-event", {
        to: id,
        type: latestStateRef.current.playing ? "PLAY" : "PAUSE",
        payload: { time: latestStateRef.current.currentTime }
      });
    });

    socket.on("sync-state", (state) => {
      setSongList(state.songList);
      setCurrentSong(state.currentSong);
      setPlaying(state.playing);
      setCurrentTime(state.currentTime);
    });

    socket.on("state-updated", (state) => {
      setSongList(state.songList);
      setCurrentSong(state.currentSong);
    });

    socket.on("media-event", ({ type, payload }) => {
      if (type === "PLAY") {
        setCurrentTime(payload.time);
        setPlaying(true);
      }
      if (type === "PAUSE") {
        setCurrentTime(payload.time);
        setPlaying(false);
      }
    });

    socket.on("chat-message", (msg) => {
      setChat(c => [...c.slice(-49), msg]);
      if (msg.from !== getUsername()) {
        navigator.vibrate?.(60);
      }
    });

    socket.on("host-left", () => {
      setListeningTo(null);
      setHostName(null);
      setChat([]);
      setPlaying(false);
    });


    return () => socket.disconnect();
  }, [isJamChecked]);

  useEffect(() => {
    if (!followers.length || !socketRef.current) return;
    socketRef.current.emit("state-updated", {
      to: followers,
      state: { songList, currentSong }
    });
  }, [songList, currentSong]);

  useEffect(() => {
    if (!followers.length || !socketRef.current) return;
    socketRef.current.emit("media-event", {
      to: followers,
      type: playing ? "PLAY" : "PAUSE",
      payload: { time: currentTime }
    });
  }, [playing]);

  const followUser = (id, name) => {
    if (id === myId) return;

    if (listeningTo === id) {
      socketRef.current.emit("leave-host", { hostId: id });
      setListeningTo(null);
      setHostName(null);
      setChat([]);
      return;
    }

    setListeningTo(id);
    setHostName(name);
    setChat([]);
    socketRef.current.emit("follow-user", { to: id });
  };

  const isHost = followers.length > 0;
  const canChat = listeningTo || isHost;

  const sendMessage = () => {
    if (!message.trim() || !canChat) return;

    socketRef.current.emit("chat-message", {
      message,
      hostId: listeningTo || myId
    });

    setMessage("");
  };

  if (!isJamChecked) return null;

  return (
    <div className="fixed right-0 bottom-36 sm:right-6 w-full sm:w-[420px] max-h-[85vh]
      bg-slate-900 text-white rounded-t-xl sm:rounded-xl shadow-2xl flex flex-col z-10">

      {/* HEADER */}
      <div className="p-4 space-y-2">
        <h2 className="text-lg font-bold">🎧 Live Jam</h2>

        <div className="flex justify-between text-sm text-slate-300">
          <span>
            You: <b className="text-base">{getUsername()}</b>
            {isHost && <span className="ml-1">👑</span>}
          </span>
          <span>Followers: {followers.length}</span>
        </div>

        <div className="text-sm">
          Listening to: <b>{hostName || "None"}</b>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {users.map(u => (
            <button
              key={u.id}
              onClick={() => followUser(u.id, u.name)}
              className={`px-2 py-1 rounded text-sm
                ${u.id === myId ? "bg-green-600" :
                  listeningTo === u.id ? "bg-blue-600" :
                    "bg-slate-700 hover:bg-slate-600"}`}
            >
              {u.name}
              {listeningTo === u.id && " 👑"}
            </button>
          ))}
        </div>
      </div>

      {/* CHAT */}
      <div className="flex-1 flex flex-col border-t border-slate-700 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-3 text-sm space-y-1">
          {chat.map((c, i) => (
            <div key={i}>
              <b className="text-blue-400">{c.from}:</b> {c.message}
            </div>
          ))}
        </div>

        <div className="p-2 flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!canChat}
            placeholder={canChat ? "Say something…" : "Follow someone or get followers to chat"}
            className="flex-1 bg-slate-800 rounded px-2 py-1 text-sm outline-none disabled:opacity-40"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={!canChat}
            className="bg-blue-600 px-3 rounded text-sm disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}