'use client';

import { useInstallPrompt } from './useInstallPrompt';
import { useThemeColorStore } from '@/store/useThemeColorStore';
import { withAlpha } from '@/utils/themeColor';

// Bottom-of-sidebar promo card. Same idea as HeroSection: a dark card
// with soft theme-colored glow blobs + a light wave line, all keyed off
// the currently-playing song's extracted color so it shifts in sync with
// every other themed surface in the app. Only shown in the expanded
// sidebar — there isn't room for the copy when collapsed.
const InstallPromoCard = () => {
    const { isStandalone, handleDownloadClick } = useInstallPrompt();
    const themeColor = useThemeColorStore((s) => s.themeColor);

    if (isStandalone) return null;

    return (
        <div
            className="relative w-full mt-3 rounded-xl overflow-hidden p-4"
            style={{ background: 'linear-gradient(135deg, #171025, #0c0815 70%)' }}
        >
            {/* Glow blobs — same withAlpha(themeColor) pattern as HeroSection */}
            <div
                className="absolute -right-8 -bottom-12 w-36 h-28 rounded-full blur-2xl pointer-events-none"
                style={{ backgroundColor: withAlpha(themeColor, 0.35), transition: 'background-color 1s ease' }}
            />
            <div
                className="absolute right-2 -top-4 w-20 h-20 rounded-full blur-xl pointer-events-none"
                style={{ backgroundColor: withAlpha(themeColor, 0.18), transition: 'background-color 1s ease' }}
            />

            {/* Light wave, mirroring HeroSection's heroWave gradient line */}
            <svg
                className="absolute inset-x-0 bottom-0 w-full h-12 opacity-60 pointer-events-none"
                viewBox="0 0 220 48"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id="sidebarPromoWave" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={themeColor} stopOpacity="0" />
                        <stop offset="55%" stopColor={themeColor} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={themeColor} stopOpacity="0.85" />
                    </linearGradient>
                </defs>
                <path d="M0 36 C40 12,55 40,95 22 S150 6,220 30" fill="none" stroke="url(#sidebarPromoWave)" strokeWidth="1.4" />
                <path d="M0 42 C45 20,65 44,105 26 S165 10,220 24" fill="none" stroke="url(#sidebarPromoWave)" strokeWidth="1" opacity="0.5" />
            </svg>

            <p className="relative z-10 text-[15px] font-bold text-white leading-snug mb-3">
                Feel the music
                <br />
                anywhere.
            </p>

            <button
                onClick={handleDownloadClick}
                className="relative z-10 text-xs font-bold px-4 py-2 rounded-full text-white transition-transform active:scale-95 shadow-lg"
                style={{ backgroundColor: themeColor, transition: 'background-color 0.8s ease' }}
            >
                Install Now
            </button>
        </div>
    );
};

export default InstallPromoCard;
