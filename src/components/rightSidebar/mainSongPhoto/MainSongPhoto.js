"use client";

import { useState, useEffect, useRef } from "react";
// import ColorThief from "color-thief";
// import ColorThief from './node_modules/colorthief/dist/color-thief.mjs'
import ColorThief from '../../../../node_modules/colorthief/dist/color-thief.mjs'

const MainSongPhoto = ({ src, alt }) => {
  const [glowColor, setGlowColor] = useState("");
  const imgRef = useRef(null);

  useEffect(() => {
    const image = imgRef.current;
    if (image && image.complete) {
      extractColor();
    }
  }, []);

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
      }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={extractColor}
        style={{
          display: "block",
          borderRadius: "8px",
        }}
        crossOrigin="anonymous" // Required for ColorThief to work with images from different origins
      />
    </div>
  );
};

export default MainSongPhoto;
