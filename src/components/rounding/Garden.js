import React from 'react';
import '../../styles/rounding/Garden.css';

const Garden = ({ children }) => {
  console.log("Garden rendering"); // Placeholder

  return (
    <div className="garden-container">
      {/* TODO: Implement garden layout (CSS Grid?) */}
      {children}
    </div>
  );
};

export default Garden;
