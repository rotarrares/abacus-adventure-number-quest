import React from 'react';
import Abacus from '../abacus/Abacus';
import { numberToPlaceValues, getPlaceValueName } from '../../utils/compareNumbersUtils';
import { PLACE_VALUES, BEAD_COLORS, FEEDBACK_MESSAGES } from '../../constants/compareNumbersConstants';
import '../../styles/DualAbacusSection.css';

/**
 * Component displaying two abacuses side by side for number comparison
 * 
 * @param {Object} props
 * @param {Array} props.numbers - Array of two numbers to compare
 * @param {Array} props.abacusStates - States of both abacuses
 * @param {Function} props.onAbacusChange - Handler for abacus bead changes
 * @param {string} props.highlightedPlaceValue - Currently highlighted place value column
 * @param {Array} props.isAbacusComplete - Whether each abacus correctly represents its number
 * @param {boolean} props.showHints - Whether to show hints for correct bead positions
 */
const DualAbacusSection = ({ 
  numbers, 
  abacusStates, 
  onAbacusChange, 
  highlightedPlaceValue,
  isAbacusComplete,
  showHints
}) => {
  // Helper function to check if a hint should be shown for a specific place value
  const shouldShowHint = (abacusIndex, placeValue) => {
    if (!showHints || !numbers[abacusIndex]) return false;
    
    const correctValues = numberToPlaceValues(numbers[abacusIndex]);
    return abacusStates[abacusIndex][placeValue] !== correctValues[placeValue];
  };
  
  // Generate hint text for a specific place value
  const getHintText = (abacusIndex, placeValue) => {
    if (!numbers[abacusIndex]) return '';
    
    const correctValues = numberToPlaceValues(numbers[abacusIndex]);
    const placeValueName = getPlaceValueName(placeValue);
    
    return FEEDBACK_MESSAGES.HINT
      .replace('{column}', placeValueName.toLowerCase())
      .replace('{number}', numbers[abacusIndex])
      .replace('{count}', correctValues[placeValue]);
  };

  return (
    <div className="dual-abacus-section">
      <div className="abacus-labels">
        <div className="place-value-labels">
          <div className={`place-value-label ${highlightedPlaceValue === PLACE_VALUES.THOUSANDS ? 'highlighted' : ''}`}>
            {getPlaceValueName(PLACE_VALUES.THOUSANDS)} (M)
          </div>
          <div className={`place-value-label ${highlightedPlaceValue === PLACE_VALUES.HUNDREDS ? 'highlighted' : ''}`}>
            {getPlaceValueName(PLACE_VALUES.HUNDREDS)} (S)
          </div>
          <div className={`place-value-label ${highlightedPlaceValue === PLACE_VALUES.TENS ? 'highlighted' : ''}`}>
            {getPlaceValueName(PLACE_VALUES.TENS)} (Z)
          </div>
          <div className={`place-value-label ${highlightedPlaceValue === PLACE_VALUES.UNITS ? 'highlighted' : ''}`}>
            {getPlaceValueName(PLACE_VALUES.UNITS)} (U)
          </div>
        </div>
      </div>
      
      <div className="abacus-container-dual">
        <div className={`abacus-wrapper ${isAbacusComplete[0] ? 'completed' : ''}`}>
          <Abacus 
            onBeadChange={(placeValue, value) => onAbacusChange(0, placeValue, value)} 
            abacusState={abacusStates[0]}
          />
          
          {/* Hints for first abacus */}
          <div className="abacus-hints">
            {Object.values(PLACE_VALUES).map(placeValue => (
              shouldShowHint(0, placeValue) && (
                <div key={`hint-0-${placeValue}`} className="hint-message">
                  {getHintText(0, placeValue)}
                </div>
              )
            ))}
          </div>
        </div>
        
        <div className={`abacus-wrapper ${isAbacusComplete[1] ? 'completed' : ''}`}>
          <Abacus 
            onBeadChange={(placeValue, value) => onAbacusChange(1, placeValue, value)} 
            abacusState={abacusStates[1]}
          />
          
          {/* Hints for second abacus */}
          <div className="abacus-hints">
            {Object.values(PLACE_VALUES).map(placeValue => (
              shouldShowHint(1, placeValue) && (
                <div key={`hint-1-${placeValue}`} className="hint-message">
                  {getHintText(1, placeValue)}
                </div>
              )
            ))}
          </div>
        </div>
      </div>
      
      {/* Color legend for place values */}
      <div className="bead-color-legend">
        <div className="legend-title">Culori mărgele:</div>
        <div className="legend-items">
          {Object.entries(BEAD_COLORS).map(([placeValue, color]) => (
            <div key={placeValue} className="legend-item">
              <div 
                className="color-sample" 
                style={{ backgroundColor: color }}
              ></div>
              <span>{getPlaceValueName(placeValue)} ({placeValue})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DualAbacusSection;
