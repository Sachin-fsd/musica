'use client';

import { useState, useEffect } from 'react';
import { Download } from "lucide-react"; // Icon
import { toast } from 'sonner'; // Toast notifications

const InstallPromptIcon = () => {
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Check if the app is in standalone mode
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Prevent automatic prompt display
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
      // Download APK
      const apkUrl = "/Musica.apk"; // Replace with your APK URL
      const link = document.createElement("a");
      link.href = apkUrl;
      link.download = "Musica.apk"; // Optional: Default file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Downloading APK...");
    } else if (isIOS) {
      // Show iOS instructions
      toast("To install this app on your iPhone, tap the share button and select 'Add to Home Screen'.");
    } else {
      // Show instructions for desktop or other devices
      toast("To install this app, use the 'Install' option in your browser settings.");
    }
  };

  // Hide the button if the app is already installed
  if (isStandalone) return null;

  return (
    <div
      onClick={handleDownloadClick}
      className="flex items-center w-full p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 transition-transform duration-200 ease-in-out group cursor-pointer"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-300">
        <Download />
      </div>
      <span className="md:text-xs text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-300 font-bold">
        Install App
      </span>
    </div>
  );
};

export default InstallPromptIcon;