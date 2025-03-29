import React, { useState, useEffect } from 'react';
import { 
  numberToPlaceValues, 
  getPlaceValueName, 
  findDifferingPlaceValue 
} from '../../utils/compareNumbersUtils';
import { 
  COMPARISON_OPERATORS,
  PLACE_VALUES
} from '../../constants/compareNumbersConstants';
import '../../styles/ComparisonControls.css';

/**
 * Component for comparing numbers and selecting the right comparison operator
 * 
 * @param {Object} props
 * @param {Function} props.onComparisonSelect - Handler for comparison operator selection
 * @param {string} props.selectedOperator - Currently selected operator
 * @param {string} props.highlightedPlaceValue - Currently highlighted place value
 * @param {Function} props.onNextPlaceValue - Handler to move to next place value
 * @param {Array} props.abacusStates - Current states of both abacuses
 * @param {Array} props.numbers - Numbers being compared
 */
const ComparisonControls = ({ 
  onComparisonSelect, 
  selectedOperator,
  highlightedPlaceValue,
  onNextPlaceValue,
  abacusStates,
  numbers
}) => {
  const [comparisonResult, setComparisonResult] = useState(null);
  const [analyzingComplete, setAnalyzingComplete] = useState(false);
  const [placeValueComparisons, setPlaceValueComparisons] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  
  // When highlighted place value changes, analyze the comparison for that place
  useEffect(() => {
    if (highlightedPlaceValue) {
      analyzeHighlightedPlaceValue();
    } else {
      // If no highlighted place value, we're ready for selection
      setAnalyzingComplete(true);
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
      setAnalyzingComplete(true);
      // Use the prop function instead of trying to set the state directly
      onNextPlaceValue(null);
    } else {
      // Move to the next place value
      onNextPlaceValue();
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
    
    if (!firstDifferingPlace) {
      return `Toate valorile sunt egale, deci ${numbers[0]} este egal cu ${numbers[1]}.`;
    }
    
    const place1 = numberToPlaceValues(numbers[0])[firstDifferingPlace];
    const place2 = numberToPlaceValues(numbers[1])[firstDifferingPlace];
    const placeName = getPlaceValueName(firstDifferingPlace).toLowerCase();
    
    if (place1 < place2) {
      return `${placeName} sunt diferite! ${place1} este mai mic decât ${place2}, deci ${numbers[0]} este mai mic decât ${numbers[1]}.`;
    } else {
      return `${placeName} sunt diferite! ${place1} este mai mare decât ${place2}, deci ${numbers[0]} este mai mare decât ${numbers[1]}.`;
    }
  };
  
  return (
    <div className="comparison-controls">
      {highlightedPlaceValue ? (
        // Show the step-by-step analysis interface
        <div className="place-value-analysis">
          <h3>Compară {getPlaceValueName(highlightedPlaceValue)}</h3>
          
          <div className="place-value-comparison">
            <div className="comparison-value">
              {abacusStates[0][highlightedPlaceValue]} 
              {abacusStates[0][highlightedPlaceValue] === 1 ? ' mărgea' : ' mărgele'}
            </div>
            
            {placeValueComparisons[highlightedPlaceValue] && (
              <div className="comparison-symbol">
                {placeValueComparisons[highlightedPlaceValue].result}
              </div>
            )}
            
            <div className="comparison-value">
              {abacusStates[1][highlightedPlaceValue]} 
              {abacusStates[1][highlightedPlaceValue] === 1 ? ' mărgea' : ' mărgele'}
            </div>
          </div>
          
          {placeValueComparisons[highlightedPlaceValue] && (
            placeValueComparisons[highlightedPlaceValue].result === '=' ? (
              <div className="comparison-note">
                <p>Valorile sunt egale! Trebuie să verificăm următoarea poziție.</p>
              </div>
            ) : (
              <div className="comparison-note">
                <p>Am găsit o diferență! Putem opri compararea.</p>
              </div>
            )
          )}
          
          <button 
            className="continue-button"
            onClick={handleContinueAnalysis}
          >
            Continuă
          </button>
        </div>
      ) : analyzingComplete ? (
        // Show the operator selection interface
        <div className="operator-selection">
          <h3>Alege simbolul de comparare:</h3>
          
          <div className="operator-buttons">
            {Object.values(COMPARISON_OPERATORS).map(operator => (
              <button
                key={operator.symbol}
                className={`operator-button ${selectedOperator === operator.symbol ? 'selected' : ''}`}
                onClick={() => onComparisonSelect(operator.symbol)}
                disabled={!!selectedOperator}
              >
                <span className="operator-symbol">{operator.symbol}</span>
                <span className="operator-text">{operator.text}</span>
              </button>
            ))}
          </div>
          
          {!selectedOperator && (
            <button 
              className="hint-button"
              onClick={() => setShowExplanation(!showExplanation)}
            >
              {showExplanation ? 'Ascunde explicația' : 'Arată explicația'}
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
        <div className="loading-comparison">Comparăm numerele...</div>
      )}
    </div>
  );
};

export default ComparisonControls;