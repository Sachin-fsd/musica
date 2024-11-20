// src/components/InstallPromptIcon.js
'use client';

import { useState, useEffect } from 'react';
import { Download } from "lucide-react"; // Lucide Download icon
import { toast } from 'sonner';

const InstallPromptNav = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;

    // Check if the app is in standalone mode
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    // Detect iOS
    setIsIOS(/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e); // Save the event for triggering the install prompt
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      // Cleanup event listener on component unmount
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (isIOS) {
      // Show instructions for iOS users
      toast("To install this app on your iOS device, tap the share button and then 'Add to Home Screen'.");
    } else if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          toast.success("App installation accepted!");
        } else {
          toast.error("App installation dismissed.");
        }
        setDeferredPrompt(null); // Reset the deferredPrompt
      });
    } else {
      toast("Installation is not supported on this browser or device.");
    }
  };

  // Hide the install button if the app is already installed
  if (isStandalone) return null;

  return (
    <div
      onClick={handleInstallClick}
      className="flex md:flex-col items-center w-full ml-1 rounded-md hover:scale-102 transition-transform duration-200 ease-in-out group cursor-pointer"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-300">
        <Download />
      </div>
    </div>
  );
};

export default InstallPromptNav;
