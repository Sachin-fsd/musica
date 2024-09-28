'use client';

import { UserContext } from "@/context";
import { supabase } from "@/lib/supabase";
import { useContext, useEffect, useState, useRef } from "react";
import debounce from "lodash/debounce";

const JamComponent = () => {
  const {
    isJamChecked, songList, currentSong, setSongList, setCurrentSong,
    currentIndex, currentId, setCurrentId, setCurrentIndex
  } = useContext(UserContext);

  const connectedJamRef = useRef(null);
  const [jam_code, set_jam_code] = useState(getJamCode);
  const [activeUsers, setActiveUsers] = useState([]);
  const [connectedJam, setConnectedJam] = useState(null);
  const lastUpdateSource = useRef(null);
  const isRealTimeUpdate = useRef(false);

  function getJamCode() {
    if (typeof window === 'undefined') return;
    return localStorage.getItem("jam_code") || null;
  }

  const generateJamCode = () => {
    return Date.now().toString(36); // Generate a unique jam code
  };

  const createOrFetchJamRow = async () => {
    if (!jam_code) {
      const { data, error } = await supabase
        .from('jams')
        .upsert({
          content: { songList, currentSong, currentIndex, currentId },
          code: generateJamCode(),
          last_updated: new Date()
        }, { onConflict: ['code'] })
        .select('code')
        .single();

      if (error) {
        console.error('Error creating or fetching jam:', error);
      } else {
        const new_jam_code = data.code;
        localStorage.setItem('jam_code', new_jam_code);
        set_jam_code(new_jam_code);
        console.log('Jam row created with code:', new_jam_code);
      }
    } else {
      const { data: existingJam, error } = await supabase
        .from('jams')
        .select('*')
        .eq('code', jam_code)
        .single();

      if (error && error.code === 'PGRST116') {
        const { data, error: insertError } = await supabase
          .from('jams')
          .upsert([{ content: { songList, currentSong, currentIndex, currentId }, code: jam_code, last_updated: new Date() }]);

        if (insertError) {
          console.error('Error creating new jam with existing code:', insertError);
        }
      } else if (existingJam) {
        console.log('Jam row already exists with jam_code:', jam_code);
      }
    }
  };

  const deleteJamRow = async () => {
    if (jam_code) {
      const { error } = await supabase
        .from('jams')
        .delete()
        .eq('code', jam_code);

      if (error) {
        console.error('Error deleting jam row:', error);
      } else {
        console.log('Jam row deleted successfully.');
        set_jam_code(null);
      }
    }
  };

  // Listen for changes in isJamChecked
  useEffect(() => {
    if (isJamChecked) {
      // When jam is turned on, create or fetch the jam row
      createOrFetchJamRow();
    } else {
      // When jam is turned off, delete the jam row
      deleteJamRow();
    }
  }, [isJamChecked]);

  useEffect(() => {

    if (!isJamChecked) return; // Don't proceed if Jam is turned off

    const fetchActiveUsers = async () => {
      const { data, error } = await supabase.from('jams').select('*');
      if (error) {
        console.error('Error fetching active users:', error);
      } else {
        setActiveUsers(data);
        data.map((user)=>{
          // console.log(Date.now()-new Date(user.last_updated).getTime()>3600000)
          if(Date.now()-new Date(user.last_updated).getTime()>3600000){
            console.log("Old row found")
            deleteOldRow(user.id)
          }
        })
      }
    };

    async function deleteOldRow(id){
      const { error } = await supabase
      .from('jams')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting jam row:', error);
    } else {
      console.log("SUccessfully deleted old rows")
    }
    }

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
  }, [jam_code, isJamChecked]);

  useEffect(() => {
    if (!isJamChecked || !jam_code) return;
    const updateJamContent = debounce(async () => {
      if (jam_code) {
        lastUpdateSource.current = jam_code;

        if (isRealTimeUpdate.current) {
          console.log('Skipping update due to real-time event...');
          isRealTimeUpdate.current = false;
          return;
        }

        const { error } = await supabase
          .from('jams')
          .update({ content: { songList, currentSong, currentId, currentIndex }, last_updated: new Date() })
          .eq('code', jam_code);

        if (error) {
          console.error('Error updating jam content:', error);
        } else {
          console.log('Jam content updated successfully');
        }
      }
    }, 300);

    if (jam_code) {
      updateJamContent();
    }
  }, [songList, currentSong, jam_code, currentIndex, isJamChecked]);

  function handleJamConnect(code) {
    if (!isJamChecked) {
      return;
    }
    if (connectedJam) {
      console.log("Disconnecting from current jam:", connectedJam);
      setConnectedJam(null);
      connectedJamRef.current = null;
    } else {
      const userJam = activeUsers.find(user => user.code === code);
      if (userJam) {
        const value = JSON.parse(userJam.content);
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
      <h2 className="text-2xl font-semibold text-sky-900 dark:text-sky-300 mb-4">Jam Users</h2>
      <div className="flex flex-wrap gap-4">
        {activeUsers && activeUsers.length > 0 && activeUsers.map((user, index) => (
          <div
            key={index}
            className={`border p-4 rounded-lg shadow-md transition-colors duration-300 ${user.code === jam_code ? "bg-purple-100 dark:bg-purple-900 border-purple-500" : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              }`}
          >
            {user.code === jam_code ? (
              <strong className="text-purple-700 dark:text-purple-300">You: {user.code}</strong>
            ) : (
              <span
                className="cursor-pointer text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                onClick={() => handleJamConnect(user.code)}
              >
                {connectedJam === user.code ? "Disconnect" : "Connect"}: {user.code}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>

  );
};

export default JamComponent;

//block event loop
//network request
//long compitation
//i/o operation