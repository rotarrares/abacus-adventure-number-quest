/**
 * Calculate the appropriate difficulty range based on game level
 * @param {number} level - Current game level
 * @returns {Object} - Object with min, max values and difficulty label
 */
export const calculateDifficultyForLevel = (level) => {
  let difficulty;
  
  if (level <= 2) {
    difficulty = { 
      min: 8, 
      max: 99,
      label: 'Ușor'  // Easy - 2-digit numbers
    }; 
  } else if (level <= 4) {
    difficulty = { 
      min: 100, 
      max: 999,
      label: 'Mediu'  // Medium - 3-digit numbers
    }; 
  } else {
    difficulty = { 
      min: 1000, 
      max: 9999,
      label: 'Greu'  // Hard - 4-digit numbers
    }; 
  }
  
  return difficulty;
};