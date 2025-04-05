import { LEVEL_CONFIG } from '../constants/cosmicCalculatorConstants';

/**
 * Helper function to get the digit of a number at a specific place value.
 * @param {number} number - The number to extract the digit from.
 * @param {number} place - The place value (0 for units, 1 for tens, etc.).
 * @returns {number} The digit at the specified place.
 */
const getDigit = (number, place) => {
  return Math.floor(number / Math.pow(10, place)) % 10;
};

/**
 * Helper function to shuffle an array (Fisher-Yates algorithm).
 * @param {Array} array - The array to shuffle.
 * @returns {Array} The shuffled array.
 */
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
};

/**
 * Generates plausible incorrect answer options for a given correct answer.
 * @param {number} correctAnswer - The correct sum.
 * @param {number} numDigits - The maximum number of digits for the level.
 * @param {number} count - The number of incorrect options to generate.
 * @returns {number[]} An array of unique incorrect options.
 */
const generateIncorrectOptions = (correctAnswer, numDigits, count = 2) => {
  const incorrectOptions = new Set();
  const maxAttempts = 20; // Prevent infinite loops
  let attempts = 0;

  while (incorrectOptions.size < count && attempts < maxAttempts) {
    attempts++;
    let incorrectOption = correctAnswer;
    const placeToChange = Math.floor(Math.random() * numDigits); // 0 to numDigits-1
    const changeAmount = Math.pow(10, placeToChange);
    const operation = Math.random() < 0.5 ? 1 : -1; // Add or subtract

    // Try changing one digit
    incorrectOption += operation * changeAmount;

    // Basic validation: ensure it's different and non-negative
    if (incorrectOption !== correctAnswer && incorrectOption >= 0) {
      // More advanced check: try to avoid introducing carry/borrow if possible,
      // but for simplicity here, we just check difference and non-negativity.
      incorrectOptions.add(incorrectOption);
    } else {
      // Fallback: just add/subtract 1 or 10 etc. if the digit change failed
      const fallbackChange = Math.pow(10, Math.floor(Math.random() * numDigits));
      incorrectOption = correctAnswer + (Math.random() < 0.5 ? fallbackChange : -fallbackChange);
       if (incorrectOption !== correctAnswer && incorrectOption >= 0) {
           incorrectOptions.add(incorrectOption);
       }
    }
  }

  // If not enough unique options generated, add simple variations
  while (incorrectOptions.size < count) {
      const simpleChange = incorrectOptions.size % 2 === 0 ? 1 : -1; // Alternate +1, -1
      const fallbackOption = correctAnswer + simpleChange * (incorrectOptions.size + 1); // e.g., +2, -3
      if (fallbackOption !== correctAnswer && fallbackOption >= 0) {
          incorrectOptions.add(fallbackOption);
      } else {
          // If even that fails (e.g., correctAnswer is 0), add arbitrary different numbers
          incorrectOptions.add(correctAnswer + 10 + incorrectOptions.size);
      }
  }


  return Array.from(incorrectOptions);
};


/**
 * Generates an addition problem (num1 + num2) suitable for a given level,
 * ensuring that the sum of digits in each place value does not exceed 9.
 * Also generates plausible incorrect answer options.
 *
 * @param {number} level - The current game level (1-5).
 * @returns {object | null} An object representing the problem { id, num1, num2, correctAnswer, options } or null if generation fails.
 */
export const generateNoCarryAdditionProblem = (level) => {
  const config = LEVEL_CONFIG.find(l => l.level === level);
  if (!config) {
    console.error(`No config found for level ${level}`);
    return null;
  }

  const numDigits = config.numDigits;
  const maxValPerDigit = 9; // Max sum for any place value
  let num1 = 0;
  let num2 = 0;
  const maxAttempts = 50; // Safety break
  let attempts = 0;

  // Generate num1 and num2 ensuring no carry-over
  do {
      num1 = 0;
      num2 = 0;
      attempts++;
      let possible = true;

      // Generate num1 first (could be simpler, just random up to max)
      // Let's generate num1 randomly up to the max range for simplicity
      const maxNum1 = Math.pow(10, numDigits) - 1;
      num1 = Math.floor(Math.random() * (maxNum1 + 1));

      // Now generate num2 based on num1
      for (let p = 0; p < numDigits; p++) {
          const digit1 = getDigit(num1, p);
          const maxDigit2 = maxValPerDigit - digit1;

          if (maxDigit2 < 0) {
              // This shouldn't happen if maxValPerDigit is 9, but safety check
              console.error("Error: maxDigit2 is negative. Check logic.");
              possible = false;
              break;
          }

          const digit2 = Math.floor(Math.random() * (maxDigit2 + 1)); // Random digit from 0 to maxDigit2
          num2 += digit2 * Math.pow(10, p);
      }

      if (!possible) continue; // Retry if something went wrong

      // Basic check: ensure numbers are somewhat interesting (e.g., not 0 + 0 unless level 1)
      if (level > 1 && num1 === 0 && num2 === 0) continue;

      // Check if the generated numbers fit the level's intended range/complexity
      // (This logic might need refinement based on specific level goals)
      // For now, we assume the digit-by-digit generation is sufficient.

      break; // Exit loop if successful

  } while (attempts < maxAttempts);

  if (attempts >= maxAttempts) {
      console.error(`Failed to generate a valid problem for level ${level} after ${maxAttempts} attempts.`);
      // Fallback: generate a very simple problem for the level
      if (numDigits === 1) {
          num1 = Math.floor(Math.random() * 5); // 0-4
          num2 = Math.floor(Math.random() * (10 - num1)); // Ensure sum <= 9
      } else {
          // Simple fallback for multi-digit, may not be ideal
          num1 = Math.pow(10, numDigits - 1); // e.g., 10, 100, 1000
          num2 = Math.floor(Math.random() * (Math.pow(10, numDigits - 1))); // Add a smaller number
          // Re-check carry-over for fallback (could be complex, skip for now)
      }
       console.warn("Using fallback problem generation.");
  }


  const correctAnswer = num1 + num2;
  const incorrectOptions = generateIncorrectOptions(correctAnswer, numDigits, 2); // Generate 2 incorrect options
  const options = shuffleArray([correctAnswer, ...incorrectOptions]);

  // Generate a simple unique ID (can be improved if needed)
  const id = `${level}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return {
    id,
    num1,
    num2,
    correctAnswer,
    options,
  };
};