import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react'; // Removed waitFor for now
import '@testing-library/jest-dom';
// Remove I18nextProvider and i18n imports as we'll mock the hook
import { GameContext } from '../../context/GameContext';
import RoundingNumbersMode from './RoundingNumbersMode';
import useRoundingGame from '../../hooks/useRoundingGame';
import * as roundingConstants from '../../constants/roundingConstants';

// Mock the custom hook
jest.mock('../../hooks/useRoundingGame');

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key, // Simple mock returns the key
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      isInitialized: true, // Assume it's initialized
      // Add other properties if needed by the component under test
    },
  }),
  // I18nextProvider is not needed if useTranslation is mocked
}));


// Mock child components to simplify testing the mode itself
jest.mock('../rounding/Garden', () => ({ children }) => <div data-testid="garden">{children}</div>);
jest.mock('../rounding/Scoreboard', () => ({ score, progress, level, levelGoal }) => (
  <div data-testid="scoreboard">
    Score: {score}, Progress: {progress}/{levelGoal}, Level: {level}
  </div>
));
jest.mock('../rounding/AnaCharacter', () => ({ message, mood }) => (
  <div data-testid="ana-character" data-mood={mood}>
    Ana says: {message}
  </div>
));
jest.mock('../rounding/NumberCard', () => ({ number, highlightDigit }) => (
  <div data-testid="number-card">
    Number: {number}, Highlight: {highlightDigit || 'none'}
  </div>
));
jest.mock('../rounding/RoundingOptions', () => ({ options, onSelect, feedback }) => (
  <div data-testid="rounding-options">
    Options: {options.join(', ')}
    {options.map(opt => (
      <button key={opt} onClick={() => onSelect(opt)}>
        {opt}
      </button>
    ))}
    {feedback && <span data-testid="options-feedback">{feedback.type}</span>}
  </div>
));
jest.mock('../rounding/PlaceValueDragger', () => ({ number, onDrop, feedback, resetSignal }) => (
  <div data-testid="place-value-dragger">
    Dragger for: {number}
    {/* Simulate a drop for testing */}
    <button onClick={() => onDrop([['mockDigit', 'mockPlace']])}>Simulate Drop</button>
    {feedback && <span data-testid="dragger-feedback">{feedback.type}</span>}
    <span>Reset Signal: {resetSignal}</span>
  </div>
));

// Helper function to render with providers and mocked hook state
const renderComponent = (mockHookState, initialGameStateOverrides = {}) => {
  useRoundingGame.mockReturnValue(mockHookState);
  const mockDispatch = jest.fn();

  // Start with a reasonable default state, similar to initialState in GameContext
  const baseGameState = {
    currentScreen: 'game',
    gameMode: 'rounding',
    level: 1,
    score: 0,
    stars: 0,
    currentNumber: null,
    numberWord: '',
    abacusState: { thousands: 0, hundreds: 0, tens: 0, units: 0 },
    currentAnswer: null,
    attempts: 0,
    feedback: null, // Let mockHookState override this if needed via component logic
    showHint: false,
    difficulty: { min: 8, max: 99 },
    sound: true,
    highestRoundingLevelUnlocked: 1,
  };

  // Apply overrides specific to the test case
  const gameState = { ...baseGameState, ...initialGameStateOverrides };

  // Ensure the gameState.level matches the hook's level for consistency
  // as the component reads level directly from context
  gameState.level = mockHookState.level !== undefined ? mockHookState.level : gameState.level;

  // The component itself uses the hook's feedback/message, not directly from context state
  // So we don't need to merge mockHookState.feedback/anaMessage into gameState here.

  return render(
    <GameContext.Provider value={{ gameState, dispatch: mockDispatch, actions: {} }}>
      {/* No I18nextProvider needed here anymore */}
      <RoundingNumbersMode />
    </GameContext.Provider>
  );
};

// Default mock state for the hook
const defaultMockHookState = {
  level: 1,
  currentNumber: 123,
  targetPlace: null,
  options: ['Units', 'Tens', 'Hundreds'], // Example for level 1
  score: 0,
  progress: 0,
  feedback: null,
  anaMessage: 'Level 1: Match digits!',
  isLevelComplete: false, // This is derived in the component now
  levelGoal: roundingConstants.LEVEL_COMPLETION_GOAL,
  handleOptionSelect: jest.fn(),
  handleDragDrop: jest.fn(),
  advanceLevel: jest.fn(),
  resetLevel1Signal: 0,
};

