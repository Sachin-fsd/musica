'use client';

import { useState, useEffect } from 'react';
import { Download } from "lucide-react"; // Lucide Download icon
import { toast } from 'sonner';

const InstallPromptIcon = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect if the user is on iOS
    const userAgent = typeof window !== "undefined" ? window.navigator.userAgent : "";
    setIsIOS(/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream);

    // Detect if the app is already installed
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsStandalone(standalone);

    const handleBeforeInstallPrompt = (e) => {
      e.prompt();
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', function (event) {
      console.log(event)
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      // event.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(event);
    });

    // window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

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
      deferredPrompt.userChoice
        .then((choice) => {
          if (choice.outcome === "accepted") {
            toast.success("App installed successfully!");
          } else {
            toast.error("App installation canceled.");
          }
          setDeferredPrompt(null); // Clear the deferredPrompt after interaction
        })
        .catch((error) => {
          console.error("Error during app installation:", error);
          toast.error("An error occurred during installation.");
        });
    } else {
      console.log(deferredPrompt)
      toast.error("Installation prompt is not available.");
    }
  };

  // Hide the icon if the app is already installed
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
