'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { TEMPLATES, DAY_KEYS } from '../Greeting/greetingsData';

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

function pickGreetingText() {
  const hour = new Date().getHours();
  const dayKey = DAY_KEYS[new Date().getDay()];
  const roll = Math.random();

  let bucket;

  if (roll < 0.4) {
    if (hour < 5) bucket = 'lateNight';
    else if (hour < 12) bucket = 'morning';
    else if (hour < 17) bucket = 'afternoon';
    else if (hour < 21) bucket = 'evening';
    else bucket = 'night';
  } else if (roll < 0.7) {
    bucket = dayKey;
  } else {
    bucket = 'generic';
  }

  return rand(TEMPLATES[bucket]);
}

const fillName = (template, name) => template.replaceAll('{name}', name);

const HeroSection = () => {
  const { user, authLoading } = useAuth();

  const firstName = user?.name?.split(' ')[0] || 'there';
  const [greetingText, setGreetingText] = useState('');

  const roll = useCallback(() => {
    setGreetingText(fillName(pickGreetingText(), firstName));
  }, [firstName]);

  useEffect(() => {
    roll();
  }, [roll]);

  if (authLoading || !greetingText) {
    return <div className="h-[195px]" aria-hidden />;
  }

  return (
    <section
      className="relative w-full h-[195px] overflow-hidden rounded-t-xl bg-[#080611]"
      style={{
        WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
      }}
    >

      {/* BACKGROUND */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_70%,rgba(255,0,180,0.20),transparent_35%),radial-gradient(circle_at_65%_30%,rgba(120,0,255,0.10),transparent_40%),linear-gradient(120deg,#080611,#07040d_60%,#0b0614)]" />

      <div className="absolute -right-16 bottom-[-100px] w-[430px] h-[220px] rounded-full bg-fuchsia-600/30 blur-[70px]" />

      <div className="absolute right-[15%] top-[15px] w-[260px] h-[100px] rounded-full bg-purple-700/15 blur-[60px]" />

      {/* LIGHT WAVES */}

      <svg className="absolute right-[-10px] bottom-[-5px] w-[52%] h-[120px] opacity-60" viewBox="0 0 600 120" preserveAspectRatio="none">
        <defs>
          <linearGradient id="heroWave" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7c00ff" stopOpacity="0" />
            <stop offset="55%" stopColor="#c000ff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ff00b7" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        <path d="M0 90 C100 30,130 110,230 60 S380 20,600 75" fill="none" stroke="url(#heroWave)" strokeWidth="1.5" />
        <path d="M0 105 C100 50,150 115,250 70 S420 30,600 65" fill="none" stroke="url(#heroWave)" strokeWidth="1" opacity="0.6" />
        <path d="M80 100 C160 40,210 100,300 55 S450 20,600 50" fill="none" stroke="url(#heroWave)" strokeWidth="1" opacity="0.45" />
        <path d="M170 115 C250 65,320 100,390 60 S500 30,600 45" fill="none" stroke="url(#heroWave)" strokeWidth="1" opacity="0.35" />
      </svg>

      {/* SMALL PARTICLES */}

      <div className="absolute right-[30%] top-[35px] w-1 h-1 rounded-full bg-purple-400/40" />
      <div className="absolute right-[24%] top-[70px] w-1 h-1 rounded-full bg-fuchsia-400/30" />
      <div className="absolute right-[12%] top-[25px] w-1 h-1 rounded-full bg-purple-300/30" />

      {/* CONTENT */}

      <div className="relative z-10 h-full px-6 md:px-7 py-6 md:py-7">

        {/* GREETING */}

        <AnimatePresence mode="wait">
          <motion.div
            key={greetingText}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <h1 className="font-bold tracking-tight leading-[3.05]">
              <span className="block text-[50px] md:text-[36px] text-white">
                {greetingText}
              </span>

              {/* <span className="block text-[40px] md:text-[44px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-purple-500 to-fuchsia-400">
                {firstName}
              </span> */}
            </h1>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};

export default HeroSection;