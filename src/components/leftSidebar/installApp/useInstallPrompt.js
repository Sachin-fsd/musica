'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Shared PWA-install logic. Used by both the plain sidebar row
// (InstallPromptIcon) and the promo card (InstallPromoCard) so the two
// stay in sync instead of duplicating the platform-detection logic.
export function useInstallPrompt() {
    const [isAndroid, setIsAndroid] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        if (deferredPrompt) {
            deferredPrompt.prompt();
        }

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, [deferredPrompt]);

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        setIsAndroid(/android/i.test(userAgent));
        setIsIOS(/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream);
    }, []);

    const handleDownloadClick = () => {
        if (isAndroid) {
            const apkUrl = "/Musica.apk"; // Replace with your APK URL
            const link = document.createElement("a");
            link.href = apkUrl;
            link.download = "Musica.apk";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("Downloading APK...");
        } else if (isIOS) {
            toast("To install this app on your iPhone, tap the share button and select 'Add to Home Screen'.");
        } else {
            toast("To install this app, use the 'Install' option in your browser settings.");
        }
    };

    return { isStandalone, handleDownloadClick };
}
