import React from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
// Import relevant styles, e.g.,
// import '../../../styles/magic_bakery/MixingBowl.css';

const MixingBowl = ({ currentStep, carryOver, resultDigits, onMixClick }) => {
  const { t } = useTranslation(); // Get the translation function

  // Helper function to get the translated step name
  const getTranslatedStepName = (step) => {
    switch (step) {
      case 'units': return t('place_value_units');
      case 'tens': return t('place_value_tens');
      case 'hundreds': return t('place_value_hundreds');
      case 'thousands': return t('place_value_thousands');
      case 'done': return ''; // Or maybe a different text like "Final Answer" if needed later
      default: return '...'; // Fallback for null/undefined
    }
  };
  // This component is crucial for visualizing the step-by-step addition.
  // It will show digits being combined, the carry-over animation,
  // and the resulting digits appearing.

  // Placeholder rendering:
  return (
    <div className="mixing-bowl-area">
      <div className="mixing-bowl-visual">
        <img src="/assets/images/magic_bakery/mixing_bowl.png" alt={t('magic_bakery.mixing_bowl_alt')} className="mixing-bowl-image" loading="lazy" />
        {/* TODO: Add visuals for digits mixing inside the bowl */}
        {carryOver > 0 && (
          <div className="carry-over-indicator">
            <img src="/assets/images/magic_bakery/carry_over_sparkle.png" alt={t('magic_bakery.carry_over_alt')} className="carry-over-image" loading="lazy" />
            <span className="carry-over-number">{carryOver}</span>
          </div>
        )}
      </div>
      <div className="result-display">
        {/* Display the calculated digits */}
        <p>{t('magic_bakery.result_label')}{resultDigits || '...'}</p>
      </div>
      <button onClick={onMixClick} disabled={!onMixClick}>
        {t('magic_bakery.mix_button_prefix')}{getTranslatedStepName(currentStep)}
      </button>
    </div>
  );
};

export default MixingBowl;