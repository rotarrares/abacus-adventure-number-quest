import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { useGameContext } from '../../context/GameContext';
import { playSound } from '../../utils/audioUtils';
// import { numberToRomanianWord } from '../../utils/numberUtils'; // Removed unused import
import { 
  generateRandomNumbers, 
  numberToPlaceValues, 
  compareNumbers
} from '../../utils/compareNumbersUtils';
import { 
  DIFFICULTY_LEVELS, 
  PLACE_VALUES 
} from '../../constants/compareNumbersConstants';
import CompareDisplay from '../compare/CompareDisplay';
import ComparisonControls from '../compare/ComparisonControls';
import DualAbacusSection from '../compare/DualAbacusSection';
import ComparisonFeedback from '../compare/ComparisonFeedback';
import ComparisonInstructions from '../compare/ComparisonInstructions';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import '../../styles/CompareNumbersMode.css';

const CompareNumbersMode = () => {
  const { gameState, dispatch, actions } = useGameContext();
  const { t } = useTranslation(); // Get translation function
  const [numbers, setNumbers] = useState([null, null]);
  const [difficultyLevel, setDifficultyLevel] = useState(DIFFICULTY_LEVELS.LEVEL_1);
  
  // Initialize abacus states with the proper place value keys
  const [abacusStates, setAbacusStates] = useState([
    { 
      [PLACE_VALUES.THOUSANDS]: 0, 
      [PLACE_VALUES.HUNDREDS]: 0, 
      [PLACE_VALUES.TENS]: 0, 
      [PLACE_VALUES.UNITS]: 0 
    },
    { 
      [PLACE_VALUES.THOUSANDS]: 0, 
      [PLACE_VALUES.HUNDREDS]: 0, 
      [PLACE_VALUES.TENS]: 0, 
      [PLACE_VALUES.UNITS]: 0 
    }
  ]);
  
  const [selectedComparisonOperator, setSelectedComparisonOperator] = useState(null);
  const [highlightedPlaceValue, setHighlightedPlaceValue] = useState(null);
  const [isComparingNow, setIsComparingNow] = useState(false);
  const [isAbacusComplete, setIsAbacusComplete] = useState([false, false]);
  const [showHints, setShowHints] = useState(false);

  // Wrap generateNewNumbers in useCallback to stabilize its reference
  const generateNewNumbers = useCallback(() => {
    const newNumbers = generateRandomNumbers(difficultyLevel.range);
    setNumbers(newNumbers);
    
    // Reset the abacus states
    setAbacusStates([
      { 
        [PLACE_VALUES.THOUSANDS]: 0, 
        [PLACE_VALUES.HUNDREDS]: 0, 
        [PLACE_VALUES.TENS]: 0, 
        [PLACE_VALUES.UNITS]: 0 
      },
      { 
        [PLACE_VALUES.THOUSANDS]: 0, 
        [PLACE_VALUES.HUNDREDS]: 0, 
        [PLACE_VALUES.TENS]: 0, 
        [PLACE_VALUES.UNITS]: 0 
      }
    ]);
    
    setSelectedComparisonOperator(null);
    setHighlightedPlaceValue(null);
    setIsComparingNow(false);
    // Check if numbers are 0 and set completion status immediately
    const initialCompleteStatus = [
      newNumbers[0] === 0,
      newNumbers[1] === 0
    ];
    setIsAbacusComplete(initialCompleteStatus);
    
    dispatch({
      type: actions.SET_FEEDBACK,
      payload: null
    });
  // Include dependencies of generateNewNumbers here
  }, [difficultyLevel, dispatch, actions]); 

  // Generate new random numbers when the level changes or generateNewNumbers changes
  useEffect(() => {
    generateNewNumbers();
  }, [gameState.level, generateNewNumbers]); // Added generateNewNumbers dependency

  // Effect to start comparison when both abacuses are complete
  useEffect(() => {
    if (isAbacusComplete[0] && isAbacusComplete[1] && !isComparingNow) {
      startComparison();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAbacusComplete]); // Only trigger when completion status changes

  // Determine difficulty level based on game level
  useEffect(() => {
    if (gameState.level <= 5) {
      setDifficultyLevel(DIFFICULTY_LEVELS.LEVEL_1);
    } else if (gameState.level <= 10) {
      setDifficultyLevel(DIFFICULTY_LEVELS.LEVEL_2);
    } else {
      setDifficultyLevel(DIFFICULTY_LEVELS.LEVEL_3);
    }
  }, [gameState.level]); // Keep original level dependency for difficulty

  // Removed the standalone generateNewNumbers function definition as it's now wrapped in useCallback above

  const handleAbacusChange = (index, placeValue, value) => {
    // Make sure value stays within limits (0-9)
    const limitedValue = Math.max(0, Math.min(9, value));
    
    // Create a copy of the current states and update the specific value
    const newStates = [...abacusStates];
    newStates[index] = { ...newStates[index], [placeValue]: limitedValue };
    setAbacusStates(newStates);
    
    // Check if abacus is correctly reflecting the number
    if (numbers[index] !== null) {
      const placeValues = numberToPlaceValues(numbers[index]);
      let isCorrect = false; // Default to false

      // Ensure placeValues is a valid object before checking keys
      if (placeValues && typeof placeValues === 'object') {
        isCorrect = Object.keys(placeValues).every(
          place => newStates[index][place] === placeValues[place]
        );
      }
      
      // Update the completion status for this abacus
      const newIsComplete = [...isAbacusComplete];
      newIsComplete[index] = isCorrect;
      setIsAbacusComplete(newIsComplete);
      
      // Removed the immediate check from here, moved to useEffect
    }
  };

  const startComparison = () => {
    setIsComparingNow(true);
    // Start highlighting from the highest place value
    setHighlightedPlaceValue(difficultyLevel.usedPlaceValues[0]);
    playSound('click', gameState.sound);
  };

  const handleComparisonOperatorSelect = (operatorSymbol) => {
    setSelectedComparisonOperator(operatorSymbol);
    
    const correctOperator = compareNumbers(numbers[0], numbers[1]).symbol;
    const isCorrect = operatorSymbol === correctOperator;
    
    if (isCorrect) {
      // Handle correct answer
      dispatch({ type: actions.SET_FEEDBACK, payload: 'correct' });
      dispatch({ type: actions.ADD_SCORE, payload: 10 });
      
      // Add stars based on level
      const starsToAdd = gameState.level <= 5 ? 1 : (gameState.level <= 10 ? 2 : 3);
      dispatch({ type: actions.ADD_STARS, payload: starsToAdd });
      
      playSound('success', gameState.sound);
      
      // Set timeout to move to next level
      setTimeout(() => {
        dispatch({ type: actions.SET_LEVEL, payload: gameState.level + 1 });
      }, 2000);
    } else {
      // Handle incorrect answer
      dispatch({ type: actions.SET_FEEDBACK, payload: 'incorrect' });
      dispatch({ type: actions.INCREMENT_ATTEMPTS });
      playSound('error', gameState.sound);
      
      // Show hint after wrong answer
      setShowHints(true);
      
      // Reset comparison operator after a delay
      setTimeout(() => {
        setSelectedComparisonOperator(null);
        // Don't reset the comparison process, just let them try again
      }, 2000);
    }
  };

  const handleNextPlaceValueHighlight = (nextValue) => {
    // If we receive null, we're finishing the analysis
    if (nextValue === null) {
      setHighlightedPlaceValue(null);
      return;
    }
    
    // Otherwise, move to the next place value in sequence
    const currentIndex = difficultyLevel.usedPlaceValues.indexOf(highlightedPlaceValue);
    if (currentIndex < difficultyLevel.usedPlaceValues.length - 1) {
      // Move to next place value
      setHighlightedPlaceValue(difficultyLevel.usedPlaceValues[currentIndex + 1]);
    } else {
      // Finished highlighting all place values, ready for selection
      setHighlightedPlaceValue(null);
    }
  };

  return (
    <div className="compare-numbers-mode">
      <h2 className="mode-title">{t('compare_numbers_mode_title')}</h2>
      
      <CompareDisplay 
        numbers={numbers}
        level={gameState.level}
        difficultyLevel={difficultyLevel}
      />
      
      <DualAbacusSection 
        numbers={numbers}
        abacusStates={abacusStates}
        onAbacusChange={handleAbacusChange}
        highlightedPlaceValue={highlightedPlaceValue}
        isAbacusComplete={isAbacusComplete}
        showHints={showHints}
      />
      
      {isComparingNow && (
        <ComparisonControls 
          onComparisonSelect={handleComparisonOperatorSelect}
          selectedOperator={selectedComparisonOperator}
          highlightedPlaceValue={highlightedPlaceValue}
          onNextPlaceValue={handleNextPlaceValueHighlight}
          abacusStates={abacusStates}
          numbers={numbers}
        />
      )}
      
      <ComparisonFeedback 
        feedback={gameState.feedback}
        numbers={numbers}
      />
      
      {!isComparingNow && !isAbacusComplete[0] && !isAbacusComplete[1] && (
        <ComparisonInstructions 
          level={gameState.level}
          difficultyLevel={difficultyLevel}
        />
      )}
    </div>
  );
};

export default CompareNumbersMode;
