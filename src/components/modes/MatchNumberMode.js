import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameContext } from '../../context/GameContext';
import { numberToRomanianWord, getRandomInt } from '../../utils/numberUtils'; // Keep Ro specific for now
import { getPlaceValueName } from '../../utils/compareNumbersUtils'; // Import for hint
import { PLACE_VALUES } from '../../constants/compareNumbersConstants'; // Import for hint
import { playSound, speakText } from '../../utils/audioUtils';
// import SimpleAbacus from '../abacus/SimpleAbacus'; // Replaced with Abacus3D
import Abacus3D from '../abacus/Abacus3D'; // Import the 3D Abacus
import '../../styles/GameModes.css';

const MatchNumberMode = () => {
  const { gameState, dispatch, actions } = useGameContext();
  const { t } = useTranslation();
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
  const [usedNumbersInRound, setUsedNumbersInRound] = useState([]); // Track used numbers
  
  // Generate a random number when the component mounts or level changes
  useEffect(() => {
    // console.log(`[MatchNumberMode] New round/level started. Level: ${gameState.level}`); // Removed log
    // Update difficulty based on level
    setUsedNumbersInRound([]); // Reset used numbers for the new round
    updateDifficultyForLevel(gameState.level);
    generateNumber();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.level]);
  
  // Speak the number when it changes
  useEffect(() => {
    if (gameState.currentNumber !== null) {
      speakText(gameState.currentNumber.toString(), gameState.sound);
    }
  }, [gameState.currentNumber, gameState.sound]);
  
  // Update difficulty based on level
  const updateDifficultyForLevel = (level) => {
    let difficulty;
    
    if (level <= 2) {
      difficulty = { min: 8, max: 99 }; // 2-digit numbers
    } else if (level <= 4) {
      difficulty = { min: 100, max: 999 }; // 3-digit numbers
    } else {
      difficulty = { min: 1000, max: 9999 }; // 4-digit numbers
    }
    
    dispatch({ 
      type: actions.SET_DIFFICULTY, 
      payload: difficulty
    });
  };
  
  const generateNumber = () => {
    const { min, max } = gameState.difficulty;
    let number;
    let attempts = 0; // Safety break for potential infinite loops
    const maxAttempts = (max - min + 1) * 2; // Allow some retries

    do {
      number = getRandomInt(min, max);
      attempts++;
      // Prevent infinite loop if all numbers in a small range are used quickly
      if (attempts > maxAttempts) {
        console.warn("[MatchNumberMode] Could not find a unique number after multiple attempts. Resetting used numbers for safety.");
        setUsedNumbersInRound([]); // Reset the list to allow generation
        // Optionally, just reuse a number if resetting is undesirable
        // break;
      }
    } while (usedNumbersInRound.includes(number) && attempts <= maxAttempts);

    // console.log(`[MatchNumberMode] Generated number: ${number}`); // Removed log
    setUsedNumbersInRound(prevUsed => [...prevUsed, number]); // Add the new number to the list
    // TODO: Use language-aware number-to-word library here instead of just Romanian
    const word = numberToRomanianWord(number); 
    
    dispatch({
      type: actions.SET_NUMBER,
      payload: { number, word }
    });
    
    // Reset abacus state and attempts
    dispatch({
      type: actions.UPDATE_ABACUS,
      payload: {
        thousands: 0,
        hundreds: 0,
        tens: 0,
        units: 0
      }
    });
    
    dispatch({ type: actions.SET_FEEDBACK, payload: null });
  };
  
  const handleBeadChange = (column, value) => {
    dispatch({
      type: actions.UPDATE_ABACUS,
      payload: { [column]: value }
    });
  };
  
  const checkAnswer = () => {
    playSound('click', gameState.sound);
    
    const { abacusState, currentNumber } = gameState;
    
    // Convert abacus state to a number
    const abacusNumber = 
      abacusState.thousands * 1000 + 
      abacusState.hundreds * 100 + 
      abacusState.tens * 10 + 
      abacusState.units;
    
    // Check if the answer is correct
    const isCorrect = abacusNumber === currentNumber;
    
    if (isCorrect) {
      playSound('correct', gameState.sound);
      dispatch({ type: actions.SET_FEEDBACK, payload: 'correct' });
      
      // Add score
      const scoreToAdd = Math.max(10 - (gameState.attempts * 2), 1);
      dispatch({ type: actions.ADD_SCORE, payload: scoreToAdd });
      
      // Increment correct answer count
      const newCorrectCount = correctAnswerCount + 1;
      setCorrectAnswerCount(newCorrectCount);
      
      // Check if we should level up (every 5 correct answers)
      if (newCorrectCount >= 5) {
        // console.log(`[MatchNumberMode] Leveling up to ${gameState.level + 1}. Resetting round.`); // Removed log
        dispatch({ type: actions.SET_LEVEL, payload: gameState.level + 1 });
        setCorrectAnswerCount(0); // Reset count after leveling up
      }
      
      // Add a star after each 3rd correct answer
      if (gameState.score % 30 < scoreToAdd) {
        dispatch({ type: actions.ADD_STARS, payload: 1 });
        playSound('star', gameState.sound);
      }
      
      // Move to next number after delay
      setTimeout(() => {
        dispatch({ type: actions.INCREMENT_ATTEMPTS, payload: 0 });
        generateNumber();
      }, 1500);
    } else {
      playSound('incorrect', gameState.sound);
      dispatch({ type: actions.SET_FEEDBACK, payload: 'incorrect' });
      dispatch({ type: actions.INCREMENT_ATTEMPTS });
      
      // Show hint if second attempt fails
      if (gameState.attempts >= 1) {
        dispatch({ type: actions.TOGGLE_HINT });
      }
    }
  };
  
  // Helper function to construct the hint text
  const getHintText = () => {
    const num = gameState.currentNumber;
    if (num === null) return '';

    let hintParts = [];
    const thousands = Math.floor(num / 1000);
    const hundreds = Math.floor((num % 1000) / 100);
    const tens = Math.floor((num % 100) / 10);
    const units = num % 10;

    // FIX: Remove 't' argument as it's unused by the (mocked) function
    if (thousands > 0) hintParts.push(`${thousands} ${getPlaceValueName(PLACE_VALUES.THOUSANDS).toLowerCase()}`);
    if (hundreds > 0) hintParts.push(`${hundreds} ${getPlaceValueName(PLACE_VALUES.HUNDREDS).toLowerCase()}`);
    if (tens > 0) hintParts.push(`${tens} ${getPlaceValueName(PLACE_VALUES.TENS).toLowerCase()}`);
    if (units > 0) hintParts.push(`${units} ${getPlaceValueName(PLACE_VALUES.UNITS).toLowerCase()}`);
    
    return `${t('match_number_mode_hint_prefix', { number: num })} ${hintParts.join(', ')}`;
  };

  return (
    <div className="game-mode-container match-number-mode"> {/* Added specific class */}
      {/* Column 1: Abacus */}
      <div className="abacus-column">
        <Abacus3D 
          abacusState={gameState.abacusState} 
          onBeadChange={handleBeadChange} 
        />
      </div>

      {/* Column 2: Controls, Feedback, etc. */}
      <div className="controls-column">
        <h2 className="mode-title">{t('match_number_mode')}</h2>
        
        <p className="instructions">
          {t('match_number_mode_instructions', { number: gameState.currentNumber, level: gameState.level })}
        </p>
        
        <div className="target-number">
          <span>{gameState.currentNumber}</span>
        </div>
        
        <div className="feedback-container">
          {gameState.feedback === 'correct' && (
            <div className="feedback correct">
              {t('feedback_correct')}
            </div>
          )}
          
          {gameState.feedback === 'incorrect' && (
            <div className="feedback incorrect">
              {t('feedback_incorrect')}
              
              {gameState.showHint && (
                <div className="hint">
                  {getHintText()}
                </div>
              )}
            </div>
          )}
        </div>
        
        <button 
          className="check-button"
          onClick={checkAnswer}
        >
          {t('check_button')}
        </button>
      </div>
    </div>
  );
};

export default MatchNumberMode;
