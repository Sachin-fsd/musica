'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useThemeColorStore } from '@/store/useThemeColorStore';
import { withAlpha } from '@/utils/themeColor';
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
  const themeColor = useThemeColorStore((s) => s.themeColor);

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
      className="relative w-full h-[195px] overflow-hidden rounded-t-xl transition-colors duration-700"
      style={{
        background: 'linear-gradient(120deg, hsl(var(--background)), hsl(var(--background)))',
        WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
      }}
    >

      {/* BACKGROUND — radial tints from the playing song's theme color.
          Keyed on the theme so the layers crossfade when the song changes. */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={themeColor}
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          style={{
            background: `radial-gradient(circle at 82% 70%, ${withAlpha(themeColor, 0.22)}, transparent 35%), radial-gradient(circle at 65% 30%, ${withAlpha(themeColor, 0.1)}, transparent 40%)`,
          }}
        />
      </AnimatePresence>

      {/* Glow blobs — background-color transitions smoothly */}
      <div
        className="absolute -right-16 bottom-[-100px] w-[430px] h-[220px] rounded-full blur-[70px] pointer-events-none"
        style={{ backgroundColor: withAlpha(themeColor, 0.28), transition: 'background-color 1s ease' }}
      />
      <div
        className="absolute right-[15%] top-[15px] w-[260px] h-[100px] rounded-full blur-[60px] pointer-events-none"
        style={{ backgroundColor: withAlpha(themeColor, 0.14), transition: 'background-color 1s ease' }}
      />

      {/* LIGHT WAVES */}
      <svg className="absolute right-[-10px] bottom-[-5px] w-[52%] h-[120px] opacity-60 pointer-events-none" viewBox="0 0 600 120" preserveAspectRatio="none">
        <defs>
          <linearGradient id="heroWave" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={themeColor} stopOpacity="0" />
            <stop offset="55%" stopColor={themeColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={themeColor} stopOpacity="0.85" />
          </linearGradient>
        </defs>

        <path d="M0 90 C100 30,130 110,230 60 S380 20,600 75" fill="none" stroke="url(#heroWave)" strokeWidth="1.5" />
        <path d="M0 105 C100 50,150 115,250 70 S420 30,600 65" fill="none" stroke="url(#heroWave)" strokeWidth="1" opacity="0.6" />
        <path d="M80 100 C160 40,210 100,300 55 S450 20,600 50" fill="none" stroke="url(#heroWave)" strokeWidth="1" opacity="0.45" />
        <path d="M170 115 C250 65,320 100,390 60 S500 30,600 45" fill="none" stroke="url(#heroWave)" strokeWidth="1" opacity="0.35" />
      </svg>

      {/* SMALL PARTICLES */}
      <div
        className="absolute right-[30%] top-[35px] w-1 h-1 rounded-full pointer-events-none"
        style={{ backgroundColor: withAlpha(themeColor, 0.4), transition: 'background-color 1s ease' }}
      />
      <div
        className="absolute right-[24%] top-[70px] w-1 h-1 rounded-full pointer-events-none"
        style={{ backgroundColor: withAlpha(themeColor, 0.3), transition: 'background-color 1s ease' }}
      />
      <div
        className="absolute right-[12%] top-[25px] w-1 h-1 rounded-full pointer-events-none"
        style={{ backgroundColor: withAlpha(themeColor, 0.3), transition: 'background-color 1s ease' }}
      />

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
            <h1 className="font-bold tracking-tight leading-[1.05] py-auto">
              <span className="block text-[40px] md:text-[50px] text-foreground drop-shadow-sm">
                {greetingText}
              </span>
            </h1>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};

export default HeroSection;
