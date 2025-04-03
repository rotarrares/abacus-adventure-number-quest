import { ROMAN_NUMERAL_MAP, MAX_ROMAN_VALUE, LEVEL_CONFIG } from '../constants/romanNumeralConstants';
import { getRandomInt, shuffleArray } from './numberUtils'; // Assuming these helpers exist or will be added

/**
 * Converts an Arabic number to its Roman numeral representation.
 * Handles numbers up to the MAX_ROMAN_VALUE defined in constants.
 * @param {number} num The Arabic number to convert.
 * @returns {string} The Roman numeral string, or an empty string for invalid input.
 */
export const toRoman = (num) => {
  if (typeof num !== 'number' || num <= 0 || num > MAX_ROMAN_VALUE || !Number.isInteger(num)) {
    console.error(`Invalid input for toRoman: ${num}. Must be an integer between 1 and ${MAX_ROMAN_VALUE}.`);
    return '';
  }

  let roman = '';
  const romanKeys = Object.keys(ROMAN_NUMERAL_MAP); // Keys are sorted descending by value in constants

  for (let i = 0; i < romanKeys.length; i++) {
    const numeral = romanKeys[i];
    const value = ROMAN_NUMERAL_MAP[numeral];
    while (num >= value) {
      roman += numeral;
      num -= value;
    }
  }
  return roman;
};

/**
 * Converts a Roman numeral string to its Arabic number value.
 * Validates basic Roman numeral rules.
 * @param {string} roman The Roman numeral string to convert.
 * @returns {number} The Arabic number, or 0 for invalid input.
 */
export const fromRoman = (roman) => {
  if (typeof roman !== 'string' || roman.length === 0) {
    console.error('Invalid input for fromRoman: Input must be a non-empty string.');
    return 0;
  }

  roman = roman.toUpperCase();
  let result = 0;
  let prevValue = 0;

  for (let i = roman.length - 1; i >= 0; i--) {
    const currentSymbol = roman[i];
    const currentValue = ROMAN_NUMERAL_MAP[currentSymbol];

    if (!currentValue) {
      console.error(`Invalid Roman numeral character: ${currentSymbol}`);
      return 0; // Invalid character
    }

    if (currentValue < prevValue) {
      result -= currentValue;
    } else {
      result += currentValue;
    }
    prevValue = currentValue;
  }

  // Basic validation: Check if converting back matches the original string
  // This catches some invalid formats like IIII or VV, but not all edge cases.
  // More robust validation could be added if needed.
  if (toRoman(result) !== roman) {
     console.warn(`Potentially invalid Roman numeral format: ${roman}. Result: ${result}`);
     // Allow potentially invalid formats for learning purposes, but log a warning.
     // Strict validation might reject intermediate steps in the learning process.
  }


  if (result <= 0 || result > MAX_ROMAN_VALUE) {
      console.error(`Converted value out of range (1-${MAX_ROMAN_VALUE}): ${result}`);
      return 0; // Result is outside the expected range
  }


  return result;
};


/**
 * Generates a task object for a specific level of the Roman numeral game.
 * Generates a task object for a specific level of the Roman numeral game.
 *
 * @param {number} level The current game level (1-5).
 * @param {object} difficultySettings (Optional) Difficulty settings that might influence number ranges.
 * @returns {object|null} A task object (e.g., { type: 'read', question: 'XIV', answer: 14, options: [12, 14, 16] }) or null if generation fails.
 */
export const generateTask = (level, difficultySettings = {}) => {
  const config = LEVEL_CONFIG[level];
  if (!config) {
    console.error(`Invalid level provided to generateTask: ${level}`);
    return null;
  }

  let task = null;
  let attempts = 0;
  const maxAttempts = 10; // Prevent infinite loops

  // Loop to ensure we generate a valid task, especially for levels with exclusions
  while (!task && attempts < maxAttempts) {
    attempts++;
    try {
      switch (level) {
        case 1: // Recognize Basic Symbols (I, V, X, L, C)
          task = generateLevel1Task(config);
          break;
        case 2: // Adding Symbols (VI, XV)
          task = generateLevel2Task(config);
          break;
        case 3: // Subtracting Symbols (IV, IX, XL, XC)
          task = generateLevel3Task(config);
          break;
        case 4: // Mixed Reading and Writing (up to 50)
          task = generateLevel4Task(config);
          break;
        case 5: // Challenge Chamber (up to 100)
          task = generateLevel5Task(config);
          break;
        default:
          console.error(`Task generation not implemented for level: ${level}`);
          return null;
      }
    } catch (error) {
      console.error(`Error generating task for level ${level}:`, error);
      task = null; // Ensure loop continues or exits if error occurs
    }
  }

   if (!task) {
     console.error(`Failed to generate task for level ${level} after ${maxAttempts} attempts.`);
     // Fallback to a simple task if generation fails repeatedly
     return { type: 'read', question: 'V', answer: 5, options: [1, 5, 10] };
   }

  return task;
};

