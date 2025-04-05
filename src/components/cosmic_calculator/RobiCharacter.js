import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import '../../styles/cosmic_calculator/Character.css'; // Shared character styles
import '../../styles/cosmic_calculator/RobiCharacter.css'; // Robi-specific styles

// Image paths are relative to the public folder root
// No imports needed as images are in the public folder
// TODO: Add other mood variants as needed

/**
 * Displays the Robi character with his image and a speech bubble for messages.
 */
const RobiCharacter = ({ messageKey = null, messageParams = {}, mood = 'default' }) => {
  const { t } = useTranslation();

  // Determine Robi's image source based on mood
  let robiImageSrc = '/assets/images/cosmicCalculator/robi.png'; // Default image - Corrected path
  switch (mood) {
    case 'happy':
      robiImageSrc = '/assets/images/cosmicCalculator/robi_happy.png';
      break;
    case 'thinking':
      robiImageSrc = '/assets/images/cosmicCalculator/robi_thinking.png';
      break;
    case 'surprised':
      robiImageSrc = '/assets/images/cosmicCalculator/robi_surprised.png';
      break;
    // Add more moods as needed
    default:
      robiImageSrc = '/assets/images/cosmicCalculator/robi.png'; // Corrected path
  }

  // Dynamically add classes based on mood for potential CSS animations/styling
  const characterClasses = ['character', 'robi-character', `mood-${mood}`].filter(Boolean).join(' ');

  const message = messageKey ? t(messageKey, messageParams) : '';

  return (
    <div className={characterClasses}>
      <img src={robiImageSrc} alt="Robi Character" className="character-image" loading="lazy" />
      {message && (
        <div className="speech-bubble robi-speech-bubble">
          {message}
        </div>
      )}
    </div>
  );
};

RobiCharacter.propTypes = {
  /** Translation key for the message to display */
  messageKey: PropTypes.string,
  /** Parameters for the translation message (if any) */
  messageParams: PropTypes.object,
  /** Current mood/state of the character (e.g., 'happy', 'thinking', 'surprised') */
  mood: PropTypes.string,
};


export default RobiCharacter;