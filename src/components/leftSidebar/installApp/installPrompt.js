'use client';

import { useState, useEffect } from 'react';
import { Download } from "lucide-react"; // Lucide Download icon
import { toast } from 'sonner';

const InstallPromptIcon = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    
    // Detect if the user is on iOS
    setIsIOS(/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream);

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (isIOS) {
      // Show instructions for iOS users
      toast("To install this app on your iOS device, tap the share button and then 'Add to Home Screen'.");
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null); // Clear the deferredPrompt after interaction
      });
    }
  };

  if (isStandalone) return null; // If already installed, hide the icon

  return (
    <div
      onClick={handleInstallClick}
      className="flex md:flex-col items-center w-full p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 transition-transform duration-200 ease-in-out group cursor-pointer"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-300">
        <Download />
      </div>
      <span className="md:text-xs text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-300 font-bold">
        Install
      </span>
    </div>
  );
};

export default InstallPromptIcon;
