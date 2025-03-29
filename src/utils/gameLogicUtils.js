/**
 * Calculate score based on attempts
 * @param {number} attempts - Number of attempts made
 * @returns {number} - Score to add
 */
export const calculateScore = (attempts) => {
  return Math.max(10 - (attempts * 2), 1);
};

/**
 * Check if a star should be awarded
 * @param {number} currentScore - Current total score
 * @param {number} scoreToAdd - Score being added
 * @returns {boolean} - Whether a star should be awarded
 */
export const shouldAwardStar = (currentScore, scoreToAdd) => {
  return currentScore % 30 < scoreToAdd;
};

/**
 * Check if level should increase
 * @param {number} correctAnswers - Number of correct answers
 * @param {number} requiredForLevelUp - Number of correct answers required for level up
 * @returns {boolean} - Whether level should increase
 */
export const shouldLevelUp = (correctAnswers, requiredForLevelUp = 5) => {
  return correctAnswers >= requiredForLevelUp;
};