"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { UserContext } from "@/context";

const MainSongPhoto = () => {
  const { currentSong } = useContext(UserContext);
  const imgRef = useRef(null);

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        borderRadius: "8px",
        // boxShadow: `0 0 20px 6px ${glowColor}`,
        transition: "box-shadow 0.3s ease", // Smooth transition for the glow effect
      }}
    >
      <img
        ref={imgRef}
        src={currentSong?.image[2].url || '/favicon.png'}
        alt={currentSong?.name}
        // onLoad={extractColor}
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