// --- Helper functions for task generation per level ---

const generateLevel1Task = (config) => {
  // Task: Match a basic symbol to its value
  const symbol = config.symbols[getRandomInt(0, config.symbols.length - 1)];
  const answer = ROMAN_NUMERAL_MAP[symbol];
  const options = generateNumericOptions(answer, config.symbols.map(s => ROMAN_NUMERAL_MAP[s]), 3);
  return { type: config.type, question: symbol, answer, options: shuffleArray(options) };
};

const generateLevel2Task = (config) => {
  // Task: Build a number using only additive rules (e.g., 7 -> VII)
  let number;
  do {
    number = getRandomInt(config.range[0], config.range[1]);
  } while (config.exclude.includes(number)); // Ensure number doesn't require subtraction

  const answer = toRoman(number);
  const options = generateRomanOptions(answer, number, config.range, 3, false); // Generate additive-style distractors
  return { type: config.type, question: number, answer, options: shuffleArray(options) };
};

const generateLevel3Task = (config) => {
  // Task: Read or write numbers involving subtraction (IV, IX, XL, XC)
  const readWrite = Math.random() < 0.5 ? 'read' : 'write';
  const useSpecificNumbers = config.numbers && config.numbers.length > 0 && Math.random() < 0.7; // 70% chance to use specific numbers
  let number;

  if (useSpecificNumbers) {
       // Focus on specific subtractive numbers first
       number = config.numbers[getRandomInt(0, config.numbers.length - 1)];
  } else {
       // Or generate a number within range that uses subtraction
       let attempts = 0; // Add attempt counter for this loop
       do {
           number = getRandomInt(config.range[0], config.range[1]);
           attempts++;
           // Ensure the generated number actually uses subtractive notation OR is one of the core subtractive numbers
       } while (attempts < 20 && (number === 0 || toRoman(number) === toRomanSimpleAdditive(number)) && ![4, 9, 40, 90].includes(number));
       // Add a fallback if the loop fails to find a suitable number
       if (attempts >= 20 || number === 0 || (toRoman(number) === toRomanSimpleAdditive(number) && ![4, 9, 40, 90].includes(number))) {
           console.warn("Level 3: Failed to find suitable subtractive number in range, falling back to specific list.");
           number = config.numbers[getRandomInt(0, config.numbers.length - 1)]; // Fallback to specific numbers
       }
  }


  const roman = toRoman(number);

  if (readWrite === 'read') {
    // Read Roman numeral -> Arabic number
    const options = generateNumericOptions(number, config.range, 3);
    return { type: 'read_subtract', question: roman, answer: number, options: shuffleArray(options) };
  } else {
    // Write Arabic number -> Roman numeral
    const options = generateRomanOptions(roman, number, config.range, 3, true); // Include subtractive distractors
    return { type: 'write_subtract', question: number, answer: roman, options: shuffleArray(options) };
  }
};

const generateLevel4Task = (config) => {
  // Task: Mixed reading/writing up to 50
  const readWrite = Math.random() < 0.5 ? 'read' : 'write';
  const number = getRandomInt(config.range[0], config.range[1]);
  const roman = toRoman(number);

  if (readWrite === 'read') {
    const options = generateNumericOptions(number, config.range, 3);
    return { type: 'read_mixed', question: roman, answer: number, options: shuffleArray(options) };
  } else {
    const options = generateRomanOptions(roman, number, config.range, 3, true);
    return { type: 'write_mixed', question: number, answer: roman, options: shuffleArray(options) };
  }
};

const generateLevel5Task = (config) => {
  // Task: Mixed reading/writing up to 100 (Challenge)
  const readWrite = Math.random() < 0.5 ? 'read' : 'write';
  const number = getRandomInt(config.range[0], config.range[1]);
  const roman = toRoman(number);

  if (readWrite === 'read') {
    const options = generateNumericOptions(number, config.range, 3);
    return { type: 'read_challenge', question: roman, answer: number, options: shuffleArray(options) };
  } else {
    const options = generateRomanOptions(roman, number, config.range, 3, true);
    return { type: 'write_challenge', question: number, answer: roman, options: shuffleArray(options) };
  }
};


// --- Option Generation Helpers ---

