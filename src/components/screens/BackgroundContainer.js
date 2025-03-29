import React, { useState, useEffect } from 'react';

const BackgroundContainer = ({ children }) => {
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  
  useEffect(() => {
    // Check if the background image exists using the same method as for ana.png
    const img = new Image();
    img.onload = () => setBackgroundLoaded(true);
    img.onerror = () => setBackgroundLoaded(false);
    img.src = '/assets/images/background.png';
  }, []);

  // Base styles that work with or without background image
  const containerStyle = {
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    position: 'relative',
    // Fallback gradient if image doesn't load
    background: backgroundLoaded 
      ? `linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url('/assets/images/background.png')`
      : 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div style={containerStyle}>
      {children}
    </div>
  );
};

export default BackgroundContainer;