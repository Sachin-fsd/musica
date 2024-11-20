'use client';

import { useState, useEffect } from 'react';
import { Download } from "lucide-react"; // Lucide Download icon
import { toast } from 'sonner';

const InstallPromptIcon = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;

    // Check if the app is running in standalone mode
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    // Detect if the user is on iOS
    setIsIOS(/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Prevent the default prompt
      setDeferredPrompt(e); // Save the event for later
    };

    // Add event listener for the `beforeinstallprompt` event
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      // Clean up the event listener
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (isIOS) {
      // Show installation instructions for iOS
      toast("To install on iOS, tap the share icon and then 'Add to Home Screen'.");
    } else if (deferredPrompt) {
      // Trigger the install prompt
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          toast.success("App installation started!");
        } else {
          toast.error("App installation dismissed.");
        }
        setDeferredPrompt(null); // Clear the deferred prompt
      });
    } else {
      // If no deferred prompt is available
      toast.error("Installation prompt not available.");
    }
  };

  // If the app is already installed, do not display the icon
  if (isStandalone) return null;

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
