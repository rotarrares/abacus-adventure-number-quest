import React from 'react';
import { 
  numberToPlaceValues, 
  findDifferingPlaceValue, 
  getPlaceValueName,
  getPlaceValueLabel,
  compareNumbers 
} from '../../utils/compareNumbersUtils';
import { PLACE_VALUES, FEEDBACK_MESSAGES } from '../../constants/compareNumbersConstants';
import '../../styles/ComparisonFeedback.css';

/**
 * Component to display feedback after comparison attempts
 * 
 * @param {Object} props
 * @param {string} props.feedback - Current feedback state ('correct', 'incorrect', null)
 * @param {Array} props.numbers - Numbers being compared
 */
const ComparisonFeedback = ({ feedback, numbers }) => {
  // Generate explanation text for correct/incorrect answers
  const getExplanationText = () => {
    if (!numbers[0] || !numbers[1]) return '';
    
    // Find the place value where numbers differ
    const firstDifferingPlace = findDifferingPlaceValue(
      numberToPlaceValues(numbers[0]),
      numberToPlaceValues(numbers[1]),
      Object.values(PLACE_VALUES)
    );
    
    // If numbers are equal
    if (!firstDifferingPlace) {
      return `Toate valorile sunt la fel, deci ${numbers[0]} este egal cu ${numbers[1]}.`;
    }
    
    // Numbers differ at some place value
    const place1 = numberToPlaceValues(numbers[0])[firstDifferingPlace];
    const place2 = numberToPlaceValues(numbers[1])[firstDifferingPlace];
    const placeName = getPlaceValueName(firstDifferingPlace);
    const placeLabel = getPlaceValueLabel(firstDifferingPlace);
    const correctOperator = compareNumbers(numbers[0], numbers[1]).symbol;
    
    return `${placeName} (${placeLabel}) sunt diferite: ${place1} ${place1 < place2 ? '<' : '>'} ${place2}, deci ${numbers[0]} ${correctOperator} ${numbers[1]}.`;
  };
  
  // If no feedback, don't show anything
  if (!feedback) return null;
  
  return (
    <div className={`comparison-feedback ${feedback}`}>
      {feedback === 'correct' ? (
        <div className="success-feedback">
          <div className="character-bubble robi">
            <div className="character-icon">
              <img src="/assets/images/robi.png" alt="Robi" />
            </div>
            <div className="bubble-content">
              <h3>Corect!</h3>
              <p>{FEEDBACK_MESSAGES.CORRECT.text}</p>
              <div className="star-coins">
                <span className="star-icon">⭐</span>
                <span>+10 monede stea</span>
              </div>
            </div>
          </div>
          <div className="explanation">
            <p>{getExplanationText()}</p>
          </div>
        </div>
      ) : (
        <div className="error-feedback">
          <div className="character-bubble ana">
            <div className="character-icon">
              <img src="/assets/images/ana.png" alt="Ana" />
            </div>
            <div className="bubble-content">
              <h3>Încearcă din nou!</h3>
              <p>{FEEDBACK_MESSAGES.INCORRECT.text}</p>
            </div>
          </div>
          <div className="explanation">
            <p>{getExplanationText()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonFeedback;