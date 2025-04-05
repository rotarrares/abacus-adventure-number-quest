import { useState, useEffect, useCallback, useRef } from 'react';
import {
  LEVEL_CONFIG,
  INITIAL_SHIP_UPGRADES,
  ANIMATION_TIMINGS,
  PLACE_VALUE_NAMES,
} from '../constants/cosmicCalculatorConstants';
import { generateNoCarryAdditionProblem } from '../utils/cosmicCalculatorUtils';
import { playSound } from '../utils/audioUtils'; // Assuming this exists

const INITIAL_LEVEL = 1;

export const useCosmicCalculatorGame = (soundEnabled = true) => {
  // --- State Variables ---
  const [level, setLevel] = useState(INITIAL_LEVEL);
  const [starCoins, setStarCoins] = useState(0);
  const [currentProblem, setCurrentProblem] = useState(null); // { id, num1, num2, correctAnswer, options }
  const [problemProgress, setProblemProgress] = useState({ current: 0, total: 0 });
  const [gamePhase, setGamePhase] = useState('loading'); // 'loading', 'awaiting_input', 'animating_breakdown', 'showing_feedback', 'level_transition', 'level_complete', 'game_over', 'error'
  const [animationState, setAnimationState] = useState({ step: null, partialSum: {}, isActive: false }); // step: 'units'|'tens'|...|'done'|null
  const [feedback, setFeedback] = useState(null); // { isCorrect, messageKey, selectedOption }
  const [pendingAnswer, setPendingAnswer] = useState(null); // Store answer while animating
  const [shipUpgrades, setShipUpgrades] = useState(INITIAL_SHIP_UPGRADES);
  const [error, setError] = useState(null);
  const [problemHistory, setProblemHistory] = useState([]); // Optional log

  // Refs for managing timeouts to prevent issues with state updates in callbacks
  const animationTimeoutRef = useRef(null);
  const feedbackTimeoutRef = useRef(null);

  // --- Helper Functions ---

  // Function to clear any active timeouts
  const clearTimeouts = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
  }, []);

  // Function to generate and set a new problem for the current level
  const generateAndSetProblem = useCallback((targetLevel) => {
    const problem = generateNoCarryAdditionProblem(targetLevel);
    if (problem) {
      setCurrentProblem(problem);
      setAnimationState({ step: null, partialSum: {}, isActive: false }); // Reset animation
      setFeedback(null); // Clear previous feedback
      setGamePhase('awaiting_input'); // Ready for user input
    } else {
      console.error(`Failed to generate problem for level ${targetLevel}`);
      setError(`Failed to load problem for level ${targetLevel}.`);
      setGamePhase('error');
    }
  }, []);

  // Function to load all data needed for a specific level
  const loadLevelData = useCallback((targetLevel) => {
    clearTimeouts(); // Clear any pending actions from previous level/state
    setGamePhase('loading');
    setError(null);
    const config = LEVEL_CONFIG.find(l => l.level === targetLevel);
    if (!config) {
      setError(`Configuration for level ${targetLevel} not found.`);
      setGamePhase('error');
      return;
    }
    setProblemProgress({ current: 0, total: config.problemsPerLevel });
    generateAndSetProblem(targetLevel);
    // Note: gamePhase will be set to 'presenting_problem' by generateAndSetProblem
  }, [generateAndSetProblem, clearTimeouts]);


  // --- Animation Logic ---

  // Function to advance the breakdown animation to the next step
  const advanceAnimationStep = useCallback(() => {
    setAnimationState(prevState => {
      if (!prevState.isActive) return prevState; // Should not happen if called correctly

      const { num1, num2 } = currentProblem;
      const currentStepIndex = prevState.step === null ? -1 : Object.values(PLACE_VALUE_NAMES).indexOf(prevState.step);
      const nextStepIndex = currentStepIndex + 1;
      const maxDigits = LEVEL_CONFIG.find(l => l.level === level)?.numDigits || 1;

      if (nextStepIndex >= maxDigits) {
        // Animation finished
        return { ...prevState, step: 'done', isActive: false };
      }

      const nextStepName = PLACE_VALUE_NAMES[nextStepIndex];
      const digit1 = Math.floor(num1 / Math.pow(10, nextStepIndex)) % 10;
      const digit2 = Math.floor(num2 / Math.pow(10, nextStepIndex)) % 10;
      const sumDigit = digit1 + digit2;

      const newPartialSum = { ...prevState.partialSum, [nextStepName]: sumDigit };

      // Schedule the next step
      animationTimeoutRef.current = setTimeout(advanceAnimationStep, ANIMATION_TIMINGS.STEP_DELAY + ANIMATION_TIMINGS.DIGIT_FLY + ANIMATION_TIMINGS.DIGIT_MERGE);

      return { ...prevState, step: nextStepName, partialSum: newPartialSum, isActive: true };
    });
  }, [currentProblem, level]); // Dependencies needed for calculation

  // Function to start the breakdown animation sequence
  const startBreakdownAnimation = useCallback(() => {
    if (!currentProblem) return;
    clearTimeouts();
    setGamePhase('animating_breakdown');
    setAnimationState({ step: null, partialSum: {}, isActive: true }); // Start animation sequence
    // Initial delay before the first step (units) starts
    animationTimeoutRef.current = setTimeout(advanceAnimationStep, ANIMATION_TIMINGS.STEP_DELAY);
  }, [currentProblem, advanceAnimationStep, clearTimeouts]);

  // Effect to process answer after animation completes
  useEffect(() => {
    if (animationState.step === 'done' && !animationState.isActive && pendingAnswer !== null) {
      // Animation finished, now process the stored answer
      processAnswerAfterAnimation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationState, pendingAnswer]); // Dependency includes pendingAnswer


  // --- Core Game Actions ---

  // Function to handle player's answer submission: Store answer and start animation
  const handleAnswer = useCallback((selectedOption) => {
    // Only accept answer if we are in 'awaiting_input' and no answer is pending
    if (gamePhase !== 'awaiting_input' || pendingAnswer !== null) return;

    setPendingAnswer(selectedOption); // Store the answer
    startBreakdownAnimation(); // Start the calculation animation

  }, [gamePhase, pendingAnswer, startBreakdownAnimation]); // Dependencies updated

  // Function to process the answer AFTER the animation has finished
  const processAnswerAfterAnimation = useCallback(() => {
    if (pendingAnswer === null || !currentProblem) return; // Should not happen if called correctly

    const isCorrect = pendingAnswer === currentProblem.correctAnswer;
    const messageKey = isCorrect ? 'correct' : 'incorrect';
    setFeedback({ isCorrect, messageKey: `cosmic_calculator.${messageKey}`, selectedOption: pendingAnswer });
    setGamePhase('showing_feedback');
    playSound(isCorrect ? 'correct' : 'incorrect', soundEnabled);

    let nextProblemIndex = problemProgress.current;
    let currentStarCoins = starCoins;

    if (isCorrect) {
      nextProblemIndex++;
      currentStarCoins++;
      setStarCoins(currentStarCoins);
      setProblemProgress(prev => ({ ...prev, current: nextProblemIndex }));
      setProblemHistory(prev => [...prev, { ...currentProblem, selectedOption: pendingAnswer, isCorrect }]);
    } else {
      setProblemHistory(prev => [...prev, { ...currentProblem, selectedOption: pendingAnswer, isCorrect }]);
    }

    setPendingAnswer(null); // Clear the pending answer

    // Check for level completion
    const levelGoal = problemProgress.total;
    if (isCorrect && nextProblemIndex >= levelGoal) {
      // Level Complete
      clearTimeouts(); // Clear any animation timeouts
      feedbackTimeoutRef.current = setTimeout(() => {
        setGamePhase('level_complete');
        playSound('complete', soundEnabled);
      }, ANIMATION_TIMINGS.FEEDBACK_DELAY);
    } else {
      // Load next problem after feedback delay
      clearTimeouts(); // Clear any animation timeouts
      feedbackTimeoutRef.current = setTimeout(() => {
        generateAndSetProblem(level);
        // gamePhase will be set to 'awaiting_input' by generateAndSetProblem
      }, ANIMATION_TIMINGS.FEEDBACK_DELAY);
    }
  // Dependencies need to include everything used inside:
  }, [pendingAnswer, currentProblem, problemProgress, starCoins, level, generateAndSetProblem, soundEnabled, clearTimeouts, playSound]); // Added playSound

  // Function to proceed to the next level or game over
  const nextLevel = useCallback(() => {
    clearTimeouts();
    const nextLevelNumber = level + 1;
    const maxLevel = LEVEL_CONFIG.length;

    if (nextLevelNumber > maxLevel) {
      setGamePhase('game_over');
      // Handle final game completion logic
    } else {
      setLevel(nextLevelNumber);
      setGamePhase('level_transition'); // Brief phase for potential transition animation
      // Load data for the next level after a short delay
      setTimeout(() => loadLevelData(nextLevelNumber), 500); // Adjust delay as needed
    }
  }, [level, loadLevelData, clearTimeouts]);

  // Function to restart the game from the beginning
  const restartGame = useCallback(() => {
    clearTimeouts();
    setLevel(INITIAL_LEVEL);
    setStarCoins(0);
    setShipUpgrades(INITIAL_SHIP_UPGRADES);
    setProblemHistory([]);
    setError(null);
    loadLevelData(INITIAL_LEVEL); // Load level 1 data
  }, [loadLevelData, clearTimeouts]);

  // --- Initialization Effect ---
  useEffect(() => {
    loadLevelData(INITIAL_LEVEL); // Load level 1 on initial mount
    // Cleanup timeouts on unmount
    return clearTimeouts;
  }, [loadLevelData, clearTimeouts]); // Ensure loadLevelData is stable

  // --- Return Values ---
  return {
    level,
    starCoins,
    currentProblem,
    problemProgress,
    gamePhase,
    animationState,
    feedback,
    shipUpgrades,
    error,
    problemHistory, // Optional
    // Actions
    // startBreakdownAnimation is now internal, triggered by handleAnswer
    handleAnswer,
    nextLevel, // Triggered by LevelComplete modal
    restartGame, // Triggered by GameOver screen
  };
};