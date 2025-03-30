import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  numberToPlaceValues, 
  getPlaceValueName, 
  getPlaceValueLabel,
  findDifferingPlaceValue 
} from '../../utils/compareNumbersUtils';
import { 
  COMPARISON_OPERATORS,
  PLACE_VALUES
} from '../../constants/compareNumbersConstants';
import '../../styles/ComparisonControls.css';

/**
 * Component for comparing numbers and selecting the right comparison operator
 */
const ComparisonControls = (props) => {
  const { 
    onComparisonSelect, 
    selectedOperator,
    highlightedPlaceValue,
    onNextPlaceValue,
    abacusStates,
    numbers
  } = props;
  
  const [comparisonResult, setComparisonResult] = useState(null);
  const [analysisFinished, setAnalysisFinished] = useState(false);
  const [placeValueComparisons, setPlaceValueComparisons] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const { t } = useTranslation();
  
  // When we don't have a highlighted place value, we're done with analysis
  useEffect(() => {
    if (highlightedPlaceValue === null) {
      setAnalysisFinished(true);
    }
  }, [highlightedPlaceValue]);
  
  // When highlighted place value changes, analyze the comparison for that place
  useEffect(() => {
    if (highlightedPlaceValue) {
      analyzeHighlightedPlaceValue();
    }
  }, [highlightedPlaceValue, abacusStates]);
  
  // Analyze the values at the highlighted place value
  const analyzeHighlightedPlaceValue = () => {
    if (!highlightedPlaceValue || !numbers[0] || !numbers[1]) return;
    
    const place1 = abacusStates[0][highlightedPlaceValue];
    const place2 = abacusStates[1][highlightedPlaceValue];
    
    // Compare the place values
    let comparison = null;
    if (place1 < place2) {
      comparison = '<';
    } else if (place1 > place2) {
      comparison = '>';
    } else {
      comparison = '=';
    }
    
    // Store the comparison result for this place value
    setPlaceValueComparisons(prev => ({
      ...prev,
      [highlightedPlaceValue]: {
        value1: place1,
        value2: place2,
        result: comparison
      }
    }));
    
    // If values differ, we've found our result
    if (comparison !== '=') {
      setComparisonResult(comparison);
    }
  };
  
  // Handle clicking the "Continue" button to move to next place value
  const handleContinueAnalysis = () => {
    // First check if this place value already determined the result
    const currentComparison = placeValueComparisons[highlightedPlaceValue];
    
    if (currentComparison && currentComparison.result !== '=') {
      // We've found a difference, so we can stop comparing
      // Move to final state (null place value)
      if (typeof onNextPlaceValue === 'function') {
        onNextPlaceValue(null);
      }
    } else {
      // Move to the next place value
      if (typeof onNextPlaceValue === 'function') {
        onNextPlaceValue();
      }
    }
  };
  
  // Generate the explanation text based on comparisons
  const getExplanationText = () => {
    // Find the place value where numbers differ
    const firstDifferingPlace = findDifferingPlaceValue(
      numberToPlaceValues(numbers[0]),
      numberToPlaceValues(numbers[1]),
      Object.values(PLACE_VALUES)
    );
    const placeName = getPlaceValueName(firstDifferingPlace);
    const placeLabel = getPlaceValueLabel(firstDifferingPlace);

    if (!firstDifferingPlace) {
      // Use the existing key from ComparisonFeedback
      return t('compare_feedback_explanation_equal', { num1: numbers[0], num2: numbers[1] });
    }
    
    const place1 = numberToPlaceValues(numbers[0])[firstDifferingPlace];
    const place2 = numberToPlaceValues(numbers[1])[firstDifferingPlace];
    
    let operatorSymbol = place1 < place2 ? '<' : '>';
    let operatorText = t(operatorSymbol === '<' ? 'operator_less_than' : 'operator_greater_than');
    
    // Use the existing key from ComparisonFeedback
    return t('compare_feedback_explanation_different', { 
      placeName: placeName, 
      placeLabel: placeLabel, 
      val1: place1, 
      operator: operatorText, 
      val2: place2, 
      num1: numbers[0], 
      correctOperator: operatorText, // Use the same operator text for consistency
      num2: numbers[1] 
    });
  };

  // Map operator symbols to translation keys
  const operatorTranslationKeys = {
    '<': 'operator_less_than',
    '>': 'operator_greater_than',
    '=': 'operator_equal_to'
  };

  // Handle selecting an operator
  const handleOperatorSelect = (operatorSymbol) => {
    console.log('Operator selected:', operatorSymbol);
    if (typeof onComparisonSelect === 'function') {
      onComparisonSelect(operatorSymbol);
    }
  };
  
  return (
    <div className="comparison-controls">
      {highlightedPlaceValue ? (
        // Show the step-by-step analysis interface
        <div className="place-value-analysis">
          <h3>{t('compare_controls_analysis_title', { placeName: getPlaceValueName(highlightedPlaceValue), placeLabel: getPlaceValueLabel(highlightedPlaceValue) })}</h3>
          
          <div className="place-value-comparison">
            <div className="comparison-value">
              {abacusStates[0][highlightedPlaceValue]} 
              {' '}
              {t(abacusStates[0][highlightedPlaceValue] === 1 ? 'compare_controls_bead_singular' : 'compare_controls_bead_plural')}
            </div>
            
            {placeValueComparisons[highlightedPlaceValue] && (
              <div className="comparison-symbol">
                {placeValueComparisons[highlightedPlaceValue].result}
              </div>
            )}
            
            <div className="comparison-value">
              {abacusStates[1][highlightedPlaceValue]} 
              {' '}
              {t(abacusStates[1][highlightedPlaceValue] === 1 ? 'compare_controls_bead_singular' : 'compare_controls_bead_plural')}
            </div>
          </div>
          
          {placeValueComparisons[highlightedPlaceValue] && (
            placeValueComparisons[highlightedPlaceValue].result === '=' ? (
              <div className="comparison-note">
                <p>{t('compare_controls_values_equal')}</p>
              </div>
            ) : (
              <div className="comparison-note">
                <p>{t('compare_controls_difference_found')}</p>
              </div>
            )
          )}
          
          <button 
            className="continue-button"
            onClick={handleContinueAnalysis}
          >
            {t('compare_controls_continue_button')}
          </button>
        </div>
      ) : analysisFinished ? (
        // Show the operator selection interface
        <div className="operator-selection">
          <h3>{t('compare_controls_select_operator_title')}</h3>
          
          <div className="operator-buttons">
            {Object.values(COMPARISON_OPERATORS).map(operator => (
              <button
                key={operator.symbol}
                className={`operator-button ${selectedOperator === operator.symbol ? 'selected' : ''}`}
                onClick={() => handleOperatorSelect(operator.symbol)}
                disabled={!!selectedOperator}
              >
                <span className="operator-symbol">{operator.symbol}</span>
                <span className="operator-text">{t(operatorTranslationKeys[operator.symbol])}</span>
              </button>
            ))}
          </div>
          
          {!selectedOperator && (
            <button 
              className="hint-button"
              onClick={() => setShowExplanation(!showExplanation)}
            >
              {showExplanation ? t('compare_controls_hide_explanation') : t('compare_controls_show_explanation')}
            </button>
          )}
          
          {showExplanation && (
            <div className="explanation-box">
              <p>{getExplanationText()}</p>
            </div>
          )}
        </div>
      ) : (
        // Loading or error state
        <div className="loading-comparison">{t('compare_controls_loading')}</div>
      )}
    </div>
  );
};

export default ComparisonControls;
