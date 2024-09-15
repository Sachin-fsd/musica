// src/components/InstallPrompt.js
'use client';

import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Detect if the user is on iOS
    const userAgent = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream);

    // Check if the app is already installed
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Prevent automatic prompt
      setDeferredPrompt(e); // Save the event for manual triggering
      // document.body.style.backgroundColor = "red"
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show the install prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        setDeferredPrompt(null); // Clear the deferredPrompt after interaction
      });
    }
  };

  // Don't show the install button if already installed
  if (isStandalone) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-sm mx-auto my-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Install App</h3>
      {!isIOS && deferredPrompt && (
        <button
          onClick={handleInstallClick}
          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          Add to Home Screen
        </button>
      )}
      {isIOS && (
        <p className="text-center text-gray-600 dark:text-gray-300 mt-4">
          To install this app on your iOS device, tap the share button
          <span role="img" aria-label="share icon" className="mx-1"> ⎋ </span>
          and then "Add to Home Screen"
          <span role="img" aria-label="plus icon" className="mx-1"> ➕ </span>.
        </p>
      )}
    </div>
  );
}
