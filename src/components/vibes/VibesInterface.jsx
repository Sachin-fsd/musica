'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Share, Home, Search, Music, Library, User, Volume2, User, User2Icon } from 'lucide-react';
// import vibeBg from '@/assets/vibe-bg.jpg';
// import artistAvatar from '@/assets/artist-avatar.jpg';
// import userAvatar from '@/assets/user-avatar.jpg';

// Mock data for multiple vibes
const vibesData = [
  {
    id: 1,
    artist: "@soundwavebeats",
    title: "Electric Dreams",
    likes: "12.4K",
    comments: "892",
    shares: "4.2K",
    background: "pink",
    user: { avatar: User2Icon, username: "musiclover23" }
  },
  {
    id: 2,
    artist: "@neonvibes",
    title: "Midnight Pulse",
    likes: "8.7K",
    comments: "654",
    shares: "2.1K",
    background: "pink",
    user: { avatar: User, username: "beatdrop99" }
  },
  {
    id: 3,
    artist: "@synthwave_king",
    title: "Digital Horizon",
    likes: "15.2K",
    comments: "1.2K",
    shares: "5.8K",
    background: "pink",
    user: { avatar: User, username: "retrowave_fan" }
  },
  {
    id: 4,
    artist: "@bassline_queen",
    title: "Cyber City",
    likes: "9.3K",
    comments: "743",
    shares: "3.4K",
    background: "pink",
    user: { avatar: User, username: "bass_explorer" }
  },
  {
    id: 5,
    artist: "@futurebass",
    title: "Neon Nights",
    likes: "18.6K",
    comments: "2.1K",
    shares: "7.2K",
    background: "orange",
    user: { avatar: User, username: "future_sounds" }
  }
];

