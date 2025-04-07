import React from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
// Import relevant styles, e.g.,
// import '../../../styles/magic_bakery/MixingBowl.css';

const MixingBowl = ({ currentStep, carryOver, resultDigits, onMixClick, num1, num2 }) => {
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
  // Extract digits for the current step
  const getDigitsForStep = (step) => {
    if (!num1 || !num2 || step === 'done') return { d1: null, d2: null };
    const s1 = String(num1).padStart(4, '0');
    const s2 = String(num2).padStart(4, '0');
    switch (step) {
      case 'units': return { d1: s1[3], d2: s2[3] };
      case 'tens': return { d1: s1[2], d2: s2[2] };
      case 'hundreds': return { d1: s1[1], d2: s2[1] };
      case 'thousands': return { d1: s1[0], d2: s2[0] };
      default: return { d1: null, d2: null };
    }
  };

  const { d1, d2 } = getDigitsForStep(currentStep);

  return (
    <div className="mixing-bowl-area">
      <div className="mixing-bowl-visual">
        <img src="/assets/images/magic_bakery/mixing_bowl.png" alt={t('magic_bakery.mixing_bowl_alt')} className="mixing-bowl-image" loading="lazy" />

        {/* TODO: Animate digits d1, d2, and carryOver 'pouring' into the bowl */}
        {currentStep !== 'done' && d1 !== null && (
          <div className="digits-mixing">
             {/* Display digits being mixed */}
             <span>{d1}</span> + <span>{d2}</span> {carryOver > 0 && `+ ${carryOver}`}
          </div>
        )}

        {/* TODO: Animate carry-over 'flying' out */}
        {carryOver > 0 && currentStep !== 'units' && ( // Show carry indicator *above* bowl for tens+
          <div className="carry-over-indicator above-bowl">
            <img src="/assets/images/magic_bakery/carry_over_sparkle.png" alt={t('magic_bakery.carry_over_alt')} className="carry-over-image" loading="lazy" />
            <span className="carry-over-number">{carryOver}</span>
          </div>
        )}
      </div>

      {/* Display individual result digits */}
      <div className="result-display">
         <span className="result-label">{t('magic_bakery.result_label')}</span>
         <div className="result-digits-container">
            {/* TODO: Animate each digit appearing */}
            <span className="digit-box thousands">{resultDigits.thousands ?? ''}</span>
            <span className="digit-box hundreds">{resultDigits.hundreds ?? ''}</span>
            <span className="digit-box tens">{resultDigits.tens ?? ''}</span>
            <span className="digit-box units">{resultDigits.units ?? ''}</span>
         </div>
      </div>

      {/* Mix Button - enabled only when onMixClick is provided */}
      {currentStep !== 'done' && (
        <button
          className="mix-button"
          onClick={onMixClick}
          disabled={!onMixClick}
        >
          {t('magic_bakery.mix_button_prefix')}{getTranslatedStepName(currentStep)}
        </button>
      )}
    </div>
  );
};

export default MixingBowl;