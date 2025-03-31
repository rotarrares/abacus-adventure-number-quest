import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import MatchNumberMode from './MatchNumberMode';
import { GameContext } from '../../context/GameContext'; // Import GameContext for mocking
import { useTranslation } from 'react-i18next';
// Import the mocked functions to make them available in the test scope
import { playSound, speakText } from '../../utils/audioUtils';
// Import PLACE_VALUES for hint test
import { PLACE_VALUES } from '../../constants/compareNumbersConstants';

// --- Mocks ---

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

// Mock utility functions
jest.mock('../../utils/audioUtils', () => ({
  playSound: jest.fn(),
  speakText: jest.fn(),
}));
jest.mock('../../utils/numberUtils', () => ({
  getRandomInt: jest.fn((min, max) => min), // Predictable random number (use min)
  numberToRomanianWord: jest.fn((num) => `word_${num}`), // Simple mock word
}));
// Mock the module, but define implementation in beforeEach
jest.mock('../../utils/compareNumbersUtils', () => ({
  getPlaceValueName: jest.fn(),
}));

// Mock Abacus3D component
jest.mock('../abacus/Abacus3D', () => ({
  __esModule: true,
  default: ({ abacusState, onBeadChange }) => (
    <div data-testid="abacus-3d" data-state={JSON.stringify(abacusState)}>
      Mock Abacus3D
      {/* Simulate changing units bead */}
      <button onClick={() => onBeadChange('units', (abacusState.units || 0) + 1)}>
        Increment Units
      </button>
       {/* Simulate changing tens bead */}
      <button onClick={() => onBeadChange('tens', (abacusState.tens || 0) + 1)}>
        Increment Tens
      </button>
       {/* Simulate changing hundreds bead */}
      <button onClick={() => onBeadChange('hundreds', (abacusState.hundreds || 0) + 1)}>
        Increment Hundreds
      </button>
    </div>
  ),
}));

// --- Helper Function for Rendering with Mock Context ---
const renderWithMockContext = (mockGameState = {}, mockDispatch = jest.fn(), mockActions = {}) => {
  const defaultState = {
    currentNumber: 123,
    abacusState: { units: 0, tens: 0, hundreds: 0, thousands: 0 },
    feedback: null,
    sound: false,
    level: 1,
    difficulty: { min: 100, max: 999 },
    showHint: false,
    attempts: 0,
    score: 0,
    stars: 0,
    ...mockGameState, // Override defaults with provided state
  };

  const defaultActions = {
    SET_DIFFICULTY: 'SET_DIFFICULTY',
    SET_NUMBER: 'SET_NUMBER',
    UPDATE_ABACUS: 'UPDATE_ABACUS',
    SET_FEEDBACK: 'SET_FEEDBACK',
    ADD_SCORE: 'ADD_SCORE',
    SET_LEVEL: 'SET_LEVEL',
    ADD_STARS: 'ADD_STARS',
    INCREMENT_ATTEMPTS: 'INCREMENT_ATTEMPTS',
    TOGGLE_HINT: 'TOGGLE_HINT',
    ...mockActions, // Override defaults with provided actions
  };

  // Note: useTranslation mock moved to beforeEach

  return render(
    <GameContext.Provider value={{ gameState: defaultState, dispatch: mockDispatch, actions: defaultActions }}>
      <MatchNumberMode />
    </GameContext.Provider>
  );
};

// Import the function to mock its implementation
import { getPlaceValueName } from '../../utils/compareNumbersUtils';

