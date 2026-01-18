"use client";

import { useState, useEffect, useRef, useContext } from "react";
import ColorThief from '../../../../node_modules/colorthief/dist/color-thief.mjs';
import { UserContext } from "@/context";

const MainSongPhoto = () => {
  const { currentSong } = useContext(UserContext);
  const [glowColor, setGlowColor] = useState("");
  const imgRef = useRef(null);

  // Ensuring the image is loaded before extracting the color
  useEffect(() => {
    if (!currentSong || !currentSong?.image[2]?.url) return;
    const image = imgRef.current;
    if (image) {
      // Adding event listener to ensure the image is loaded
      const onLoadHandler = () => extractColor();
      if (image.complete) {
        extractColor();
      } else {
        image.addEventListener("load", onLoadHandler);
      }

      // Cleanup event listener when component unmounts or image changes
      return () => {
        image.removeEventListener("load", onLoadHandler);
      };
    }
  }, [currentSong]); // Adding src as a dependency to re-run effect if the image changes

  const extractColor = () => {
    const colorThief = new ColorThief();
    const image = imgRef.current;
    if (image) {
      const [r, g, b] = colorThief.getColor(image);
      setGlowColor(`rgb(${r}, ${g}, ${b})`);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        borderRadius: "8px",
        boxShadow: `0 0 20px 6px ${glowColor}`,
        transition: "box-shadow 0.3s ease", // Smooth transition for the glow effect
      }}
    >
      <img
        ref={imgRef}
        src={currentSong?.image[2].url || '/favicon.png'}
        alt={currentSong?.name}
        onLoad={extractColor}
        style={{
          display: "block",
          borderRadius: "8px",
          objectFit: "cover", // Ensures the image fits the container properly
          width: "100%", // Make sure the image fills the container
          height: "100%", // Ensure the height also matches
        }}
        crossOrigin="anonymous" // Required for ColorThief to work with images from different origins
      />
    </div>
  );
};

export default MainSongPhoto;
