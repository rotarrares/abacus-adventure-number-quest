import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'; // Import translation hook
import { PLACE_VALUE_NAMES } from '../../constants/cosmicCalculatorConstants';
import '../../styles/cosmic_calculator/CalculatorDisplay.css';

/**
 * Helper to format numbers with padding for alignment (optional but helpful).
 * @param {number} num The number.
 * @param {number} numDigits Max digits for the level.
 */
const formatNumber = (num, numDigits) => {
  return String(num).padStart(numDigits, ' '); // Pad with spaces, or '0' if preferred
};

/**
 * Displays the addition problem (num1 + num2), the animated breakdown area,
 * and the partially calculated sum.
 */
const CalculatorDisplay = ({ num1, num2, animationState, numDigits }) => {
  const { t } = useTranslation(); // Initialize translation function
  const { step: currentStep, partialSum, isActive: isAnimating } = animationState;

  // Prepare display numbers (consider padding)
  const displayNum1 = formatNumber(num1, numDigits);
  const displayNum2 = formatNumber(num2, numDigits);

  // Prepare the partial sum display
  let partialSumString = '';
  for (let i = numDigits - 1; i >= 0; i--) {
    const placeName = PLACE_VALUE_NAMES[i];
    partialSumString += partialSum[placeName] !== undefined ? String(partialSum[placeName]) : '_';
  }

  return (
    <div className="calculator-display">
      {/* Display the numbers being added */}
      {/* Use CSS Grid for alignment */}
      <div className="problem-numbers-grid">
        {/* Row 1: First number and operator */}
        <div className="number num1">{displayNum1}</div>
        <div className="operator">+</div>
        {/* Row 2: Second number (spans number column) */}
        <div className="number num2">{displayNum2}</div>
        <div></div> {/* Empty cell for operator column */}
        {/* Row 3: Equals line (spans both columns) */}
        <div className="equals-line"></div>
        {/* Row 4: Partial Sum (in the number column) */}
        <div className="partial-sum">
          {partialSumString}
        </div>
        {/* Empty cell for operator column in the sum row */}
        <div></div>
      </div>

      {/* Area for the step-by-step animation visualization */}
      {/* This part needs careful CSS to align digits and animate them */}
      <div className="animation-area">
        {isAnimating && currentStep && (
          <div className={`step-indicator step-${currentStep}`}>
            {t('cosmic_calculator.calculating_step', { step: t(`place_value_${currentStep.toLowerCase()}`) })}
          </div>
        )}
        {/* TODO: Add elements for flying/merging digits based on currentStep */}
      </div>

      {/* Partial sum is now inside the grid above */}
    </div>
  );
};

CalculatorDisplay.propTypes = {
  num1: PropTypes.number.isRequired,
  num2: PropTypes.number.isRequired,
  animationState: PropTypes.shape({
    step: PropTypes.oneOf([...Object.values(PLACE_VALUE_NAMES), 'done', null]),
    partialSum: PropTypes.object, // e.g., { units: 5, tens: 3 }
    isActive: PropTypes.bool,
  }).isRequired,
  numDigits: PropTypes.number.isRequired, // Max digits for current level
};

export default CalculatorDisplay;