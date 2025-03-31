import React from 'react';
import '../../styles/roman/RobiCharacter.css'; // Styles to be created later

// Define path for Robi's image
const ROBI_IMAGE_PATH = '/assets/images/robi.png';

/**
 * Component to display Robi the Roman robot character.
 * Appears in Level 5 to provide hints.
 * @param {Object} props - Component props
 * @param {string} props.message - The base message for Robi (e.g., greeting).
 * @param {string} [props.hint] - An optional hint message provided by Robi.
 */
const RobiCharacter = ({ message, hint }) => {
  const altText = 'Robi the Roman Robot';

  // Combine message and hint for display
  const fullMessage = hint ? `${message} ${hint}` : message;

  return (
    <div className="robi-character-container"> {/* Specific class name */}
      <img src={ROBI_IMAGE_PATH} alt={altText} className="robi-image" /> {/* Specific class name */}
      {fullMessage && (
        <div className="speech-bubble robi"> {/* Specific class name */}
          {/* Add robotic text effect later if desired */}
          {fullMessage}
        </div>
      )}
      {/* TODO: Add animations (e.g., glowing eyes, entrance animation) */}
    </div>
  );
};

export default RobiCharacter;
