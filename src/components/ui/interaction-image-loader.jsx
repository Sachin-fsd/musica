'use client'

import { useEffect, useRef, useState } from "react";

const LazyImage = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setLoaded(true);  // Trigger the image load when the image is in the viewport
            observer.disconnect();  // Stop observing after the image has loaded
          }
        });
      },
      { threshold: 0.1 }
    );
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={imgRef}
      className={className}
      style={{
        backgroundImage: loaded ? `url(${src})` : "none",
      }}
    />
  );
};

// Usage
{/* <LazyImage
  src={currentSong?.image[0]?.url}
  alt={`${currentSong?.name} cover`}
  className="rounded-lg bg-cover bg-center"
/> */}
