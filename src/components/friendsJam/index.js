"use client";

import { UserContext } from "@/context";
import { supabase } from "@/lib/supabase";
import { useContext, useEffect, useState, useRef } from "react";
import debounce from "lodash/debounce";

const JamComponent = () => {
  const {
    isJamChecked,
    songList,
    currentSong,
    setSongList,
    setCurrentSong,
    currentIndex,
    currentId,
    setCurrentId,
    setCurrentIndex,
    connectedJam
  } = useContext(UserContext);

  const connectedJamRef = useRef(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const lastUpdateSource = useRef(null);
  const isRealTimeUpdate = useRef(false);

  // Fetch active users and subscribe to Supabase real-time updates
  useEffect(() => {
    if (!connectedJam) return; // Load only if connectedJam is true

    const fetchActiveUsers = async () => {
      const { data, error } = await supabase.from('jams').select('*');
      if (error) {
        console.error('Error fetching active users:', error);
      } else {
        setActiveUsers(data);
        data.forEach((user) => {
          if (Date.now() - new Date(user.last_updated).getTime() > 3600000) {
            deleteOldRow(user.id);
          }
        });
      }
    };

    const deleteOldRow = async (id) => {
      const { error } = await supabase.from('jams').delete().eq('id', id);
      if (error) {
        console.error('Error deleting old jam row:', error);
      } else {
        console.log("Successfully deleted old rows");
      }
    };

    const updateRow = (updatedRow) => {
      if (connectedJamRef.current === updatedRow.code && lastUpdateSource.current !== updatedRow.code) {
        isRealTimeUpdate.current = true;
        const value = JSON.parse(updatedRow.content);
        setSongList(value.songList);
        setCurrentSong(value.currentSong);
        setCurrentId(value.currentId);
        setCurrentIndex(value.currentIndex);
        console.log('Updated song data from real-time event');
      }

      setActiveUsers((prevUsers) =>
        prevUsers.map(user => user.id === updatedRow.id ? updatedRow : user)
      );
    };

    const channel = supabase
      .channel('public:jams')
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'jams'
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setActiveUsers((prevUsers) => [...prevUsers, payload.new]);
        } else if (payload.eventType === 'UPDATE') {
          updateRow(payload.new);
        } else if (payload.eventType === 'DELETE') {
          setActiveUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== payload.old.id)
          );
        }
      })
      .subscribe();

    fetchActiveUsers();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [connectedJam]); // Only run when connectedJam changes

  if (!connectedJam) {
    return null; // Do not render anything if connectedJam is not true
  }

  return (
    <div className="mt-4 mb-14 sm:mb-6">
      <h2 className="text-2xl font-semibold text-sky-900 dark:text-sky-300 mb-4">Jam Users</h2>
      <div className="flex flex-wrap gap-4">
        {activeUsers && activeUsers.length > 0 && activeUsers.map((user, index) => (
          <div
            key={index}
            className={`border p-4 rounded-lg shadow-md transition-colors duration-300 ${user.code === connectedJam ? "bg-purple-100 dark:bg-purple-900 border-purple-500" : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              }`}
          >
            {user.code === connectedJam ? (
              <strong className="text-purple-700 dark:text-purple-300">You: {user.code}</strong>
            ) : (
              <span className="text-gray-700 dark:text-gray-300">{user.code}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JamComponent;
