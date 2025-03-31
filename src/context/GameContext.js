import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { numberToRomanianWord } from '../utils/numberUtils';

// Initial game state
const initialState = {
  currentScreen: 'start',
  gameMode: null, // 'match', 'read', 'write'
  level: 1,
  score: 0,
  stars: 0,
  currentNumber: null,
  numberWord: '',
  abacusState: {
    thousands: 0,
    hundreds: 0,
    tens: 0,
    units: 0
  },
  currentAnswer: null,
  attempts: 0,
  feedback: null,
  showHint: false,
  difficulty: {
    min: 8,
    max: 99
  },
  sound: true,
  highestRoundingLevelUnlocked: 1 // Add state for rounding game levels
};

// Action types
export const actions = {
  SET_SCREEN: 'SET_SCREEN',
  SET_GAME_MODE: 'SET_GAME_MODE',
  SET_LEVEL: 'SET_LEVEL',
  ADD_SCORE: 'ADD_SCORE',
  ADD_STARS: 'ADD_STARS',
  SET_NUMBER: 'SET_NUMBER',
  UPDATE_ABACUS: 'UPDATE_ABACUS',
  SET_ANSWER: 'SET_ANSWER',
  INCREMENT_ATTEMPTS: 'INCREMENT_ATTEMPTS',
  SET_FEEDBACK: 'SET_FEEDBACK',
  TOGGLE_HINT: 'TOGGLE_HINT',
  RESET_GAME: 'RESET_GAME',
  TOGGLE_SOUND: 'TOGGLE_SOUND',
  SET_DIFFICULTY: 'SET_DIFFICULTY',
  UNLOCK_ROUNDING_LEVEL: 'UNLOCK_ROUNDING_LEVEL' // Add action type
};

// Reducer function
const gameReducer = (state, action) => {
  switch (action.type) {
    case actions.SET_SCREEN:
      return { ...state, currentScreen: action.payload };
    case actions.SET_GAME_MODE:
      return { ...state, gameMode: action.payload };
    case actions.SET_LEVEL:
      return { ...state, level: action.payload };
    case actions.ADD_SCORE:
      return { ...state, score: state.score + action.payload };
    case actions.ADD_STARS:
      return { ...state, stars: state.stars + action.payload };
    case actions.SET_NUMBER:
      return { 
        ...state, 
        currentNumber: action.payload.number,
        numberWord: action.payload.word
      };
    case actions.UPDATE_ABACUS:
      return { 
        ...state, 
        abacusState: { ...state.abacusState, ...action.payload } 
      };
    case actions.SET_ANSWER:
      return { ...state, currentAnswer: action.payload };
    case actions.INCREMENT_ATTEMPTS:
      return { ...state, attempts: state.attempts + 1 };
    case actions.SET_FEEDBACK:
      return { ...state, feedback: action.payload };
    case actions.TOGGLE_HINT:
      return { ...state, showHint: !state.showHint };
    case actions.RESET_GAME:
      return { 
        ...initialState,
        sound: state.sound,
        stars: state.stars // Keep the stars earned
      };
    case actions.TOGGLE_SOUND:
      return { ...state, sound: !state.sound };
    case actions.SET_DIFFICULTY:
      return { ...state, difficulty: action.payload };
    case actions.UNLOCK_ROUNDING_LEVEL:
      // Only update if the payload (level unlocked) is higher than the current highest
      return {
        ...state,
        highestRoundingLevelUnlocked: Math.max(state.highestRoundingLevelUnlocked, action.payload)
      };
    default:
      return state;
  }
};

// Create context
export const GameContext = createContext(); // <-- Added export

// Context provider component
export const GameProvider = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  // Load saved state from localStorage on initial load
  useEffect(() => {
    const savedState = localStorage.getItem('abacusAdventureState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // Restore properties
        dispatch({
          type: actions.ADD_STARS,
          payload: parsedState.stars || 0
        });
        // Restore highest unlocked rounding level
        dispatch({
            type: actions.UNLOCK_ROUNDING_LEVEL,
            payload: parsedState.highestRoundingLevelUnlocked || 1 // Default to 1 if not found
        });
      } catch (error) {
        console.error('Error parsing saved game state:', error);
      }
    }
  }, []);

  // Save relevant state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('abacusAdventureState', JSON.stringify({
      stars: gameState.stars,
      highestRoundingLevelUnlocked: gameState.highestRoundingLevelUnlocked // Save rounding level
    }));
  }, [gameState.stars, gameState.highestRoundingLevelUnlocked]); // Add dependency

  // Context value
  const contextValue = {
    gameState,
    dispatch,
    actions
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGameContext = () => useContext(GameContext);