const VibesInterface = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);

  const currentVibe = vibesData[currentIndex];

  // Handle smooth transition to next/previous vibe
  const goToVibe = useCallback((newIndex) => {
    if (isTransitioning || newIndex < 0 || newIndex >= vibesData.length) return;
    
    setIsTransitioning(true);
    setCurrentIndex(newIndex);
    setIsLiked(false); // Reset like state for new vibe
    
    // Reset transition after animation
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [isTransitioning]);

  // Touch/Mouse event handlers for smooth scrolling
  const handleStart = (clientY) => {
    if (isTransitioning) return;
    isDragging.current = true;
    startY.current = clientY;
  };

  const handleMove = (clientY) => {
    if (!isDragging.current || isTransitioning) return;
    currentY.current = clientY;
  };

  const handleEnd = () => {
    if (!isDragging.current || isTransitioning) return;
    
    const deltaY = startY.current - currentY.current;
    const threshold = 100; // Minimum swipe distance
    
    if (Math.abs(deltaY) > threshold) {
      if (deltaY > 0 && currentIndex < vibesData.length - 1) {
        // Swipe up - next vibe
        goToVibe(currentIndex + 1);
      } else if (deltaY < 0 && currentIndex > 0) {
        // Swipe down - previous vibe
        goToVibe(currentIndex - 1);
      }
    }
    
    isDragging.current = false;
    startY.current = 0;
    currentY.current = 0;
  };

  // Mouse events
  const handleMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientY);
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e) => {
    handleStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    handleMove(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' && currentIndex > 0) {
        goToVibe(currentIndex - 1);
      } else if (e.key === 'ArrowDown' && currentIndex < vibesData.length - 1) {
        goToVibe(currentIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, goToVibe]);

  // Wheel/scroll events for desktop
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      if (isTransitioning) return;

      if (e.deltaY > 0 && currentIndex < vibesData.length - 1) {
        goToVibe(currentIndex + 1);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        goToVibe(currentIndex - 1);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [currentIndex, goToVibe, isTransitioning]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen bg-darker-surface overflow-hidden select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Video Background with smooth transition */}
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 ease-out ${
          isTransitioning ? 'scale-110 opacity-80' : 'scale-100 opacity-100'
        }`}
        style={{ backgroundImage: `url(${currentVibe.background})` }}
      >
        <div className="absolute inset-0 bg-gradient-overlay" />
      </div>

      {/* Main Content Overlay */}
      <div className={`relative z-10 h-full flex flex-col transition-all duration-500 ease-out ${
        isTransitioning ? 'opacity-90 transform translate-y-2' : 'opacity-100 transform translate-y-0'
      }`}>
        
        {/* Progress Indicators */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-1 z-30">
          {vibesData.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-8 bg-neon-blue shadow-glow-neon' 
                  : 'w-4 bg-white/30'
              }`}
            />
          ))}
        </div>
        
        {/* Bottom Content Area */}
        <div className="flex-1 flex items-end pb-24">
          <div className="w-full px-4 flex justify-between items-end">
            
            {/* Left Side - Artist Info */}
            <div className="flex-1">
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <h2 className="text-white font-semibold text-lg">{currentVibe.artist}</h2>
                  <div className="ml-3 flex items-center">
                    <Volume2 className="w-4 h-4 text-neon-blue mr-1 animate-pulse" />
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-1 bg-neon-blue rounded-full animate-pulse"
                          style={{
                            height: `${Math.random() * 16 + 8}px`,
                            animationDelay: `${i * 0.1}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-white/90 font-medium text-base mb-1">{currentVibe.title}</p>
                <p className="text-white/70 text-sm">
                  {currentIndex + 1} of {vibesData.length} • Swipe to explore →
                </p>
              </div>
            </div>

            {/* Right Side - Interaction Buttons */}
            <div className="flex flex-col items-center space-y-6 ml-4">
              
              {/* User Profile */}
              <div className="relative">
                <img
                  src={currentVibe.user.avatar}
                  alt="User"
                  className="w-14 h-14 rounded-full border-2 border-white object-cover"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-neon-pink rounded-full flex items-center justify-center border-2 border-darker-surface">
                  <span className="text-white text-xs font-bold">+</span>
                </div>
              </div>

              {/* Like Button */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="w-12 h-12 bg-surface-dark/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{ boxShadow: isLiked ? 'var(--glow-pink)' : 'none' }}
                >
                  <Heart
                    className={`w-7 h-7 transition-colors duration-300 ${
                      isLiked ? 'text-neon-pink fill-neon-pink' : 'text-white'
                    }`}
                  />
                </button>
                <span className="text-white text-xs mt-1 font-medium">{currentVibe.likes}</span>
              </div>

              {/* Comment Button */}
              <div className="flex flex-col items-center">
                <button className="w-12 h-12 bg-surface-dark/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <MessageCircle className="w-7 h-7 text-white" />
                </button>
                <span className="text-white text-xs mt-1 font-medium">{currentVibe.comments}</span>
              </div>

              {/* Share Button */}
              <div className="flex flex-col items-center">
                <button className="w-12 h-12 bg-surface-dark/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <Share className="w-7 h-7 text-white" />
                </button>
                <span className="text-white text-xs mt-1 font-medium">{currentVibe.shares}</span>
              </div>

              {/* Spinning Record */}
              <div className="flex flex-col items-center mt-4">
                <button 
                  onClick={() => {
                    // Cycle through songs with same sound
                    const nextIndex = (currentIndex + 1) % vibesData.length;
                    goToVibe(nextIndex);
                  }}
                  className="relative transition-transform duration-300 hover:scale-110"
                >
                  <div className="w-12 h-12 bg-gradient-neon rounded-full animate-spin-slow flex items-center justify-center shadow-glow-neon">
                    <img
                      src={User}
                      alt="Artist"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 border-2 border-white/30 rounded-full animate-spin-slow"></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-darker-surface/95 backdrop-blur-md border-t border-white/10">
          <div className="flex items-center justify-around py-3 px-4">
            <NavItem icon={Home} label="Home" />
            <NavItem icon={Search} label="Discover" />
            <NavItem icon={Music} label="Vibes" active />
            <NavItem icon={Library} label="Library" />
            <NavItem icon={User} label="Profile" />
          </div>
        </div>
      </div>

      {/* Dynamic Swipe Indicators */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-2 z-20">
        <div className={`w-1 h-8 rounded-full transition-all duration-300 ${
          currentIndex > 0 ? 'bg-white/50' : 'bg-white/20'
        }`}></div>
        <div className="w-1 h-4 bg-neon-blue rounded-full shadow-glow-neon"></div>
        <div className={`w-1 h-8 rounded-full transition-all duration-300 ${
          currentIndex < vibesData.length - 1 ? 'bg-white/50' : 'bg-white/20'
        }`}></div>
      </div>

      {/* Swipe Hint (appears briefly) */}
      {currentIndex === 0 && (
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
          <div className="bg-surface-dark/80 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
            <p className="text-white/70 text-sm">↑ Swipe up for next vibe</p>
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active = false }) => {
  return (
    <div className="flex flex-col items-center space-y-1">
      <div className={`p-2 rounded-full transition-all duration-300 ${
        active 
          ? 'bg-gradient-neon shadow-glow-neon' 
          : 'hover:bg-white/10'
      }`}>
        <Icon className={`w-6 h-6 ${
          active ? 'text-darker-surface' : 'text-white/80'
        }`} />
      </div>
      <span className={`text-xs font-medium ${
        active ? 'text-neon-blue' : 'text-white/60'
      }`}>
        {label}
      </span>
    </div>
  );
};

export default VibesInterface;