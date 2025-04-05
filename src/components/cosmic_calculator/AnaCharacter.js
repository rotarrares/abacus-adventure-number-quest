import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import '../../styles/cosmic_calculator/Character.css'; // Shared character styles
import '../../styles/cosmic_calculator/AnaCharacter.css'; // Ana-specific styles

// Image paths are relative to the public folder root

/**
 * Displays the Ana character with her image and a speech bubble for messages.
 */
const AnaCharacter = ({ messageKey = null, messageParams = {}, mood = 'default' }) => {
  const { t } = useTranslation();

  // Determine Ana's image source based on mood
  let anaImageSrc = '/assets/images/cosmicCalculator/ana.png'; // Default image
  switch (mood) {
    case 'happy':
      anaImageSrc = '/assets/images/cosmicCalculator/ana_happy.png';
      break;
    case 'thinking': // Renamed from 'explaining' to match image
      anaImageSrc = '/assets/images/cosmicCalculator/ana_thinking.png';
      break;
    case 'frustrated': // Renamed from 'cheeky' to match image
      anaImageSrc = '/assets/images/cosmicCalculator/ana_frustrated.png';
      break;
    // Add more moods as needed
    default:
      anaImageSrc = '/assets/images/cosmicCalculator/ana.png';
  }

  // Dynamically add classes based on mood
  const characterClasses = ['character', 'ana-character', `mood-${mood}`].filter(Boolean).join(' ');

  const message = messageKey ? t(messageKey, messageParams) : '';

  return (
    <div className={characterClasses}>
      <img src={anaImageSrc} alt="Ana Character" className="character-image" loading="lazy" />
      {message && (
        <div className="speech-bubble ana-speech-bubble">
          {message}
        </div>
      )}
    </div>
  );
};

AnaCharacter.propTypes = {
  /** Translation key for the message to display */
  messageKey: PropTypes.string,
  /** Parameters for the translation message (if any) */
  messageParams: PropTypes.object,
  /** Current mood/state of the character (e.g., 'happy', 'explaining', 'cheeky') */
  mood: PropTypes.string,
};


export default AnaCharacter;