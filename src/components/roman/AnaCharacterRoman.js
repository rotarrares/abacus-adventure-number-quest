import React from 'react';
import '../../styles/roman/AnaCharacterRoman.css'; // Styles to be created later

// Define paths for different moods - assuming these are generic enough
const IMAGE_PATHS = {
  normal: '/assets/images/ana.png',
  happy: '/assets/images/ana_happy.png',
  wrong: '/assets/images/ana_wrong.png',
  explaining: '/assets/images/ana_explains.png', // May need a specific 'explaining Roman numerals' pose later
};

/**
 * Component to display Ana the explorer character for the Roman Treasure game.
 * @param {Object} props - Component props
 * @param {string} props.message - The message for Ana to say in the speech bubble.
 * @param {string} [props.mood='normal'] - Ana's current mood ('normal', 'happy', 'wrong', 'explaining').
 */
const AnaCharacterRoman = ({ message, mood = 'normal' }) => {
  // Select image based on mood, default to normal if mood is invalid
  const imagePath = IMAGE_PATHS[mood] || IMAGE_PATHS.normal;
  // Update alt text for the Roman theme
  const altText = `Ana the Explorer (${mood})`;

  return (
    <div className="ana-character-roman-container"> {/* Use a specific class name */}
      <img src={imagePath} alt={altText} className="ana-roman-image" /> {/* Use a specific class name */}
      {message && (
        <div className="speech-bubble roman"> {/* Use a specific class name */}
          {message}
        </div>
      )}
      {/* TODO: Add animations specific to this game mode if needed */}
    </div>
  );
};

export default AnaCharacterRoman;
