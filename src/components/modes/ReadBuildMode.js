import React, { useEffect } from 'react';
import { useGameContext } from '../../context/GameContext';
import { numberToRomanianWord, getRandomNumber } from '../../utils/numberUtils';
import { playSound, speakText } from '../../utils/audioUtils';
import Abacus from '../abacus/Abacus';
import '../../styles/GameModes.css';

const ReadBuildMode = () => {
  const { gameState, dispatch, actions } = useGameContext();
  
  // Generate a random number when the component mounts
  useEffect(() => {
    generateNumber();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Speak the number in words when it changes
  useEffect(() => {
    if (gameState.numberWord) {
      speakText(gameState.numberWord, gameState.sound);
    }
  }, [gameState.numberWord, gameState.sound]);
  
  const generateNumber = () => {
    const { min, max } = gameState.difficulty;
    const number = getRandomNumber(min, max);
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
  
  const handleSpeak = () => {
    speakText(gameState.numberWord, gameState.sound);
  };
  
  return (
    <div className="game-mode-container">
      <h2 className="mode-title">Citește și Construiește</h2>
      
      <div className="target-word">
        <p>{gameState.numberWord}</p>
        <button 
          className="speak-button"
          onClick={handleSpeak}
          aria-label="Citește cu voce tare"
        >
          🔊
        </button>
      </div>
      
      <Abacus onBeadChange={handleBeadChange} />
      
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
                Indiciu: "{gameState.numberWord}" reprezintă numărul {gameState.currentNumber}
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

export default ReadBuildMode;