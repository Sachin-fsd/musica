'use client'
import { SearchSongSuggestionAction } from "@/app/actions";
import { songs } from "@/utils/cachedSongs";
import { shuffleArray } from "@/utils/extraFunctions";
import { createContext, useRef, useState, useEffect } from "react";

export const UserContext = createContext(null);

export default function UserState({ children }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentSong, setCurrentSong] = useState(songs[0]);
    const [currentId, setCurrentId] = useState(songs[0].id);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLooping, setIsLooping] = useState(false);
    const audioRef = useRef(null);
    const [songList, setSongList] = useState(songs);
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([])
    const [manualQuality, setManualQuality] = useState("very_high"); // State for manual quality selection
    const [isJamChecked, setIsJamChecked] = useState(false);

    //save songs in local storage
    // useEffect(() => {
    //     setSongList(JSON.parse(localStorage.getItem("songList"))  || songs)
    //     setCurrentSong(JSON.parse(localStorage.getItem("currentSong") ) || songs[0]);
    // }, [])

    // useEffect(() => {
    //     localStorage.setItem("songList", JSON.stringify(songList))
    // }, songList)

    // useEffect(() => {
    //     localStorage.setItem("currentSong", JSON.stringify(currentSong))
    // }, currentSong)

    // handle seek of slider
    const handleSeek = (e) => {
        const seekTime = e[0];
        audioRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
    };

    const togglePlayPause = () => {
        if (playing) {
            audioRef?.current.pause();
        } else {
            audioRef?.current.play();
        }
        setPlaying(!playing);
    };

    // update audioref with song 
    useEffect(() => {
        const handleTimeUpdate = () => {
            setCurrentTime(audioRef?.current.currentTime);
            setDuration(audioRef?.current.duration);
        };

        audioRef?.current?.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            if (audioRef?.current) {
                audioRef?.current.removeEventListener('timeupdate', handleTimeUpdate);
            }
        };
    }, [audioRef?.current]);

    // // if album ends add related songs at end
    useEffect(() => {
        const currentIndex = songList?.findIndex(song => song?.id === currentSong?.id);

        const addRelatedSongs = async () => {
            // console.log("context add related song function ran",songList, currentIndex)
            if (currentIndex === songList?.length - 1) { // Check if the current song is the last in the list
                const response = await SearchSongSuggestionAction(currentSong?.id);
                // console.log("response of context add related",response)
                if (response.success) {
                    let relatedResults = response.data;

                    relatedResults = relatedResults.filter(
                        relatedSong => !songList?.some(song => song?.id === relatedSong.id)
                    )

                    relatedResults = shuffleArray(relatedResults)
                    // console.log("Related funxt in context",relatedResults)

                    setSongList((prevList) => [...prevList, ...relatedResults]);
                }
            }
        };

        if (currentIndex !== -1) { // Ensure the current song is in the list
            addRelatedSongs();
        }
    }, [songList, currentSong]);


    // handles song end
    useEffect(() => {
        const handleSongEnd = () => {
            if (!isLooping) {
                const nextIndex = (currentIndex + 1) % songList?.length;
                setCurrentIndex(nextIndex);
                setCurrentSong(songList[nextIndex]);
                setPlaying(true);
            }
        };

        audioRef?.current?.addEventListener('ended', handleSongEnd);

        return () => {
            if (audioRef?.current) {
                audioRef?.current.removeEventListener('ended', handleSongEnd);
            }
        };
    }, [isLooping, currentIndex, songList, setCurrentIndex, setCurrentSong]);

    // Function to adjust the song quality
    const adjustQuality = () => {
        if (!currentSong) return;

        let qualityUrl;


        if (manualQuality) {
            // If manual quality is selected, use it
            const qualityIndex = {
                low: 0,
                medium: 1,
                average: 2,
                high: 3,
                very_high: 4
            }[manualQuality];
            qualityUrl = currentSong?.downloadUrl[qualityIndex]?.url;
        } else {
            qualityUrl = currentSong?.downloadUrl[4].url;
        }

        return qualityUrl;
    };

    // spacebar to pause and play music
    useEffect(() => {
        const handleSpacebar = (e) => {
            // Check if the spacebar is pressed and no input elements are focused
            if (e.code === "Space" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
                e.preventDefault(); // Prevent any default spacebar action
                // play pause function here
                togglePlayPause()
            }
        };

        window.addEventListener("keydown", handleSpacebar);

        return () => {
            window.removeEventListener("keydown", handleSpacebar);
        };
    }, [playing]);


    // play song on a quality
    useEffect(() => {
        if (!currentSong) return;

        const audioElement = audioRef?.current;

        // Preserve the current playback position
        const currentTime = audioElement.currentTime;

        // Adjust quality only when the song changes
        const qualityUrl = adjustQuality();
        if (qualityUrl) {
            // Update the audio source
            audioElement.src = qualityUrl;

            // Reload the audio element
            audioElement.load();

            // Seek to the previously stored playback position
            audioElement.currentTime = currentTime;
        }
        // Prevent song from auto-playing when paused
        if (playing) {
            audioElement.play();
        }
    }, [manualQuality]);  // Depend on manualQuality as well


    // when current song changes
    useEffect(() => {
        if (!currentSong) return;

        // Adjust quality only when the song changes
        const qualityUrl = adjustQuality();
        if (qualityUrl) {
            audioRef.current.src = qualityUrl;
        }

        // Prevent song from auto-playing when paused
        if (playing) {
            audioRef?.current.play();
        }

    }, [currentSong]);

    // when song is playing add its name to site title
    useEffect(() => {
        if (currentSong && playing) {
            document.title = `${currentSong?.name} - Musica NextGen`;
        } else {
            document.title = `Musica NextGen Music`;
        }

        if ("mediaSession" in navigator) {
            navigator.mediaSession.playbackState = playing ? "playing" : "paused";
        }
    }, [playing])

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => {
            // If there's only one song, stay on the same song
            if (songList?.length === 1) {
                return prevIndex;
            }
            return (prevIndex === 0 ? songList?.length - 1 : prevIndex - 1);
        });
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => {
            // If there's only one song, stay on the same song
            if (songList?.length === 1) {
                return prevIndex;
            }
            return (prevIndex === songList?.length - 1 ? 0 : prevIndex + 1);
        });
    };

    // for notification song player
    useEffect(() => {
        if ("mediaSession" in navigator && currentSong) {

            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentSong?.name,
                artist: currentSong?.artists?.primary[0].name,
                album: currentSong?.album?.name,
                artwork: [
                    {
                        src: currentSong?.image[2]?.url, // URL to the song's image
                        sizes: "500x500", // Image size
                        type: "image/jpg", // Or image/jpeg depending on your file
                    },
                ],
            });

            // Set media controls for play, pause, etc.
            navigator.mediaSession.setActionHandler("play", () => {
                audioRef?.current.play();
                setPlaying(true);
            });
            navigator.mediaSession.setActionHandler("pause", () => {
                audioRef?.current.pause();
                setPlaying(false);
            });

            navigator.mediaSession.setActionHandler('nexttrack', () => {
                handleNext();
            });

            navigator.mediaSession.setActionHandler('previoustrack', () => {
                handlePrev();
            });



        }
    }, [currentSong]);

    // fetch random album then random song


    let value = {
        currentSong,
        setCurrentSong,
        playing,
        setPlaying,
        currentTime,
        setCurrentTime,
        duration,
        setDuration,
        isLooping,
        setIsLooping,
        audioRef,
        handleSeek,
        currentIndex,
        setCurrentIndex,
        setSongList,
        songList,
        currentId,
        setCurrentId,
        loading,
        setLoading,
        handleNext,
        handlePrev,
        manualQuality,
        setManualQuality,
        togglePlayPause,
        searchResults,
        setSearchResults,
        isJamChecked,
        setIsJamChecked
    };

    return (
        <UserContext.Provider value={value}>
            {children}
            <audio
                ref={audioRef}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onLoadedData={() => {
                    // audioRef?.current.currentTime = currentTime;
                    audioRef?.current.duration ? setDuration(audioRef.current.duration) : setDuration(0)
                }}
                loop={isLooping}
            />
        </UserContext.Provider>
    );
}