/**
 * Generates multiple-choice options (Arabic numbers) for a given answer.
 * @param {number} correctAnswer The correct Arabic number.
 * @param {number[] | number} rangeOrValues Array of possible values or a [min, max] range.
 * @param {number} count Total number of options needed (including correct one).
 * @returns {number[]} Array of options.
 */
const generateNumericOptions = (correctAnswer, rangeOrValues, count) => {
  const options = new Set([correctAnswer]);
  const [min, max] = Array.isArray(rangeOrValues) && rangeOrValues.length === 2 ? rangeOrValues : [1, MAX_ROMAN_VALUE];
  const possibleValues = Array.isArray(rangeOrValues) && rangeOrValues.length > 2 ? rangeOrValues.filter(v => v !== correctAnswer) : null;


  while (options.size < count) {
    let potentialOption;
    if (possibleValues) {
        potentialOption = possibleValues[getRandomInt(0, possibleValues.length - 1)];
    } else {
        // Generate distractors near the correct answer
        const offset = getRandomInt(1, 5) * (Math.random() < 0.5 ? -1 : 1);
        potentialOption = Math.max(min, Math.min(max, correctAnswer + offset));
    }


    if (potentialOption > 0 && potentialOption <= MAX_ROMAN_VALUE && !options.has(potentialOption)) {
      options.add(potentialOption);
    }
    // Add a fallback for safety if generation gets stuck
    if (options.size < count && !possibleValues && options.size > count / 2) {
        potentialOption = getRandomInt(min, max);
         if (potentialOption > 0 && potentialOption <= MAX_ROMAN_VALUE && !options.has(potentialOption)) {
             options.add(potentialOption);
         }
    }
  }
  return Array.from(options);
};

/**
 * Generates multiple-choice options (Roman numerals) for a given answer.
 * @param {string} correctAnswer The correct Roman numeral string.
 * @param {number} correctValue The corresponding Arabic value.
 * @param {number[]} range The [min, max] range for generating distractors.
 * @param {number} count Total number of options needed.
 * @param {boolean} allowSubtractiveDistractors Whether to generate distractors using subtractive rules.
 * @returns {string[]} Array of Roman numeral options.
 */
const generateRomanOptions = (correctAnswer, correctValue, range, count, allowSubtractiveDistractors) => {
  const options = new Set([correctAnswer]);
  const [min, max] = range;

  while (options.size < count) {
    // Generate a distractor number near the correct value
    const offset = getRandomInt(1, 10) * (Math.random() < 0.5 ? -1 : 1);
    let distractorValue = Math.max(min, Math.min(max, correctValue + offset));

    // Ensure distractor is different from correct value and within range
    if (distractorValue === correctValue || distractorValue <= 0 || distractorValue > MAX_ROMAN_VALUE) {
      distractorValue = getRandomInt(min, max); // Pick a random one if offset fails
      if (distractorValue === correctValue) continue; // Skip if still the same
    }


    let potentialOption = toRoman(distractorValue);

    // Sometimes generate an "incorrectly formed" distractor for subtractive levels
    if (allowSubtractiveDistractors && Math.random() < 0.2) {
        potentialOption = generateIncorrectRoman(distractorValue);
    }


    if (potentialOption && potentialOption !== correctAnswer && !options.has(potentialOption)) {
      options.add(potentialOption);
    }
  }
  return Array.from(options);
};

/**
 * Generates a deliberately incorrect Roman numeral string (e.g., IIII instead of IV).
 * Basic implementation, can be expanded.
 * @param {number} value The Arabic value.
 * @returns {string} An incorrectly formed Roman numeral string.
 */
 const generateIncorrectRoman = (value) => {
    if (value === 4) return 'IIII';
    if (value === 9) return 'VIIII';
    if (value === 40) return 'XXXX';
    if (value === 90) return 'LXXXX';
    // Simple additive version as a fallback incorrect form
    let roman = '';
    const simpleMap = { L: 50, X: 10, V: 5, I: 1 }; // Simplified map for basic incorrect forms
    for (const numeral in simpleMap) {
        const numValue = simpleMap[numeral];
        while (value >= numValue) {
            roman += numeral;
            value -= numValue;
        }
    }
    return roman || toRoman(value); // Fallback to correct if generation fails
};
// Helper to generate a purely additive Roman numeral for comparison
const toRomanSimpleAdditive = (num) => {
    if (typeof num !== 'number' || num <= 0 || num > MAX_ROMAN_VALUE || !Number.isInteger(num)) {
        return '';
    }
    let roman = '';
    const simpleMap = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 }; // No subtractive pairs
    for (const numeral in simpleMap) {
        const value = simpleMap[numeral];
        while (num >= value) {
            roman += numeral;
            num -= value;
        }
    }
    return roman;
};
