import React from 'react';
import '../../styles/BackgroundContainer.css';

const BackgroundContainer = ({ children }) => {
  return (
    <div className="background-container">
      <div className="background-image"></div>
      <div className="content-container">
        {children}
      </div>
    </div>
  );
};

export default BackgroundContainer;