'use client';

import { UserContext } from "@/context";
import { supabase } from "@/lib/supabase";
import { useContext, useEffect, useState, useRef, useCallback } from "react";
import debounce from "lodash/debounce";

const JamComponent = () => {
  const {
    isJamChecked, songList, currentSong, setSongList, setCurrentSong,
    currentIndex, currentId, setCurrentId, setCurrentIndex
  } = useContext(UserContext);

  const [jamCode, setJamCode] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [connectedJam, setConnectedJam] = useState(null);
  const connectedJamRef = useRef(null);

  useEffect(() => {
    const storedJamCode = localStorage.getItem("jam_code");
    if (storedJamCode) {
      setJamCode(storedJamCode);
    }
  }, []);

  const generateJamCode = () => Date.now().toString(36);

  const createOrFetchJamRow = useCallback(async () => {
    try {
      let code = jamCode;
      if (!code) {
        code = generateJamCode();
        const { data, error } = await supabase
          .from('jams')
          .upsert({
            content: { songList, currentSong, currentIndex, currentId },
            code: code,
            last_updated: new Date().toISOString()
          }, { onConflict: ['code'] })
          .select('code')
          .single();

        if (error) throw error; // Throw error to be caught by catch block

        localStorage.setItem('jam_code', data.code);
        setJamCode(data.code);
        console.log('Jam row created with code:', data.code);
      }
    } catch (error) {
      console.error('Error creating or fetching jam row:', error);
      // Optionally: set an error state to show a message to the user
    }
  }, [jamCode, songList, currentSong, currentIndex, currentId]);

  const deleteJamRow = useCallback(async () => {
    const code = localStorage.getItem("jam_code");
    if (code) {
      try {
        const { error } = await supabase.from('jams').delete().eq('code', code);
        if (error) throw error;

        console.log('Jam row deleted successfully.');
        localStorage.removeItem('jam_code');
        setJamCode(null);
        setConnectedJam(null);
        connectedJamRef.current = null;
      } catch (error) {
        // This will catch the net::ERR_NAME_NOT_RESOLVED error gracefully
        console.error('Error deleting jam row:', error);
      }
    }
  }, []);

  // Effect to handle turning the jam on or off
  useEffect(() => {
    if (isJamChecked) {
      createOrFetchJamRow();
    } else {
      deleteJamRow();
    }
  }, [isJamChecked, createOrFetchJamRow, deleteJamRow]);

  // Effect for real-time updates and fetching users
  useEffect(() => {
    if (!isJamChecked || !jamCode) return;

    const fetchAndCleanActiveUsers = async () => {
      try {
        const { data, error } = await supabase.from('jams').select('*');
        if (error) throw error;

        const now = Date.now();
        const staleUserIds = data
          .filter(user => now - new Date(user.last_updated).getTime() > 3600000)
          .map(user => user.id);

        if (staleUserIds.length > 0) {
          const { error: deleteError } = await supabase.from('jams').delete().in('id', staleUserIds);
          if (deleteError) throw deleteError;
        }
        setActiveUsers(data.filter(user => !staleUserIds.includes(user.id)));
      } catch (error) {
        console.error('Error fetching or cleaning active users:', error);
      }
    };

    fetchAndCleanActiveUsers();

    const channel = supabase
      .channel('public:jams')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jams' },
        (payload) => {
          // ... (real-time logic remains the same)
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isJamChecked, jamCode, setSongList, setCurrentSong, setCurrentId, setCurrentIndex]);

  // Debounced effect for updating jam content
  useEffect(() => {
    if (!isJamChecked || !jamCode || connectedJamRef.current) return;

    const updateJamContent = debounce(async () => {
      try {
        const { error } = await supabase
          .from('jams')
          .update({ content: { songList, currentSong, currentId, currentIndex }, last_updated: new Date().toISOString() })
          .eq('code', jamCode);

        if (error) throw error;

      } catch (error) {
        console.error('Error updating jam content:', error);
      }
    }, 500);

    updateJamContent();
    return () => updateJamContent.cancel();
  }, [songList, currentSong, currentIndex, currentId, isJamChecked, jamCode]);

  // ... rest of the component remains the same
  // handleJamConnect, return statement, etc.

  function handleJamConnect(code) {
    if (!isJamChecked) return;

    if (connectedJam === code) {
      setConnectedJam(null);
      connectedJamRef.current = null;
    } else {
      const userJam = activeUsers.find(user => user.code === code);
      if (userJam) {
        const value = userJam.content;
        setSongList(value.songList);
        setCurrentSong(value.currentSong);
        setCurrentId(value.currentId);
        setCurrentIndex(value.currentIndex);
        setConnectedJam(code);
        connectedJamRef.current = code;
      }
    }
  }

  if (!isJamChecked) {
    return null;
  }

  return (
    <div className="mt-4 mb-14 sm:mb-6">
      <h2 className="text-2xl font-semibold text-sky-900 dark:text-sky-300 mb-4">Jam Sessions</h2>
      <div className="flex flex-wrap gap-4">
        {activeUsers.map(user => (
          <div
            key={user.id}
            className={`border p-4 rounded-lg shadow-md transition-colors duration-300 ${user.code === jamCode ? "bg-purple-100 dark:bg-purple-900 border-purple-500" : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"}`}
          >
            {user.code === jamCode ? (
              <strong className="text-purple-700 dark:text-purple-300">Your Jam: {user.code}</strong>
            ) : (
              <button
                className="cursor-pointer text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                onClick={() => handleJamConnect(user.code)}
              >
                {connectedJam === user.code ? "Disconnect" : `Connect: ${user.code}`}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JamComponent;

// const JamComponent = () => {
//   return null;
// }
// export default JamComponent;