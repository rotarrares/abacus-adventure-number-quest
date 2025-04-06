import React from 'react';
// Import relevant styles, e.g.,
// import '../../../styles/magic_bakery/MixingBowl.css';

const MixingBowl = ({ currentStep, carryOver, resultDigits, onMixClick }) => {
  // This component is crucial for visualizing the step-by-step addition.
  // It will show digits being combined, the carry-over animation,
  // and the resulting digits appearing.

  // Placeholder rendering:
  return (
    <div className="mixing-bowl-area">
      <div className="mixing-bowl-visual">
        <img src="/assets/images/magic_bakery/mixing_bowl.png" alt="Mixing Bowl" className="mixing-bowl-image" loading="lazy" />
        {/* TODO: Add visuals for digits mixing inside the bowl */}
        {carryOver > 0 && (
          <div className="carry-over-indicator">
            <img src="/assets/images/magic_bakery/carry_over_sparkle.png" alt="Carry Over" className="carry-over-image" loading="lazy" />
            <span className="carry-over-number">{carryOver}</span>
          </div>
        )}
      </div>
      <div className="result-display">
        {/* Display the calculated digits */}
        <p>Result: {resultDigits || '...'}</p>
      </div>
      <button onClick={onMixClick} disabled={!onMixClick}>
        Mix {currentStep || '...'}
      </button>
    </div>
  );
};

export default MixingBowl;