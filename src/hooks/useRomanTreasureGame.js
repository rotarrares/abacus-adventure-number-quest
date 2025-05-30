import { useState, useEffect, useCallback, useRef } from 'react'; // Added useRef
import { generateTask, toRoman } from '../utils/romanNumeralUtils'; // Removed unused fromRoman
import { LEVEL_CONFIG } from '../constants/romanNumeralConstants';
import { playSound } from '../utils/audioUtils'; // Assuming sound utility exists

const INITIAL_LEVEL = 1;
const MAX_LEVELS = 5; // Total number of levels defined in game spec

export const useRomanTreasureGame = (soundEnabled = true) => {
  const [level, setLevel] = useState(INITIAL_LEVEL);
  const [treasures, setTreasures] = useState(0); // Using 'treasures' instead of 'score'
  const [currentTask, setCurrentTask] = useState(null);
  const [taskProgress, setTaskProgress] = useState(0); // How many tasks completed in current level
  const [feedback, setFeedback] = useState(''); // Feedback message (e.g., "Correct!", "Try Again!")
  const [isCorrect, setIsCorrect] = useState(null); // null: no answer yet, true: correct, false: incorrect
  const [showRobi, setShowRobi] = useState(false);
  const [robiHint, setRobiHint] = useState('');
  const [gamePhase, setGamePhase] = useState('loading'); // loading, playing, level_complete, game_over
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const usedTasksThisLevelRef = useRef(new Set()); // Use a ref to track used tasks within the level

  // Function to generate and set a new, unique task for the level
  const loadNewTask = useCallback((currentLevel) => {
    let task;
    let attempts = 0;
    const maxAttempts = 20; // Safety break to prevent infinite loops
  
    do {
      task = generateTask(currentLevel);
      attempts++;
      // Check if task generation failed or if we've exhausted attempts
      if (!task || attempts > maxAttempts) {
        console.error(`Failed to generate a unique task for level ${currentLevel} after ${attempts} attempts.`);
        // Fallback: Reset used tasks and try one more time, or show error
        if (attempts > maxAttempts) {
            usedTasksThisLevelRef.current.clear(); // Allow repeats if necessary
            task = generateTask(currentLevel);
            if (!task) {
                setGamePhase('error');
                return; // Exit if still no task
            }
        } else {
            setGamePhase('error');
            return; // Exit if task generation failed initially
        }
      }
      // Keep generating until we find a task whose question hasn't been used or we hit max attempts
    } while (usedTasksThisLevelRef.current.has(task.question) && attempts <= maxAttempts);
  
    // Add the new task's question to the set of used tasks
    usedTasksThisLevelRef.current.add(task.question);
  
    setCurrentTask(task);
    setFeedback('');
    setIsCorrect(null);
    setRobiHint(''); // Clear hint for new task
    console.log(`New Task (Level ${currentLevel}, Attempt ${attempts}):`, task);
  
  }, []); // Dependencies remain empty as it relies on the ref and level passed in

  // Initialize game or load task when level changes
  useEffect(() => {
    setGamePhase('playing');
    setTaskProgress(0); // Reset task progress for the new level
    usedTasksThisLevelRef.current.clear(); // Clear used tasks for the new level
    setShowRobi(level === MAX_LEVELS); // Show Robi only on the final level
    loadNewTask(level);
    }, [level, loadNewTask]); // loadNewTask is stable due to useCallback

  // Function to handle player's answer submission
  const handleAnswer = (selectedOption) => {
    if (isCorrect !== null) return; // Prevent multiple submissions

    const correctAnswer = currentTask.answer;
    let correct = false;

    // Check if the answer is correct (handles both Roman and Arabic answers)
    if (typeof correctAnswer === 'number') {
        correct = parseInt(selectedOption, 10) === correctAnswer;
    } else { // Answer is Roman numeral string
        correct = selectedOption.toUpperCase() === correctAnswer.toUpperCase();
    }


    setIsCorrect(correct);

    if (correct) {
      setFeedback('Correct!'); // TODO: Use i18n
      setTreasures(prev => prev + 1);
      playSound('correct', soundEnabled);
      setTaskProgress(prev => prev + 1);

      // Check for level completion
      const levelGoal = LEVEL_CONFIG[level]?.taskCount || 10; // Get task count from config
      if (taskProgress + 1 >= levelGoal) {
        setGamePhase('level_complete');
        setShowLevelComplete(true); // Trigger the TreasureReward modal
        playSound('complete', soundEnabled);
      } else {
        // Load next task after a short delay
        setTimeout(() => loadNewTask(level), 1000);
      }
    } else {
      setFeedback('Try Again!'); // TODO: Use i18n
      playSound('incorrect', soundEnabled);
      // Optionally provide Robi's hint on incorrect answer in Level 5
      if (level === MAX_LEVELS && showRobi) {
        // Basic hint logic (can be expanded)
        setRobiHint(`Beep! Remember ${toRoman(currentTask.answer)}?`); // Example hint
      }
      // Reset after a delay to allow trying again or show correct answer?
      // For now, just shows feedback. Player needs to trigger next step?
      // Or automatically load next task after delay? Let's load next task for now.
       setTimeout(() => {
           setIsCorrect(null); // Allow retry or move on
           setFeedback('');
           // Maybe load the *same* task again for another try? Or move to next?
           // Let's move to the next task to keep the game flowing.
           loadNewTask(level);
       }, 1500);
    }
  };

  // Function to proceed to the next level
  const nextLevel = () => {
    setShowLevelComplete(false); // Hide the modal
    if (level < MAX_LEVELS) {
      setLevel(prev => prev + 1);
      // State updates (task progress, phase) handled by useEffect [level]
    } else {
      setGamePhase('game_over');
      // Handle game completion logic (e.g., show final score screen)
      console.log("Game Over! Final Treasures:", treasures);
    }
  };

  // Function to restart the game
  const restartGame = () => {
    setLevel(INITIAL_LEVEL);
    setTreasures(0);
    setShowLevelComplete(false);
    // Other states reset by useEffect [level]
  };

  return {
    level,
    treasures,
    currentTask,
    taskProgress,
    levelGoal: LEVEL_CONFIG[level]?.taskCount || 10,
    feedback,
    isCorrect,
    showRobi,
    robiHint,
    gamePhase,
    showLevelComplete,
    handleAnswer,
    nextLevel,
    restartGame,
  };
};
