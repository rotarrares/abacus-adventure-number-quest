import React, { useEffect, useState } from 'react';
import { useGameContext } from '../../context/GameContext';
import { getRandomNumber } from '../../utils/numberUtils';
import { playSound } from '../../utils/audioUtils';
import SimpleAbacus from '../abacus/SimpleAbacus';
import '../../styles/GameModes.css';

const WriteNumberMode = () => {
  const { gameState, dispatch, actions } = useGameContext();
  const [userAnswer, setUserAnswer] = useState('');
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
  
  // Generate a random abacus configuration when the component mounts or level changes
  useEffect(() => {
    generateRandomAbacus();
    // Update difficulty based on level
    updateDifficultyForLevel(gameState.level);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.level]);
  
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
  
  const generateRandomAbacus = () => {
    const { min, max } = gameState.difficulty;
    const randomNumber = getRandomNumber(min, max);
    
    // Calculate place values
    const thousands = Math.floor(randomNumber / 1000) % 10;
    const hundreds = Math.floor(randomNumber / 100) % 10;
    const tens = Math.floor(randomNumber / 10) % 10;
    const units = randomNumber % 10;
    
    // Update abacus state
    dispatch({
      type: actions.UPDATE_ABACUS,
      payload: { thousands, hundreds, tens, units }
    });
    
    // Calculate and store the expected answer
    const expectedAnswer = thousands * 1000 + hundreds * 100 + tens * 10 + units;
    dispatch({
      type: actions.SET_NUMBER,
      payload: { 
        number: expectedAnswer, 
        word: '' // No word needed for this mode
      }
    });
    
    // Reset feedback and input
    dispatch({ type: actions.SET_FEEDBACK, payload: null });
    setUserAnswer('');
  };
  
  const handleInputChange = (e) => {
    // Only allow numeric input
    const value = e.target.value.replace(/[^0-9]/g, '');
    setUserAnswer(value);
    
    // Update answer in state
    dispatch({ type: actions.SET_ANSWER, payload: value });
  };
  
  const handleBeadChange = (column, value) => {
    // This is a read-only view of the abacus for this mode
    playSound('click', gameState.sound);
  };
  
  const checkAnswer = () => {
    playSound('click', gameState.sound);
    
    if (!userAnswer) {
      return; // Don't check empty answers
    }
    
    // Check if the answer is correct
    const isCorrect = parseInt(userAnswer) === gameState.currentNumber;
    
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
        dispatch({ type: actions.SET_LEVEL, payload: gameState.level + 1 });
        setCorrectAnswerCount(0); // Reset count after leveling up
      }
      
      // Add a star after each 3rd correct answer
      if (gameState.score % 30 < scoreToAdd) {
        dispatch({ type: actions.ADD_STARS, payload: 1 });
        playSound('star', gameState.sound);
      }
      
      // Move to next abacus after delay
      setTimeout(() => {
        dispatch({ type: actions.INCREMENT_ATTEMPTS, payload: 0 });
        generateRandomAbacus();
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
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };
  
  return (
    <div className="game-mode-container">
      <h2 className="mode-title">Scrie Numărul</h2>
      
      <p className="instructions">
        Care număr este reprezentat pe abac? (Nivel {gameState.level})
      </p>
      
      <SimpleAbacus onBeadChange={handleBeadChange} />
      
      <div className="answer-container">
        <input
          type="text"
          value={userAnswer}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Scrie numărul aici"
          className="number-input"
          inputMode="numeric"
          pattern="[0-9]*"
        />
      </div>
      
      <div className="feedback-container">
        {gameState.feedback === 'correct' && (
          <div className="feedback correct">
            Corect! Excelent!
          </div>
        )}
        
        {gameState.feedback === 'incorrect' && (
          <div className="feedback incorrect">
            Hmm, nu este corect. Încearcă din nou!
            
            {gameState.showHint && (
              <div className="hint">
                Indiciu: 
                {gameState.abacusState.thousands > 0 && ` ${gameState.abacusState.thousands} mii`}
                {gameState.abacusState.hundreds > 0 && ` ${gameState.abacusState.hundreds} sute`}
                {gameState.abacusState.tens > 0 && ` ${gameState.abacusState.tens} zeci`}
                {gameState.abacusState.units > 0 && ` ${gameState.abacusState.units} unități`}
              </div>
            )}
          </div>
        )}
      </div>
      
      <button 
        className="check-button"
        onClick={checkAnswer}
      >
        Verifică
      </button>
    </div>
  );
};

export default WriteNumberMode;