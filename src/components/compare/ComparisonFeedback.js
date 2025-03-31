import React from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
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
  const { t } = useTranslation(); // Get translation function

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
      return t('compare_feedback_explanation_equal', { num1: numbers[0], num2: numbers[1] });
    }
    
    // Numbers differ at some place value
    const place1 = numberToPlaceValues(numbers[0])[firstDifferingPlace];
    const place2 = numberToPlaceValues(numbers[1])[firstDifferingPlace];
    const placeName = getPlaceValueName(firstDifferingPlace, t); // Pass t
    const placeLabel = getPlaceValueLabel(firstDifferingPlace, t); // Pass t
    const correctOperatorResult = compareNumbers(numbers[0], numbers[1]);
    // const correctOperatorSymbol = correctOperatorResult.symbol; // Removed unused variable
    // Get translated operator text for the explanation
    const correctOperatorText = t(correctOperatorResult.translationKey); 
    const comparisonOperatorSymbol = place1 < place2 ? '<' : '>';
    // Get translated operator text for the place value comparison part
    const comparisonOperatorText = t(comparisonOperatorSymbol === '<' ? 'operator_less_than' : 'operator_greater_than');
    
    return t('compare_feedback_explanation_different', {
      placeName: placeName,
      placeLabel: placeLabel,
      val1: place1,
      operator: comparisonOperatorText, // Use translated text
      val2: place2,
      num1: numbers[0],
      correctOperator: correctOperatorText, // Use translated text
      num2: numbers[1]
    });
  };
  
  // If no feedback, don't show anything
  if (!feedback) return null;
  
  return (
    <div className={`comparison-feedback ${feedback}`}>
      {feedback === 'correct' ? (
        <div className="success-feedback">
          <div className="character-bubble robi">
            <div className="character-icon">
              {/* Use existing alt text keys */}
              <img src="/assets/images/robi.png" alt={t('compare_display_robi_alt')} /> 
            </div>
            <div className="bubble-content">
              <h3>{t('compare_feedback_correct_title')}</h3>
              {/* Use translationKey from constant */}
              <p>{t(FEEDBACK_MESSAGES.CORRECT.translationKey)}</p> 
              <div className="star-coins">
                <span className="star-icon">⭐</span>
                 {/* Assuming count is fixed for now, could be dynamic */}
                <span>{t('compare_feedback_star_coins', { count: 10 })}</span>
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
              {/* Use existing alt text keys */}
              <img src="/assets/images/ana.png" alt={t('compare_display_ana_alt')} />
            </div>
            <div className="bubble-content">
              <h3>{t('compare_feedback_incorrect_title')}</h3>
              {/* Use translationKey from constant */}
              <p>{t(FEEDBACK_MESSAGES.INCORRECT.translationKey)}</p> 
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
