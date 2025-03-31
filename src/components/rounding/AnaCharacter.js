import React from 'react';
import '../../styles/rounding/AnaCharacter.css';

// Define paths for different moods
const IMAGE_PATHS = {
  normal: '/assets/images/ana.png',
  happy: '/assets/images/ana_happy.png',
  wrong: '/assets/images/ana_wrong.png',
  explaining: '/assets/images/ana_explains.png',
};

const AnaCharacter = ({ message, mood = 'normal' }) => { // Add mood prop with default
  console.log("AnaCharacter rendering with message:", message, "mood:", mood); // Log mood

  // Select image based on mood, default to normal if mood is invalid
  const imagePath = IMAGE_PATHS[mood] || IMAGE_PATHS.normal;
  const altText = `Ana the Gardener (${mood})`; // Dynamic alt text

  return (
    <div className="ana-character-container">
      <img src={imagePath} alt={altText} className="ana-image" />
      {message && (
        <div className="speech-bubble">
          {message}
        </div>
      )}
      {/* TODO: Add animations (SVG/sprite?) */}
    </div>
  );
};

export default AnaCharacter;