describe('RoundingNumbersMode Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    useRoundingGame.mockClear();
    defaultMockHookState.handleOptionSelect.mockClear();
    defaultMockHookState.handleDragDrop.mockClear();
    defaultMockHookState.advanceLevel.mockClear();
  });

  test('renders loading state when currentNumber is null', () => { // No longer async
    renderComponent({ ...defaultMockHookState, currentNumber: null, level: 1 });
    // Check for the key directly, as returned by the mock t function
    expect(screen.getByText('rounding_loading')).toBeInTheDocument();
  });

  test('renders game complete state when level is beyond max and number is null', () => { // No longer async
    const maxLevel = Object.keys(roundingConstants.LEVELS).length;
    renderComponent({ ...defaultMockHookState, currentNumber: null, level: maxLevel + 1 });
    // Check for the key directly
    expect(screen.getByText('rounding_game_complete')).toBeInTheDocument();
  });

  test('renders Level 1 components correctly', () => {
    renderComponent({ ...defaultMockHookState, level: 1, currentNumber: 45, options: ['Units', 'Tens'], anaMessage: 'Level 1 Start' });
    expect(screen.getByTestId('scoreboard')).toHaveTextContent('Level: 1');
    expect(screen.getByTestId('garden')).toBeInTheDocument();
    expect(screen.getByTestId('ana-character')).toHaveTextContent('Ana says: Level 1 Start');
    expect(screen.getByTestId('ana-character')).toHaveAttribute('data-mood', 'explaining'); // Mood based on message
    expect(screen.getByTestId('number-card')).toHaveTextContent('Number: 45');
    expect(screen.getByTestId('place-value-dragger')).toBeInTheDocument();
    expect(screen.queryByTestId('rounding-options')).not.toBeInTheDocument();
  });

  test('renders Level 2+ components correctly', () => {
    renderComponent({
      ...defaultMockHookState,
      level: 2,
      currentNumber: 128,
      targetPlace: 'tens',
      options: [120, 130, 140],
      anaMessage: 'Level 2 Start',
    });
    expect(screen.getByTestId('scoreboard')).toHaveTextContent('Level: 2');
    expect(screen.getByTestId('garden')).toBeInTheDocument();
    expect(screen.getByTestId('ana-character')).toHaveTextContent('Ana says: Level 2 Start');
    expect(screen.getByTestId('ana-character')).toHaveAttribute('data-mood', 'explaining');
    expect(screen.getByTestId('number-card')).toHaveTextContent('Number: 128');
    expect(screen.getByTestId('number-card')).toHaveTextContent('Highlight: tens');
    expect(screen.getByTestId('rounding-options')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('130')).toBeInTheDocument();
    expect(screen.getByText('140')).toBeInTheDocument();
    expect(screen.queryByTestId('place-value-dragger')).not.toBeInTheDocument();
  });

  test('calls handleDragDrop when drop is simulated in Level 1', () => {
    const handleDragDropMock = jest.fn();
    renderComponent({ ...defaultMockHookState, level: 1, handleDragDrop: handleDragDropMock });

    const dropButton = screen.getByText('Simulate Drop');
    fireEvent.click(dropButton);

    expect(handleDragDropMock).toHaveBeenCalledTimes(1);
    expect(handleDragDropMock).toHaveBeenCalledWith([['mockDigit', 'mockPlace']]); // Check args from mock component
  });

  test('calls handleOptionSelect when an option is clicked in Level 2+', () => {
    const handleOptionSelectMock = jest.fn();
    renderComponent({
      ...defaultMockHookState,
      level: 3,
      currentNumber: 456,
      targetPlace: 'hundreds',
      options: [400, 500, 600],
      handleOptionSelect: handleOptionSelectMock,
    });

    const optionButton = screen.getByText('500');
    fireEvent.click(optionButton);

    expect(handleOptionSelectMock).toHaveBeenCalledTimes(1);
    expect(handleOptionSelectMock).toHaveBeenCalledWith(500);
  });

  test('displays correct feedback and Ana mood for correct answer', () => {
    renderComponent({
      ...defaultMockHookState,
      level: 2,
      feedback: { type: 'correct', message: 'Well done!', selectedOption: 130 },
      anaMessage: 'Well done!', // Hook sets anaMessage based on feedback
    });

    expect(screen.getByTestId('ana-character')).toHaveAttribute('data-mood', 'happy');
    expect(screen.getByTestId('ana-character')).toHaveTextContent('Ana says: Well done!');
    // Check feedback on the options component if applicable
    expect(screen.getByTestId('options-feedback')).toHaveTextContent('correct');
  });

  test('displays correct feedback and Ana mood for incorrect answer', () => {
     renderComponent({
      ...defaultMockHookState,
      level: 2,
      feedback: { type: 'incorrect', message: 'Try again!', selectedOption: 120 },
      anaMessage: 'Try again!', // Hook sets anaMessage based on feedback
    });

    expect(screen.getByTestId('ana-character')).toHaveAttribute('data-mood', 'wrong');
    expect(screen.getByTestId('ana-character')).toHaveTextContent('Ana says: Try again!');
     // Check feedback on the options component if applicable
    expect(screen.getByTestId('options-feedback')).toHaveTextContent('incorrect');
  });

   test('hides interaction components when level progress reaches goal', () => {
    renderComponent({
      ...defaultMockHookState,
      level: 2,
      progress: roundingConstants.LEVEL_COMPLETION_GOAL, // Level is complete
      anaMessage: 'Level Complete!',
    });

    expect(screen.getByTestId('ana-character')).toHaveTextContent('Ana says: Level Complete!');
    // Interaction components should not be rendered when progress >= levelGoal
    expect(screen.queryByTestId('rounding-options')).not.toBeInTheDocument();
    expect(screen.queryByTestId('place-value-dragger')).not.toBeInTheDocument();
  });

});