// --- Tests ---
describe('MatchNumberMode', () => {
  beforeEach(() => {
    // Reset mocks and setup implementations before each test
    jest.clearAllMocks();

    // Setup useTranslation mock
    useTranslation.mockImplementation(() => ({
      t: (key, options) => {
        if (key === 'match_number_mode') return 'Match the Number Mode Title';
        if (key === 'match_number_mode_instructions') return `Match the number: ${options?.number || 'N/A'}`;
        if (key === 'feedback_correct') return 'Correct!';
        if (key === 'feedback_incorrect') return 'Incorrect!';
        if (key === 'check_button') return 'Check';
        if (key === 'match_number_mode_hint_prefix') return `Hint: The number ${options?.number} has:`;
        if (key === 'units_name') return 'units';
        if (key === 'tens_name') return 'tens';
        if (key === 'hundreds_name') return 'hundreds';
        if (key === 'thousands_name') return 'thousands';
        return key; // Fallback
      },
      i18n: {
        changeLanguage: jest.fn(),
        language: 'en',
      },
    }));

    // Setup getPlaceValueName mock implementation
    getPlaceValueName.mockImplementation((place) => `${place}_name`);

    // Use fake timers for setTimeout
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Restore real timers
    jest.useRealTimers();
  });

  it('renders initial state correctly', () => {
    renderWithMockContext({ currentNumber: 456 });
    expect(screen.getByText('Match the Number Mode Title')).toBeInTheDocument();
    expect(screen.getByText(/Match the number: 456/i)).toBeInTheDocument();
    expect(screen.getByText('456')).toBeInTheDocument(); // Target number display
    expect(screen.getByTestId('abacus-3d')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Check' })).toBeInTheDocument();
    expect(screen.queryByText('Correct!')).not.toBeInTheDocument();
    expect(screen.queryByText('Incorrect!')).not.toBeInTheDocument();
    expect(screen.queryByText(/Hint:/)).not.toBeInTheDocument();
  });

  it('calls speakText with the number on initial render and number change', () => {
    const { rerender } = renderWithMockContext({ currentNumber: 123, sound: true });
    expect(speakText).toHaveBeenCalledWith('123', true);
    speakText.mockClear(); // Clear previous calls

    // Simulate number change by re-rendering with new context value
    // FIX: Added difficulty to newState as it's needed by useEffect -> generateNumber
    const newState = { currentNumber: 789, sound: true, difficulty: { min: 100, max: 999 } };
    rerender(
      <GameContext.Provider value={{ gameState: newState, dispatch: jest.fn(), actions: {} }}>
        <MatchNumberMode />
      </GameContext.Provider>
    );
    // Need to wait for useEffect to run
     act(() => {
       jest.advanceTimersByTime(1); // Advance timers slightly if needed
     });
    expect(speakText).toHaveBeenCalledWith('789', true);
  });

  it('dispatches UPDATE_ABACUS when a bead is changed', () => {
    const mockDispatch = jest.fn();
    const initialState = { abacusState: { units: 0, tens: 0, hundreds: 0, thousands: 0 } };
    renderWithMockContext(initialState, mockDispatch, { UPDATE_ABACUS: 'UPDATE_ABACUS' });

    const incrementUnitsButton = screen.getByRole('button', { name: 'Increment Units' });
    fireEvent.click(incrementUnitsButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_ABACUS',
      payload: { units: 1 },
    });
  });

  it('handles correct answer correctly', () => {
    const mockDispatch = jest.fn();
    const targetNumber = 123;
    const initialState = {
      currentNumber: targetNumber,
      abacusState: { units: 3, tens: 2, hundreds: 1, thousands: 0 }, // Correct state
      attempts: 0,
      score: 10,
      level: 1,
      sound: true,
      difficulty: { min: 100, max: 999 },
    };
    const actions = {
      SET_FEEDBACK: 'SET_FEEDBACK',
      ADD_SCORE: 'ADD_SCORE',
      ADD_STARS: 'ADD_STARS',
      INCREMENT_ATTEMPTS: 'INCREMENT_ATTEMPTS',
      SET_NUMBER: 'SET_NUMBER',
      UPDATE_ABACUS: 'UPDATE_ABACUS',
      SET_LEVEL: 'SET_LEVEL',
    };

    renderWithMockContext(initialState, mockDispatch, actions);

    const checkButton = screen.getByRole('button', { name: 'Check' });
    fireEvent.click(checkButton);

    // Check immediate feedback and sound
    expect(playSound).toHaveBeenCalledWith('click', true);
    expect(playSound).toHaveBeenCalledWith('correct', true);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_FEEDBACK', payload: 'correct' });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'ADD_SCORE', payload: 10 }); // 10 - 0*2

    // Check if star is added (score 10, adding 10 -> score 20, 20 % 30 >= 10)
    expect(mockDispatch).not.toHaveBeenCalledWith({ type: 'ADD_STARS', payload: 1 }); // Should not add star yet

    // Check if level up happens (correctAnswerCount is internal, test indirectly via setTimeout)
    expect(mockDispatch).not.toHaveBeenCalledWith({ type: 'SET_LEVEL', payload: 2 });

    // Advance timer for the next number generation
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'INCREMENT_ATTEMPTS', payload: 0 }); // Reset attempts
    // Check if generateNumber logic is triggered (dispatches SET_NUMBER and UPDATE_ABACUS)
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'SET_NUMBER' }));
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'UPDATE_ABACUS', payload: { units: 0, tens: 0, hundreds: 0, thousands: 0 } }));
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_FEEDBACK', payload: null }); // Reset feedback
  });

   it('handles correct answer and level up', () => {
     const mockDispatch = jest.fn();
     const targetNumber = 123;
     const initialState = {
       currentNumber: targetNumber,
       abacusState: { units: 3, tens: 2, hundreds: 1, thousands: 0 },
       attempts: 0, score: 40, level: 1, sound: false, difficulty: { min: 100, max: 999 }
     };
      const actions = { SET_FEEDBACK: 'SET_FEEDBACK', ADD_SCORE: 'ADD_SCORE', SET_LEVEL: 'SET_LEVEL', INCREMENT_ATTEMPTS: 'INCREMENT_ATTEMPTS', SET_NUMBER: 'SET_NUMBER', UPDATE_ABACUS: 'UPDATE_ABACUS', SET_DIFFICULTY: 'SET_DIFFICULTY' };

     // Simulate 4 previous correct answers by manually setting correctAnswerCount via state manipulation if possible,
     // or by clicking check 5 times. Clicking is more robust.
     const { rerender } = renderWithMockContext(initialState, mockDispatch, actions);

     // Simulate 5 correct answers
     for (let i = 0; i < 5; i++) {
       // Set abacus state correctly before each check
       const currentState = {
         ...initialState,
         currentNumber: 100 + i, // Change number slightly each time
         abacusState: { units: i, tens: 0, hundreds: 1, thousands: 0 },
         score: 40 + i * 10, // Simulate score increase
       };
        rerender(
          <GameContext.Provider value={{ gameState: currentState, dispatch: mockDispatch, actions: actions }}>
            <MatchNumberMode />
          </GameContext.Provider>
        );

       const checkButton = screen.getByRole('button', { name: 'Check' });
       fireEvent.click(checkButton);
       // Advance timer between checks
       act(() => { jest.advanceTimersByTime(1500); });
     }

     // After the 5th correct answer:
     expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_LEVEL', payload: 2 });
     // Check if difficulty update was triggered by level change (useEffect)
     expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_DIFFICULTY', payload: { min: 8, max: 99 } }); // Level 2 difficulty
   });

  // FIX: Added async keyword
  it('handles incorrect answer (first attempt)', async () => {
    const mockDispatch = jest.fn();
    const targetNumber = 123;
    const initialState = {
      currentNumber: targetNumber,
      abacusState: { units: 1, tens: 1, hundreds: 1, thousands: 0 }, // Incorrect state
      attempts: 0,
      sound: true,
      difficulty: { min: 100, max: 999 }, // Explicitly add difficulty
    };
    const actions = {
      SET_FEEDBACK: 'SET_FEEDBACK',
      INCREMENT_ATTEMPTS: 'INCREMENT_ATTEMPTS',
      TOGGLE_HINT: 'TOGGLE_HINT',
    };

    renderWithMockContext(initialState, mockDispatch, actions);

    const checkButton = screen.getByRole('button', { name: 'Check' });
    fireEvent.click(checkButton);

    expect(playSound).toHaveBeenCalledWith('click', true);
    expect(playSound).toHaveBeenCalledWith('incorrect', true);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_FEEDBACK', payload: 'incorrect' });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'INCREMENT_ATTEMPTS' });
    expect(mockDispatch).not.toHaveBeenCalledWith({ type: 'TOGGLE_HINT' }); // Hint not shown on first attempt

    // --- Re-render with updated state to show feedback ---
    // FIX: Added missing commas and included difficulty
    const stateWithFeedback = { ...initialState, feedback: 'incorrect', attempts: 1, difficulty: initialState.difficulty }; // Simulate state after dispatch
    const { rerender } = renderWithMockContext(initialState, mockDispatch, actions); // Initial render needed for rerender function
    rerender(
      <GameContext.Provider value={{ gameState: stateWithFeedback, dispatch: mockDispatch, actions: actions }}>
        <MatchNumberMode />
      </GameContext.Provider>
    );

    // Now check for the feedback text synchronously
    expect(screen.getByText('Incorrect!')).toBeInTheDocument();
    expect(screen.queryByText(/Hint:/)).not.toBeInTheDocument(); // Hint should still not be visible
  });

  it('handles incorrect answer (second attempt) and shows hint', () => {
    const mockDispatch = jest.fn();
    const targetNumber = 123;
    const initialState = {
      currentNumber: targetNumber,
      abacusState: { units: 1, tens: 1, hundreds: 1, thousands: 0 }, // Incorrect state
      attempts: 1, // Second attempt
      sound: false,
      showHint: false, // Hint initially hidden
      difficulty: { min: 100, max: 999 }, // Needed for hint generation
    };
    const actions = {
      SET_FEEDBACK: 'SET_FEEDBACK',
      INCREMENT_ATTEMPTS: 'INCREMENT_ATTEMPTS',
      TOGGLE_HINT: 'TOGGLE_HINT',
    };

    // Render with hint initially hidden
    const { rerender } = renderWithMockContext(initialState, mockDispatch, actions);

    const checkButton = screen.getByRole('button', { name: 'Check' });
    fireEvent.click(checkButton);

    // Check dispatches
    expect(playSound).toHaveBeenCalledWith('click', false);
    expect(playSound).toHaveBeenCalledWith('incorrect', false);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_FEEDBACK', payload: 'incorrect' });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'INCREMENT_ATTEMPTS' });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'TOGGLE_HINT' }); // Hint should be toggled

    // --- Re-render with hint shown ---
    // FIX: Added missing commas
    const stateWithHint = { ...initialState, attempts: 2, showHint: true, feedback: 'incorrect', difficulty: initialState.difficulty }; // Simulate state after dispatch
     rerender(
       <GameContext.Provider value={{ gameState: stateWithHint, dispatch: mockDispatch, actions: actions }}>
         <MatchNumberMode />
       </GameContext.Provider>
     );

    // Check UI feedback and hint
    expect(screen.getByText('Incorrect!')).toBeInTheDocument();
    expect(screen.getByText(/Hint: The number 123 has:/i)).toBeInTheDocument();
    // Check specific hint parts based on mocks
    expect(screen.getByText(/1 hundreds_name/)).toBeInTheDocument();
    expect(screen.getByText(/2 tens_name/)).toBeInTheDocument();
    expect(screen.getByText(/3 units_name/)).toBeInTheDocument();
  });
});
