import React from 'react';
import { useTranslation } from 'react-i18next';
import CompareAbacus from './CompareAbacus';
import { numberToPlaceValues, getPlaceValueName, getPlaceValueLabel } from '../../utils/compareNumbersUtils';
import { PLACE_VALUES, BEAD_COLORS } from '../../constants/compareNumbersConstants'; // Removed FEEDBACK_MESSAGES
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
  const { t } = useTranslation();

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
    const placeValueName = getPlaceValueName(placeValue, t); // Pass t here
    
    // Use the translation key
    return t('compare_hint_message', {
      column: placeValueName.toLowerCase(), // Keep lowercase for context
      number: numbers[abacusIndex],
      count: correctValues[placeValue]
    });
  };

  return (
    <div className="dual-abacus-section">
      <div className="abacus-labels">
        <div className="place-value-labels">
          <div className={`place-value-label ${highlightedPlaceValue === PLACE_VALUES.THOUSANDS ? 'highlighted' : ''}`}>
            {getPlaceValueName(PLACE_VALUES.THOUSANDS, t)} ({getPlaceValueLabel(PLACE_VALUES.THOUSANDS, t)})
          </div>
          <div className={`place-value-label ${highlightedPlaceValue === PLACE_VALUES.HUNDREDS ? 'highlighted' : ''}`}>
            {getPlaceValueName(PLACE_VALUES.HUNDREDS, t)} ({getPlaceValueLabel(PLACE_VALUES.HUNDREDS, t)})
          </div>
          <div className={`place-value-label ${highlightedPlaceValue === PLACE_VALUES.TENS ? 'highlighted' : ''}`}>
            {getPlaceValueName(PLACE_VALUES.TENS, t)} ({getPlaceValueLabel(PLACE_VALUES.TENS, t)})
          </div>
          <div className={`place-value-label ${highlightedPlaceValue === PLACE_VALUES.UNITS ? 'highlighted' : ''}`}>
            {getPlaceValueName(PLACE_VALUES.UNITS, t)} ({getPlaceValueLabel(PLACE_VALUES.UNITS, t)})
          </div>
        </div>
      </div>
      
      <div className="abacus-container-dual">
        <div className={`abacus-wrapper ${isAbacusComplete[0] ? 'completed' : ''}`}>
          <CompareAbacus 
            onBeadChange={(placeValue, value) => onAbacusChange(0, placeValue, value)} 
            abacusState={abacusStates[0]}
            showControls={false}
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
          <CompareAbacus 
            onBeadChange={(placeValue, value) => onAbacusChange(1, placeValue, value)} 
            abacusState={abacusStates[1]}
            showControls={false}
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
        <div className="legend-title">{t('dual_abacus_legend_title')}</div>
        <div className="legend-items">
          {Object.entries(BEAD_COLORS).map(([placeValue, color]) => (
            <div key={placeValue} className="legend-item">
              <div 
                className="color-sample" 
                style={{ backgroundColor: color }}
              ></div>
              <span>{getPlaceValueName(placeValue, t)} ({getPlaceValueLabel(placeValue, t)})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DualAbacusSection;
