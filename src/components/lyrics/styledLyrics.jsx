'use client'
import { UserContext } from '@/context'
import React, { useContext, useState, useEffect, useRef } from 'react'
import { Music, AlertCircle, Loader2 } from 'lucide-react'
import { fetchLyricsAction } from '@/app/actions'
import { useLyricsStore } from '@/store/useLyricsStore'

function StyledLyrics() {
  const { currentSong, playing, currentTime, handleSeek } = useContext(UserContext);
  const [lyrics, setLyrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [isVisible, setIsVisible] = useState(true);
  const lyricsContainerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastUpdateTimeRef = useRef(0);

  useEffect(() => {
    if (!currentSong || !currentSong.id) {
      setLyrics(null);
      return;
    }

    const fetchLyrics = async () => {
      const { getLyrics, setLyrics: setCachedLyrics } = useLyricsStore.getState();
      const cached = getLyrics(currentSong.id);
      if (cached) {
        setLyrics(cached);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setCurrentLineIndex(-1);
      
      try {
        const artistName = currentSong.artists?.primary?.[0]?.name || '';
        const trackName = currentSong.name || '';
        const albumName = currentSong.album?.name || '';
        const duration = currentSong.duration || 0;
        
        const data = await fetchLyricsAction(artistName, trackName, albumName, duration);
        setLyrics(data);
        setCachedLyrics(currentSong.id, data);
      } catch (err) {
        console.error('Error fetching lyrics:', err, currentSong);
        setError(err.message);
        setLyrics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLyrics();
  }, [currentSong]);

  // Handle lyric line progression based on current time
  useEffect(() => {
    if (!lyrics?.synced || !playing) {
      return;
    }

    let left = 0;
    let right = lyrics.synced.length - 1;
    let activeIndex = -1;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (lyrics.synced[mid].time <= currentTime) {
        activeIndex = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    // Only trigger animation when line actually changes
    if (activeIndex !== currentLineIndex) {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentLineIndex(activeIndex);
        setIsVisible(true);
      }, 150); // Match with exit animation duration
    }
  }, [currentTime, lyrics, playing, currentLineIndex]);

  // Cleanup animation frame
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (!currentSong || !currentSong.id) {
    return null;
  }

  if (loading) {
    return null;
  }

  if (error || !lyrics || lyrics.instrumental) {
    return null;
  }

  // Render only the current line with animation
  if (lyrics.synced && lyrics.synced.length > 0) {
    const currentLine = currentLineIndex >= 0 ? lyrics.synced[currentLineIndex] : null;
    
    if(!currentLine){
      return null;
    }
    // if (!currentLine || !currentLine.text) {
    //   return (
    //     <div className="w-[90%] h-8 flex items-center justify-center">
    //       <div className="text-4xl opacity-30">♪</div>
    //     </div>
    //   );
    // }
    let words = currentLine?.text?.split(' ');
    words.unshift('🎵');
    words.push('🎵');
    const centerIndex = Math.floor(words?.length / 2);

    return (
      <div className="w-[90%] h-22 flex items-center justify-center rounded-xl shadow-lg overflow-hidden">
        <div className="lyric-container w-full h-full flex items-center justify-center p-8">
          <div 
            className={`lyric-line transition-opacity duration-300 ${
              isVisible ? 'animate-in' : 'animate-out'
            }`}
            style={{
              fontFamily: "'Segoe UI', 'Arial Rounded MT Bold', 'Helvetica Rounded', sans-serif",
              textShadow: '0 0 15px rgba(255, 255, 255, 0.7)',
              textAlign: 'center',
              maxWidth: '90vw'
            }}
          >
            {words.map((word, index) => (
              <span
                key={index}
                className={`inline-block mx-1 font-bold ${
                  index === centerIndex 
                    ? 'text-red-500 text-4xl md:text-5xl' 
                    : 'text-white text-3xl md:text-4xl'
                }`}
                style={{
                  transformOrigin: 'center',
                  display: 'inline-block',
                  textShadow: index === centerIndex 
                    ? '0 0 20px rgba(239, 68, 68, 0.8)' 
                    : '0 0 15px rgba(255, 255, 255, 0.7)'
                }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        <style jsx>{`
          .lyric-container {
            min-height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .lyric-line {
            display: inline-block;
          }

          /* Entry Animation */
          .animate-in {
            animation: 
              zoomIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards,
              vibrate 1.5s ease-in-out 0.6s infinite;
          }

          @keyframes zoomIn {
            0% {
              opacity: 0;
              transform: scale(0.3) rotate(8deg);
            }
            70% {
              transform: scale(1.1) rotate(-2deg);
            }
            100% {
              opacity: 1;
              transform: scale(1) rotate(0);
            }
          }

          @keyframes vibrate {
            0%, 100% { transform: translateX(0) rotate(0); }
            20% { transform: translateX(-2px) rotate(-0.5deg); }
            40% { transform: translateX(2px) rotate(0.5deg); }
            60% { transform: translateX(-1px) rotate(-0.3deg); }
            80% { transform: translateX(1px) rotate(0.3deg); }
          }

          /* Exit Animation */
          .animate-out {
            animation: fadeOut 0.15s ease-out forwards;
          }

          @keyframes fadeOut {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0.95); }
          }
        `}</style>
      </div>
    );
  }

  // Fallback for plain lyrics (shouldn't happen with synced lyrics)
  return (
    <div className="w-[90%] h-[90vh] flex flex-col rounded-xl shadow-lg overflow-hidden border-2">
      <div className="flex-1 overflow-y-auto px-6">
        <div className="max-w-3xl mx-auto">
          <pre className="text-gray-700 dark:text-gray-300 text-xl leading-relaxed whitespace-pre-wrap font-sans text-center mt-8">
            {lyrics?.plain || '♪'}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default StyledLyrics;
