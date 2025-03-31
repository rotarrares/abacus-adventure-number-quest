/**
 * Rounds a number to the nearest ten.
 * @param {number} num The number to round.
 * @returns {number} The number rounded to the nearest ten.
 */
export const roundToNearestTen = (num) => {
  return Math.round(num / 10) * 10;
};

/**
 * Rounds a number to the nearest hundred.
 * @param {number} num The number to round.
 * @returns {number} The number rounded to the nearest hundred.
 */
export const roundToNearestHundred = (num) => {
  return Math.round(num / 100) * 100;
};

/**
 * Rounds a number to the nearest thousand.
 * @param {number} num The number to round.
 * @returns {number} The number rounded to the nearest thousand.
 */
export const roundToNearestThousand = (num) => {
  return Math.round(num / 1000) * 1000;
};

/**
 * Rounds a number to the specified place value.
 * @param {number} num The number to round.
 * @param {'tens' | 'hundreds' | 'thousands'} place The place value to round to.
 * @returns {number} The rounded number.
 */
export const round = (num, place) => {
  switch (place) {
    case 'tens':
      return roundToNearestTen(num);
    case 'hundreds':
      return roundToNearestHundred(num);
    case 'thousands':
      return roundToNearestThousand(num);
    default:
      console.error("Invalid rounding place:", place);
      return num; // Return original number if place is invalid
  }
};

/**
 * Generates plausible incorrect rounding options.
 * @param {number} correctOption The correctly rounded number.
 * @param {number} originalNumber The original number before rounding.
 * @param {'tens' | 'hundreds' | 'thousands'} place The place value rounded to.
 * @returns {number[]} An array containing the correct option and one plausible incorrect option.
 */
export const generateOptions = (correctOption, originalNumber, place) => {
  let incorrectOption;
  const difference = correctOption - originalNumber; // Positive if rounded up, negative if rounded down

  switch (place) {
    case 'tens':
      incorrectOption = correctOption + (difference >= 0 ? -10 : 10);
      // Ensure incorrect option is different and plausible (e.g., not negative)
      if (incorrectOption === correctOption || incorrectOption < 0) {
        incorrectOption = correctOption + (difference >= 0 ? 10 : -10); // Try the other direction
      }
      break;
    case 'hundreds':
      incorrectOption = correctOption + (difference >= 0 ? -100 : 100);
       if (incorrectOption === correctOption || incorrectOption < 0) {
        incorrectOption = correctOption + (difference >= 0 ? 100 : -100);
      }
      break;
    case 'thousands':
      incorrectOption = correctOption + (difference >= 0 ? -1000 : 1000);
       if (incorrectOption === correctOption || incorrectOption < 0) {
        incorrectOption = correctOption + (difference >= 0 ? 1000 : -1000);
      }
      break;
    default:
      incorrectOption = correctOption + 10; // Fallback, should not happen
  }

  // Ensure options are distinct and positive if necessary
  incorrectOption = Math.max(0, incorrectOption); // Prevent negative options if rounding near zero
  if (incorrectOption === correctOption) {
      // If somehow still the same, force a different plausible option
      incorrectOption += (place === 'tens' ? 10 : place === 'hundreds' ? 100 : 1000);
  }


  const options = [correctOption, incorrectOption];
  // Shuffle the options randomly
  return options.sort(() => Math.random() - 0.5);
};


/**
 * Generates a random number within the specified range for a given level.
 * TODO: Define level ranges more formally, perhaps in constants.
 * @param {number} level The current game level.
 * @returns {number} A random number suitable for the level.
 */
export const generateNumberForLevel = (level) => {
  switch (level) {
    case 1: // Place Value Basics (e.g., 3 digits)
      return Math.floor(Math.random() * 900) + 100; // 100-999
    case 2: // Rounding to Tens (e.g., 2 digits)
      return Math.floor(Math.random() * 90) + 10; // 10-99
    case 3: // Rounding to Hundreds (e.g., 3 digits)
      return Math.floor(Math.random() * 900) + 100; // 100-999
    case 4: // Rounding to Thousands (e.g., 4 digits)
      return Math.floor(Math.random() * 9000) + 1000; // 1000-9999
    case 5: // Mixed Rounding (e.g., 2-4 digits)
      const digits = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4 digits
      const min = Math.pow(10, digits - 1);
      const max = Math.pow(10, digits) - 1;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    default:
      return 0;
  }
};

/**
 * Gets the digit at a specific place value.
 * @param {number} num The number.
 * @param {'units' | 'tens' | 'hundreds' | 'thousands'} place The place value name.
 * @returns {number | null} The digit at that place, or null if not applicable.
 */
export const getDigitByPlace = (num, place) => {
    const strNum = String(num);
    const len = strNum.length;
    switch (place) {
        case 'units':
            return len >= 1 ? parseInt(strNum[len - 1], 10) : null;
        case 'tens':
            return len >= 2 ? parseInt(strNum[len - 2], 10) : null;
        case 'hundreds':
            return len >= 3 ? parseInt(strNum[len - 3], 10) : null;
        case 'thousands':
            return len >= 4 ? parseInt(strNum[len - 4], 10) : null;
        default:
            return null;
    }
};

/**
 * Creates the correct answer list of pairs for Level 1 (Place Value).
 * Handles duplicate digits correctly.
 * @param {number} num The number for the level.
 * @returns {Array<[string, string]>} An array of [digitString, placeNameString] pairs.
 *                                     Example for 848: [['8', 'Units'], ['4', 'Tens'], ['8', 'Hundreds']]
 */
export const createPlaceValueMap = (num) => {
    const pairs = [];
    const strNum = String(num);
    const len = strNum.length;
    // Define place names mapping to index from the right (0 = Units)
    const placeNames = ['Units', 'Tens', 'Hundreds', 'Thousands']; // Add more if needed

    for (let i = 0; i < len; i++) {
        const digitIndex = len - 1 - i; // Index from the left
        const placeIndex = i; // Index from the right (0 = Units)
        if (placeIndex < placeNames.length) {
            pairs.push([strNum[digitIndex], placeNames[placeIndex]]);
        }
    }
    // The array inherently handles duplicates, e.g., [['8', 'Units'], ['4', 'Tens'], ['8', 'Hundreds']]
    return pairs;
};
