import React from 'react';

const BackgroundContainer = ({ children }) => {
  // This component now just passes through children
  // The background is handled by the CSS in index.html
  return (
    <div className="app-container">
      {children}
    </div>
  );
};

export default BackgroundContainer;