"use client";

const TouchableOpacity = ({ children, onClick, className = '', style = {}, ...props }) => {
  const handlePressIn = (e) => {
    e.currentTarget.style.opacity = '0.6';
    e.currentTarget.style.transform = 'scale(0.95)';
  };

  const handlePressOut = (e) => {
    e.currentTarget.style.opacity = '1';
    e.currentTarget.style.transform = 'scale(1)';
  };

  return (
    <div
      onClick={onClick}
      className={`touchable-opacity ${className}`}
      style={{
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
      {children}
    </div>
  );
};

export default TouchableOpacity;
