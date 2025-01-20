"use client";

import { useState } from "react";

const TouchableOpacity = ({ children, onClick, className = '', style = {}, ...props }) => {
  const [clickEffect, setClickEffect] = useState(false);

  const handlePressIn = (e) => {
    e.currentTarget.style.opacity = '0.6';
    e.currentTarget.style.transform = 'scale(0.96)';
  };

  const handlePressOut = (e) => {
    e.currentTarget.style.opacity = '1';
    e.currentTarget.style.transform = 'scale(1)';
  };

  const handleClick = (e) => {
    setClickEffect(true);

    // Remove the click effect after a short delay
    setTimeout(() => {
      setClickEffect(false);
    }, 200);

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`touchable-opacity ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden', // Ensures the effect doesn't spill out of the component
        transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out',
        cursor: 'pointer',
        ...style,
      }}
      onMouseDown={handlePressIn}
      onMouseUp={handlePressOut}
      onMouseLeave={handlePressOut}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
      {...props}
    >
      {clickEffect && (
        <span
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '200%',
            height: '200%',
            background: 'rgba(0, 0, 0, 0.1)', // Light ripple effect
            borderRadius: '50%',
            transform: 'translate(-50%, -50%) scale(0)',
            animation: 'ripple 0.4s ease-out',
          }}
        />
      )}
      {children}
      <style jsx>{`
        @keyframes ripple {
          to {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default TouchableOpacity;
