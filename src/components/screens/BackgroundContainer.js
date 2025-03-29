import React from 'react';

const BackgroundContainer = ({ children }) => {
  const containerStyle = {
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#f0f8ff', // Light blue background color
  };

  // Create an overlay div with the background image
  const backgroundImageStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url(/assets/images/background.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: 0.5, // Make the background semi-transparent
    zIndex: 0,
  };

  const contentStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
    zIndex: 1,
  };

  return (
    <div style={containerStyle}>
      <div style={backgroundImageStyle}></div>
      <div style={contentStyle}>
        {children}
      </div>
    </div>
  );
};

export default BackgroundContainer;