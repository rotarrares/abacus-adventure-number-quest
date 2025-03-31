// Points awarded per correct answer
export const POINTS_PER_CORRECT_ANSWER = 10;

// Number of correct answers needed to complete a level
export const LEVEL_COMPLETION_GOAL = 5;

// Game level definitions
export const LEVELS = {
  1: {
    id: 1,
    name: 'Place Value Basics',
    instruction: 'Match the digits to their place values!',
    // Number generation handled in utils/hook
  },
  2: {
    id: 2,
    name: 'Rounding to Tens',
    targetPlace: 'tens',
    instruction: (num) => `Round ${num} to the nearest ten!`,
    hint: (num) => `Check the units digit (${num % 10}). Is it 5 or more?`,
  },
  3: {
    id: 3,
    name: 'Rounding to Hundreds',
    targetPlace: 'hundreds',
    instruction: (num) => `Round ${num} to the nearest hundred!`,
    hint: (num) => `Check the tens digit (${Math.floor(num / 10) % 10}). Is it 5 or more?`,
  },
  4: {
    id: 4,
    name: 'Rounding to Thousands',
    targetPlace: 'thousands',
    instruction: (num) => `Round ${num} to the nearest thousand!`,
    hint: (num) => `Check the hundreds digit (${Math.floor(num / 100) % 10}). Is it 5 or more?`,
  },
  5: {
    id: 5,
    name: 'Mixed Rounding',
    // Target place determined randomly in hook/utils
    instruction: (num, place) => `Round ${num} to the nearest ${place}!`,
    hint: (num, place) => {
        if (place === 'tens') return `Check the units digit (${num % 10}).`;
        if (place === 'hundreds') return `Check the tens digit (${Math.floor(num / 10) % 10}).`;
        if (place === 'thousands') return `Check the hundreds digit (${Math.floor(num / 100) % 10}).`;
        return 'Look carefully!';
    },
  },
};

// Feedback messages
export const FEEDBACK_MESSAGES = {
  correct: [
    "Great job!",
    "Excellent!",
    "Well done!",
    "Perfect!",
    "You got it!",
  ],
  incorrect: [
    "Not quite!",
    "Try again!",
    "Almost there!",
    "Think carefully!",
    "Check the rule!",
  ],
};

// Function to get a random feedback message
export const getRandomFeedback = (type) => {
  const messages = FEEDBACK_MESSAGES[type];
  return messages[Math.floor(Math.random() * messages.length)];
};

// Place value names (used in Level 1)
export const PLACE_VALUE_NAMES = {
    units: 'Units',
    tens: 'Tens',
    hundreds: 'Hundreds',
    thousands: 'Thousands',
};

// Audio file paths (assuming they exist in public/assets/audio)
export const AUDIO_PATHS = {
    correct: '/assets/audio/correct.mp3', // Replace with actual 'ding' if different
    incorrect: '/assets/audio/incorrect.mp3', // Replace with actual 'whoops' if different
    levelComplete: '/assets/audio/complete.mp3',
    // Add other sounds if needed (e.g., flower bloom)
};
