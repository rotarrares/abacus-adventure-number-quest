import React from 'react';

// Fallback color background 
const BackgroundContainer = ({ children }) => {
  const containerStyle = {
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    position: 'relative',
    // Use a nice gradient background instead of an image
    background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
  };

  return (
    <div style={containerStyle}>
      {children}
    </div>
  );
};

export default BackgroundContainer;