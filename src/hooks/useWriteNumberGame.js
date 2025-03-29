import { useState, useRef, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { getRandomNumber } from '../utils/numberUtils';
import { playSound, stopAllAudio } from '../utils/audioUtils';
import { calculateDifficultyForLevel } from '../utils/difficultyUtils';
import { numberToAbacusPositions, abacusPositionsToNumber } from '../utils/abacusUtils';
import { calculateScore, shouldAwardStar, shouldLevelUp } from '../utils/gameLogicUtils';

const useWriteNumberGame = () => {
  const { gameState, dispatch, actions } = useGameContext();
  const [userAnswer, setUserAnswer] = useState('');
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
  const isInitialMount = useRef(true);
  const prevLevelRef = useRef(null);
  const prevScreenRef = useRef(null);
  
  // Cleanup effect when unmounting or changing screen
  useEffect(() => {
    return () => {
      // Ensure we stop all audio when leaving the game
      stopAllAudio();
    };
  }, []);

  // Set up and clean up when entering/leaving game mode
  useEffect(() => {
    // Ensure we stop any ongoing audio when re-mounting the component
    if (gameState.currentScreen === 'game' && prevScreenRef.current !== 'game') {
      stopAllAudio();
    }
    
    prevScreenRef.current = gameState.currentScreen;
  }, [gameState.currentScreen]);
  
  // Set up and handle level changes
  useEffect(() => {
    // Stop any ongoing audio when level changes
    stopAllAudio();
    
    // Update difficulty based on level
    const difficulty = calculateDifficultyForLevel(gameState.level);
    dispatch({ 
      type: actions.SET_DIFFICULTY, 
      payload: difficulty
    });
    
    if (isInitialMount.current) {
      generateRandomAbacus();
      isInitialMount.current = false;
    } else if (gameState.level !== prevLevelRef.current) {
      // Only generate new abacus if level has changed
      generateRandomAbacus();
    }
    
    prevLevelRef.current = gameState.level;
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.level]);

  const generateRandomAbacus = () => {
    const { min, max } = gameState.difficulty;
    const randomNumber = getRandomNumber(min, max);
    
    // Get abacus positions from number
    const abacusPositions = numberToAbacusPositions(randomNumber);
    
    // Update abacus state
    dispatch({
      type: actions.UPDATE_ABACUS,
      payload: abacusPositions
    });
    
    // Store the expected answer
    dispatch({
      type: actions.SET_NUMBER,
      payload: { 
        number: randomNumber, 
        word: '' // No word needed for this mode
      }
    });
    
    // Reset feedback and input
    dispatch({ type: actions.SET_FEEDBACK, payload: null });
    setUserAnswer('');
  };

  const handleDigitClick = (digit) => {
    // Ensure we don't add more than 4 digits
    if (userAnswer.length < 4) {
      const newAnswer = userAnswer + digit;
      setUserAnswer(newAnswer);
      dispatch({ type: actions.SET_ANSWER, payload: newAnswer });
    }
  };
  
  const handleBackspace = () => {
    if (userAnswer.length > 0) {
      const newAnswer = userAnswer.slice(0, -1);
      setUserAnswer(newAnswer);
      dispatch({ type: actions.SET_ANSWER, payload: newAnswer });
    }
  };
  
  const handleClear = () => {
    setUserAnswer('');
    dispatch({ type: actions.SET_ANSWER, payload: '' });
  };
  
  const handleBeadChange = (column, value) => {
    // Read-only in this mode
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
      const scoreToAdd = calculateScore(gameState.attempts);
      dispatch({ type: actions.ADD_SCORE, payload: scoreToAdd });
      
      // Increment correct answer count
      const newCorrectCount = correctAnswerCount + 1;
      setCorrectAnswerCount(newCorrectCount);
      
      // Check if we should level up
      if (shouldLevelUp(newCorrectCount)) {
        // Stop all audio before level change
        stopAllAudio();
        
        dispatch({ type: actions.SET_LEVEL, payload: gameState.level + 1 });
        setCorrectAnswerCount(0); // Reset count after leveling up
      }
      
      // Check if we should award a star
      if (shouldAwardStar(gameState.score, scoreToAdd)) {
        dispatch({ type: actions.ADD_STARS, payload: 1 });
        playSound('star', gameState.sound);
      }
      
      // Move to next abacus after delay
      setTimeout(() => {
        // Stop all audio before generating new problem
        stopAllAudio();
        
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

  return {
    userAnswer,
    handleDigitClick,
    handleBackspace,
    handleClear,
    handleBeadChange,
    checkAnswer
  };
};

export default useWriteNumberGame;