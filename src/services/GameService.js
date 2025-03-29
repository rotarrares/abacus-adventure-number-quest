import { getRandomNumber, numberToRomanianWord } from '../utils/numberUtils';
import { playSound } from '../utils/audioUtils';

/**
 * Service for handling game logic operations
 */
class GameService {
  /**
   * Generate a random number based on current difficulty level
   * @param {Object} difficulty - Difficulty settings with min and max values
   * @param {boolean} withWord - Whether to include Romanian word representation
   * @returns {Object} Generated number info
   */
  generateNumber(difficulty, withWord = true) {
    const { min, max } = difficulty;
    const number = getRandomNumber(min, max);
    const word = withWord ? numberToRomanianWord(number) : '';
    
    return { number, word };
  }
  
  /**
   * Generate a random abacus configuration
   * @param {Object} difficulty - Difficulty settings with min and max values
   * @returns {Object} Abacus configuration and the corresponding number
   */
  generateRandomAbacus(difficulty) {
    const { number } = this.generateNumber(difficulty, false);
    
    // Calculate place values
    const thousands = Math.floor(number / 1000) % 10;
    const hundreds = Math.floor(number / 100) % 10;
    const tens = Math.floor(number / 10) % 10;
    const units = number % 10;
    
    return {
      abacusState: { thousands, hundreds, tens, units },
      number
    };
  }
  
  /**
   * Check if the abacus state corresponds to the given number
   * @param {Object} abacusState - Current state of the abacus
   * @param {number} targetNumber - Number to check against
   * @returns {boolean} Whether the abacus state matches the number
   */
  checkAbacusMatchesNumber(abacusState, targetNumber) {
    const abacusNumber = 
      abacusState.thousands * 1000 + 
      abacusState.hundreds * 100 + 
      abacusState.tens * 10 + 
      abacusState.units;
    
    return abacusNumber === targetNumber;
  }
  
  /**
   * Calculate score based on attempts and other factors
   * @param {number} attempts - Number of attempts made
   * @param {number} level - Current game level
   * @returns {number} Score to add
   */
  calculateScore(attempts, level) {
    // Base score depends on attempts - fewer attempts means higher score
    const baseScore = Math.max(10 - (attempts * 2), 1);
    
    // Bonus for higher levels
    const levelBonus = Math.floor(level / 5);
    
    return baseScore + levelBonus;
  }
  
  /**
   * Check if a new star should be awarded
   * @param {number} currentScore - Current score before adding new points
   * @param {number} scoreToAdd - Score being added
   * @param {number} starThreshold - Points needed for a star (default: 30)
   * @returns {boolean} Whether a new star should be awarded
   */
  shouldAwardStar(currentScore, scoreToAdd, starThreshold = 30) {
    // Award star if crossing a threshold
    const currentThreshold = Math.floor(currentScore / starThreshold);
    const newThreshold = Math.floor((currentScore + scoreToAdd) / starThreshold);
    
    return newThreshold > currentThreshold;
  }
  
  /**
   * Get difficulty settings based on level
   * @param {number} level - Current game level
   * @returns {Object} Difficulty settings with min and max values
   */
  getDifficultyForLevel(level) {
    if (level <= 5) {
      return { min: 8, max: 99 };
    } else if (level <= 10) {
      return { min: 100, max: 999 };
    } else {
      return { min: 1000, max: 10000 };
    }
  }
}

// Create and export a singleton instance
const gameService = new GameService();
export default gameService;