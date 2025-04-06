import React from 'react';
// Import relevant styles if needed, e.g.,
// import '../../../styles/magic_bakery/Bakery.css';

const Bakery = ({ children }) => {
  // This component will likely hold the background image/theme
  // and act as a container for other game elements.
  return (
    <div className="bakery-container">
      <img
        src="/assets/images/magic_bakery/bakery_background.png"
        alt="Bakery background"
        className="bakery-background-image"
        loading="lazy"
      />
      <div className="bakery-content"> {/* Add a wrapper for content */}
        {children} {/* Render nested game elements */}
      </div>
    </div>
  );
};

export default Bakery;