import React, { useEffect, useState } from 'react';

const BackgroundContainer = ({ children }) => {
  const [bgStyle, setBgStyle] = useState({
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#f5f5f5', // Fallback background color
  });

  useEffect(() => {
    // Create a new image element
    const img = new Image();
    
    // Set up load handler
    img.onload = () => {
      // Only set the background image once it's loaded
      setBgStyle(prevStyle => ({
        ...prevStyle,
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url(${img.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }));
    };
    
    // Handle errors gracefully
    img.onerror = () => {
      console.warn('Background image failed to load, using fallback color');
    };
    
    // Set the source (this is for React projects where the image is in the public folder)
    img.src = '/assets/images/background.png';
  }, []);

  return (
    <div style={bgStyle}>
      {children}
    </div>
  );
};

export default BackgroundContainer;