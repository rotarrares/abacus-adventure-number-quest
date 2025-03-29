import React from 'react';

const BackgroundContainer = ({ children }) => {
  return (
    <div className="background-container">
      <div className="background-image"></div>
      <div className="content-container">
        {children}
      </div>
      
      <style jsx="true">{`
        .background-container {
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          position: relative;
          background-color: #f0f8ff;
        }
        
        .background-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('/assets/images/background.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0.5;
          z-index: 0;
        }
        
        .content-container {
          position: relative;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
      `}</style>
    </div>
  );
};

export default BackgroundContainer;