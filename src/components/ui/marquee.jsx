"use client";

import React from "react";

const Marquee = ({ children, speed = 10, direction = "left", className = "", style = {} }) => {
    const marqueeDirection = direction === "left" ? "translateX(100%)" : "translateX(-100%)";

    return (
        <div
            className={`marquee-container ${className}`}
            style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                position: "relative",
                ...style,
            }}
        >
            <div
                className="marquee-content"
                style={{
                    display: "inline-block",
                    animation: `marquee ${speed}s linear infinite`,
                    whiteSpace: "nowrap",
                }}
            >
                {children}
            </div>
            <style jsx>{`
        @keyframes marquee {
          0% {
          opacity:1;
            transform: translateX(100%);
          }
          99% {
          opacity:1;
            transform: translateX(-120%);
          }
          100% {
            opacity: 0;
            transform: translateX(0%);
          }
        }

        .marquee-container {
          display: flex;
          align-items: center;
        }

        .marquee-content {
          min-width: 100%;
        }
      `}</style>
        </div>
    );
};

export default Marquee;
