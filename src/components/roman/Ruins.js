import React from 'react';
import '../../styles/roman/Ruins.css';

// Construct the path to the image in the public folder
const backgroundImageUrl = `${process.env.PUBLIC_URL}/assets/images/ruins_background.png`;

/**
 * Component representing the visual background/environment (Roman ruins).
 * It acts as a container for characters and puzzle elements.
 * TODO: Implement actual visual representation (image, SVG, etc.)
 * TODO: Handle Robi's entrance animation based on level/state.
 */
const Ruins = ({ children, level }) => { // Removed isAnswerCorrect prop
  // Add logic here later to change appearance based on level,
  // or trigger animations (like Robi's door opening in level 5).

  // Define the inline style for the background image
  const containerStyle = {
    backgroundImage: `url(${backgroundImageUrl})`,
  };

  // Treasure chest logic moved to RomanTreasureMode

  return (
    <div className="ruins-container" style={containerStyle}>
      {/* Background is now applied via inline style */}
      <div className="ruins-content-area">
        {children}
      </div>
      {/* Treasure Chest Image moved to RomanTreasureMode */}
      {/* Maybe a hidden door element for Robi */}
      {level === 5 && <div className="robi-door"></div>}
    </div>
  );
};

export default Ruins;
