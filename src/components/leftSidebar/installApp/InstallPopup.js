'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const InstallPopup = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
      navigator.standalone
    );

    const handleBeforeInstallPrompt = (e) => {
      e.prompt();
      e.preventDefault(); // Prevent automatic prompt
      setDeferredPrompt(e); // Save the event
    };

    // Listen for the `beforeinstallprompt` event
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Automatically trigger the prompt if conditions are met
    if (deferredPrompt) {
      setTimeout(() => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            toast.success("App installation started!");
          } else {
            toast.error("App installation dismissed.");
          }
          setDeferredPrompt(null); // Clear the prompt after user action
        });
      }, 3000); // Delay to allow the page to load completely
    }

    return () => {
      // Clean up the event listener
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, [deferredPrompt]);

  // Don't show anything if the app is already installed
  if (isStandalone) return null;

  return null; // Component doesn't render any UI
};

export default InstallPopup;
