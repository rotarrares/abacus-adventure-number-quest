import React from 'react';
import { useTranslation } from 'react-i18next';
import { getPlaceValueName } from '../../utils/compareNumbersUtils'; // Import for hint
import { PLACE_VALUES } from '../../constants/compareNumbersConstants'; // Import for hint
import '../../styles/GameModes.css';

const FeedbackDisplay = ({ feedback, showHint, abacusState }) => {
  const { t } = useTranslation();

  // Helper function to construct the hint text
  const getHintText = () => {
    if (!abacusState) return '';

    let hintParts = [];
    if (abacusState.thousands > 0) hintParts.push(`${abacusState.thousands} ${getPlaceValueName(PLACE_VALUES.THOUSANDS, t).toLowerCase()}`);
    if (abacusState.hundreds > 0) hintParts.push(`${abacusState.hundreds} ${getPlaceValueName(PLACE_VALUES.HUNDREDS, t).toLowerCase()}`);
    if (abacusState.tens > 0) hintParts.push(`${abacusState.tens} ${getPlaceValueName(PLACE_VALUES.TENS, t).toLowerCase()}`);
    if (abacusState.units > 0) hintParts.push(`${abacusState.units} ${getPlaceValueName(PLACE_VALUES.UNITS, t).toLowerCase()}`);
    
    return `${t('feedback_display_hint_prefix')} ${hintParts.join(', ')}`;
  };

  return (
    <div className="feedback-container">
      {feedback === 'correct' && (
        <div className="feedback correct">
          {t('feedback_correct')}
        </div>
      )}
      
      {feedback === 'incorrect' && (
        <div className="feedback incorrect">
          {t('feedback_incorrect')}
          
          {showHint && (
            <div className="hint">
              {getHintText()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackDisplay;
