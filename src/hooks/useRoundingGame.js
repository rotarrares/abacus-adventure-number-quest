import { useState, useEffect, useCallback, useContext, useRef } from 'react'; // Add useRef
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { GameContext, actions } from '../context/GameContext'; // Import context and actions
import * as roundingUtils from '../utils/roundingUtils'; // Uncommented
import * as roundingConstants from '../constants/roundingConstants'; // Uncommented
// import { playSound } from '../utils/audioUtils'; // TODO: Integrate sound, requires context or passed function

const useRoundingGame = (/* No initialLevel needed */) => { // Remove initialLevel prop
  const { gameState, dispatch } = useContext(GameContext); // Get full gameState
  const { level } = gameState; // Read level directly from context
  const { t } = useTranslation(); // Get translation function
  // const [level, setLevel] = useState(initialLevel); // REMOVE internal level state
  const [currentNumber, setCurrentNumber] = useState(null);
  const [targetPlace, setTargetPlace] = useState(null); // 'tens', 'hundreds', 'thousands', or null for level 1
  const [options, setOptions] = useState([]); // Rounding choices or place value targets
  const [correctAnswer, setCorrectAnswer] = useState(null); // Correct rounded value or place value map
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0); // e.g., flowers grown in current level
  const [feedback, setFeedback] = useState(null); // { type: 'correct' | 'incorrect', message: '...', selectedOption: ... }
  const [anaMessage, setAnaMessage] = useState('');
  // const [isLevelComplete, setIsLevelComplete] = useState(false); // REMOVE internal state
  const [resetLevel1Signal, setResetLevel1Signal] = useState(0); // State for reset signal

  // Use constant for level goal
  const levelGoal = roundingConstants.LEVEL_COMPLETION_GOAL;

  // Function to generate a new question based on the level (accepts optional override)
  const generateQuestion = useCallback((levelOverride) => {
    // Use context level if override not provided
    console.log(`[generateQuestion] START - levelOverride: ${levelOverride}, current context level: ${level}`);
    const targetLevel = levelOverride !== undefined ? levelOverride : level;
    // setIsLevelComplete(false); // REMOVE - No longer needed here
    setFeedback(null);
    console.log(`[generateQuestion] Generating question for targetLevel: ${targetLevel}`);

    const currentLevelData = roundingConstants.LEVELS[targetLevel];
    if (!currentLevelData) {
        console.error(`Invalid level: ${targetLevel}`);
        // Handle end of game or error state
        setAnaMessage(t('rounding_game_complete'));
        setCurrentNumber(null); // Stop game flow
        return;
    }

    // Use targetLevel for generation logic
    let num = roundingUtils.generateNumberForLevel(targetLevel);
    let place = currentLevelData.targetPlace || null; // Null for level 1
    let opts = [];
    let correctOpt = null;
    let message = '';

    if (targetLevel === 1) {
        // Place Value Basics
        place = null;
        // Ensure unique digits for simplicity in drag-drop, or adjust drag-drop logic
        // For now, generate until unique digits (simple approach, might be inefficient)
        // while (new Set(String(num)).size !== String(num).length) {
        //     num = roundingUtils.generateNumberForLevel(targetLevel);
        // }
        opts = Object.values(roundingConstants.PLACE_VALUE_NAMES).slice(0, String(num).length).reverse(); // Get relevant place names
        correctOpt = roundingUtils.createPlaceValueMap(num); // Map like { 'digit': 'PlaceName' }
        message = t('rounding_level_1_instruction', { number: num });
    } else if (targetLevel === 2) {
        correctOpt = roundingUtils.round(num, place);
        opts = roundingUtils.generateOptions(correctOpt, num, place);
        message = t('rounding_level_2_instruction', { number: num });
    } else if (targetLevel === 3) {
        correctOpt = roundingUtils.round(num, place);
        opts = roundingUtils.generateOptions(correctOpt, num, place);
        message = t('rounding_level_3_instruction', { number: num });
    } else if (targetLevel === 4) {
        correctOpt = roundingUtils.round(num, place);
        opts = roundingUtils.generateOptions(correctOpt, num, place);
        message = t('rounding_level_4_instruction', { number: num });
    } else if (targetLevel === 5) {
        // Mixed Rounding - Use targetLevel for number generation range if needed
        const places = ['tens', 'hundreds', 'thousands'];
        place = places[Math.floor(Math.random() * places.length)]; // Randomly select place
        // Ensure num is appropriate for the randomly chosen place if necessary
        // Example: if place is thousands, num should ideally be >= 1000
        // This might require adjusting generateNumberForLevel or regenerating num here
        correctOpt = roundingUtils.round(num, place);
        opts = roundingUtils.generateOptions(correctOpt, num, place);
        // Translate the place name for the instruction
        const translatedPlace = t(`place_value_${place}`); // Assumes keys like place_value_tens exist
        message = t('rounding_level_5_instruction', { number: num, place: translatedPlace });
    } else { // This case should ideally not be reached if level check is done before calling
        // Should be handled by the level check in advanceLevel, but as a fallback
        num = 0;
        place = null;
        opts = [];
        correctOpt = null;
        message = t('rounding_game_complete'); // Or a specific error message
        setCurrentNumber(null); // Ensure game stops
        return; // Exit early
    }

    setCurrentNumber(num);
    setTargetPlace(place); // Store the target place for level 5 hints etc.
    setOptions(opts);
    setCorrectAnswer(correctOpt);
    setAnaMessage(message);
    console.log(`[generateQuestion] END - Set number: ${num}, options: ${JSON.stringify(opts)}, correct: ${JSON.stringify(correctOpt)}, message: ${message}`);

  // Dependencies now include context `level` - removed setIsLevelComplete
  }, [level, t, setFeedback, setCurrentNumber, setTargetPlace, setOptions, setCorrectAnswer, setAnaMessage]);

  // Function to manually advance level (moved up)
  const advanceLevel = useCallback(() => { // Wrapped in useCallback
      // Removed isLevelComplete check - this should only be called when complete
      console.log(`advanceLevel called. Current context level: ${level}`); // Use context level
      // if (isLevelComplete) { // REMOVE check
          const nextLevel = level + 1; // Calculate based on context level
          console.log(`Attempting to advance to level: ${nextLevel}`);
          // Check if next level exists
          if (roundingConstants.LEVELS[nextLevel]) {
              console.log(`Level ${nextLevel} exists. Unlocking and setting state.`);
              // Reset progress FIRST
              setProgress(0);
              console.log(`[advanceLevel] Called setProgress(0)`);
              // Dispatch action to unlock the next level
              dispatch({ type: actions.UNLOCK_ROUNDING_LEVEL, payload: nextLevel });
              // Dispatch action to update the GLOBAL current level state
              // This will trigger the useEffect watching context `level` to generate the question
              dispatch({ type: actions.SET_LEVEL, payload: nextLevel });
              console.log(`[advanceLevel] Dispatching SET_LEVEL: ${nextLevel}`);
              // setLevel(nextLevel); // REMOVE internal state update
              // setIsLevelComplete(false); // REMOVE - generateQuestion handles this
              // console.log(`[advanceLevel] Called setIsLevelComplete(false)`);
              // REMOVE direct call - useEffect will handle it
              // console.log(`[advanceLevel] Calling generateQuestion(${nextLevel})`);
              // generateQuestion(nextLevel);
              // console.log(`[advanceLevel] Returned from generateQuestion(${nextLevel})`);
          } else {
              // Handle game completion (no more levels)
              dispatch({ type: actions.UNLOCK_ROUNDING_LEVEL, payload: level + 1 }); // Mark level 6 as "unlocked" to show 5 is done
              setAnaMessage(t('rounding_game_complete'));
              // Maybe set a flag like 'isGameComplete'
              // This is the correct place for game completion logic
              console.log(`Level ${nextLevel} does not exist. Handling game completion.`);
              dispatch({ type: actions.UNLOCK_ROUNDING_LEVEL, payload: level + 1 }); // Mark level 6 as "unlocked" to show 5 is done
              setAnaMessage(t('rounding_game_complete'));
              setCurrentNumber(null); // Explicitly stop game flow on completion
          }
      // } else { // REMOVE else block
      //     console.log("advanceLevel called but isLevelComplete is false.");
      // }
  // Adjust dependencies - removed isLevelComplete
  }, [level, dispatch, t, setProgress, setAnaMessage, setCurrentNumber]);

  const isInitialMount = useRef(true); // Ref to track initial mount

  // Generate initial question on component mount using context level
  useEffect(() => {
    console.log(`Initial mount: Generating question for context level ${level}`);
    generateQuestion(level); // Pass context level explicitly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateQuestion]); // generateQuestion dependency is fine, level comes from context

  // ADDED: Effect to generate question when context level changes AFTER mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false; // Set to false after the first render/effect run
    } else {
      // This block runs only for subsequent changes to context 'level'
      console.log(`Context level changed AFTER mount. New level: ${level}. Generating question.`);
      // generateQuestion will reset feedback etc.
      generateQuestion(); // Generate based on the new context level
    }
    // Watch context level and generateQuestion function reference
  }, [level, generateQuestion]);

  // Handle level progression check and automatic advancement
  useEffect(() => {
    // Trigger advancement only when progress *exactly* reaches the goal
    if (progress === levelGoal) {
      // setIsLevelComplete(true); // REMOVE
      setAnaMessage(t('rounding_level_complete', { level: level })); // Use context level
      // TODO: Play level complete sound
      // playSound(roundingConstants.AUDIO_PATHS.levelComplete, soundEnabled);

      // Restore the original timeout for advancing level (calls advanceLevel which dispatches SET_LEVEL)
      const advanceTimeout = setTimeout(() => {
        advanceLevel();
      }, 2000); // 2-second delay

      // Cleanup timeout if the component unmounts or dependencies change before timeout fires
      return () => clearTimeout(advanceTimeout);
    }
    // Watch context level here too - removed isLevelComplete
  }, [progress, level, levelGoal, t, advanceLevel]);


  // Handle option selection (Levels 2-5) - Use context level
  const handleOptionSelect = useCallback((selectedOption) => {
    // Check progress directly instead of isLevelComplete flag
    if (feedback || progress >= levelGoal) return;

    const isCorrect = selectedOption === correctAnswer;
    let feedbackMessage = '';

    if (isCorrect) {
      setScore(prev => prev + roundingConstants.POINTS_PER_CORRECT_ANSWER);
      setProgress(prev => prev + 1);
      feedbackMessage = t('rounding_feedback_correct_generic');
      // TODO: Play correct sound
      const nextProgress = progress + 1; // Calculate next progress
      setFeedback({ type: 'correct', message: feedbackMessage, selectedOption });
      // Generate next question (for same level) after a short delay, only if level not complete
      if (nextProgress < levelGoal) { // Use nextProgress in the check
         setTimeout(generateQuestion, 1500);
      }
    } else {
      // Provide a hint based on the target place
      let hintKey = '';
      if (targetPlace === 'tens') hintKey = 'rounding_feedback_incorrect_hint_tens';
      else if (targetPlace === 'hundreds') hintKey = 'rounding_feedback_incorrect_hint_hundreds';
      else if (targetPlace === 'thousands') hintKey = 'rounding_feedback_incorrect_hint_thousands';

      feedbackMessage = `${t('rounding_feedback_incorrect_generic')} ${t(hintKey)}`;
      // TODO: Play incorrect sound
      setFeedback({ type: 'incorrect', message: feedbackMessage, selectedOption });
      // Optional: Clear feedback after a delay so user can try again
      setTimeout(() => setFeedback(null), 2500);
    }
    setAnaMessage(feedbackMessage);

  // Dependencies include context `level` now - removed isLevelComplete
  }, [correctAnswer, feedback, generateQuestion, targetPlace, level, progress, levelGoal, t, setScore, setProgress, setFeedback, setAnaMessage]);

  // Handle drag-and-drop completion (Level 1) - Use context level
  const handleDragDrop = useCallback((dropResultPairs) => {
     // Check progress directly instead of isLevelComplete flag
     if (feedback || progress >= levelGoal || level !== 1) return;

     // Multiset comparison
     let isCorrect = false;
     if (Array.isArray(correctAnswer) && Array.isArray(dropResultPairs) && correctAnswer.length === dropResultPairs.length) {
        // Sorting logic remains the same
        const placeValueOrder = { 'Units': 0, 'Tens': 1, 'Hundreds': 2, 'Thousands': 3 };
        const sortPairs = (a, b) => {
            const placeComparison = placeValueOrder[a[1]] - placeValueOrder[b[1]];
            if (placeComparison !== 0) return placeComparison;
            return a[0].localeCompare(b[0]);
        };
        const sortedCorrectAnswer = [...correctAnswer].sort(sortPairs);
        const sortedDropResult = [...dropResultPairs].sort(sortPairs);
        isCorrect = sortedCorrectAnswer.every((pair, index) =>
            pair[0] === sortedDropResult[index][0] && pair[1] === sortedDropResult[index][1]
        );
     } else {
         console.error("Mismatch in answer/result structure or length:", correctAnswer, dropResultPairs);
         isCorrect = false;
     }

     let feedbackMessage = '';
     if (isCorrect) {
         setScore(prev => prev + roundingConstants.POINTS_PER_CORRECT_ANSWER);
         setProgress(prev => prev + 1);
         feedbackMessage = t('rounding_feedback_correct_generic');
         // TODO: Play correct sound
         const nextProgress = progress + 1; // Calculate next progress
         setFeedback({ type: 'correct', message: feedbackMessage });
         // Generate next question (for same level) if not complete
         if (nextProgress < levelGoal) { // Use nextProgress in the check
             setTimeout(generateQuestion, 1500);
         }
     } else {
         feedbackMessage = `${t('rounding_feedback_incorrect_generic')} ${t('rounding_feedback_incorrect_hint_place_value')}`;
         // TODO: Play incorrect sound
         setFeedback({ type: 'incorrect', message: feedbackMessage });
         // Trigger reset after a short delay
         setTimeout(() => {
             setFeedback(null);
             setResetLevel1Signal(prev => prev + 1);
      }, 2000);
     }
     setAnaMessage(feedbackMessage);

  // Removed unnecessary 'level' dependency (comes from context)
  }, [correctAnswer, feedback, generateQuestion, progress, levelGoal, t, setScore, setProgress, setFeedback, setAnaMessage, setResetLevel1Signal]);


  // Return context level - remove isLevelComplete
  return {
    level, // Return context level
    currentNumber,
    targetPlace,
    options,
    score,
    progress,
    feedback,
    anaMessage,
    // isLevelComplete, // Removed as it's no longer defined or used internally
    levelGoal, // Use the imported constant value
    handleOptionSelect,
    handleDragDrop,
    advanceLevel,
    resetLevel1Signal, // Pass the signal down
  };
};

export default useRoundingGame;
