import React from 'react';

const BackgroundContainer = ({ children }) => {
  const containerStyle = {
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    position: 'relative',
    background: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), 
                url('https://raw.githubusercontent.com/rotarrares/abacus-adventure-number-quest/main/public/assets/images/background.png')`,
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