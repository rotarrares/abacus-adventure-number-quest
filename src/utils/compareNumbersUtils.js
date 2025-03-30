import { PLACE_VALUES, PLACE_VALUE_LABELS, COMPARISON_OPERATORS } from '../constants/compareNumbersConstants';

/**
 * Generates two random numbers within a specified range
 * @param {Object} range - Object with min and max numbers
 * @param {boolean} ensureDifferent - Make sure the numbers are different
 * @returns {Array} Array of two random numbers
 */
export const generateRandomNumbers = (range, ensureDifferent = true) => {
  const { min, max } = range;
  const number1 = Math.floor(Math.random() * (max - min + 1)) + min;
  
  let number2;
  if (ensureDifferent) {
    do {
      number2 = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (number2 === number1);
  } else {
    number2 = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  return [number1, number2];
};

/**
 * Converts a number to its place value digits
 * @param {number} number - The number to convert
 * @returns {Object} Object with place value keys and their corresponding digits
 */
export const numberToPlaceValues = (number) => {
  const numStr = number.toString().padStart(4, '0');
  return {
    [PLACE_VALUES.THOUSANDS]: parseInt(numStr[0]),
    [PLACE_VALUES.HUNDREDS]: parseInt(numStr[1]),
    [PLACE_VALUES.TENS]: parseInt(numStr[2]),
    [PLACE_VALUES.UNITS]: parseInt(numStr[3])
  };
};

/**
 * Compares two numbers and returns the appropriate comparison operator
 * @param {number} num1 - First number to compare
 * @param {number} num2 - Second number to compare
 * @returns {Object} The comparison operator object
 */
export const compareNumbers = (num1, num2) => {
  if (num1 < num2) {
    return COMPARISON_OPERATORS.LESS_THAN;
  } else if (num1 > num2) {
    return COMPARISON_OPERATORS.GREATER_THAN;
  } else {
    return COMPARISON_OPERATORS.EQUAL_TO;
  }
};

/**
 * Finds the highest place value where the numbers differ
 * @param {Object} placeValues1 - Place values for first number
 * @param {Object} placeValues2 - Place values for second number
 * @param {Array} usedPlaceValues - Array of place values in use for the current difficulty
 * @returns {string|null} The place value key where numbers differ, or null if they are equal
 */
export const findDifferingPlaceValue = (placeValues1, placeValues2, usedPlaceValues) => {
  // Check place values from highest to lowest
  for (const place of usedPlaceValues) {
    if (placeValues1[place] !== placeValues2[place]) {
      return place;
    }
  }
  return null; // Numbers are equal in all checked place values
};

/**
 * Maps a place value key to its translated name using the provided t function
 * @param {string} placeValue - The place value key
 * @param {Function} t - The translation function from i18next
 * @returns {string} Translated name for the place value
 */
export const getPlaceValueName = (placeValue, t) => {
  if (!t) {
    console.error("Translation function 't' not provided to getPlaceValueName");
    // Fallback to non-translated keys or default names if needed
    return placeValue; 
  }
  switch (placeValue) {
    case PLACE_VALUES.THOUSANDS:
      return t('place_value_thousands');
    case PLACE_VALUES.HUNDREDS:
      return t('place_value_hundreds');
    case PLACE_VALUES.TENS:
      return t('place_value_tens');
    case PLACE_VALUES.UNITS:
      return t('place_value_units');
    default:
      return '';
  }
};

/**
 * Gets the translated display label for a place value using the provided t function
 * @param {string} placeValue - The place value key
 * @param {Function} t - The translation function from i18next
 * @returns {string} The translated display label
 */
export const getPlaceValueLabel = (placeValue, t) => {
  if (!t) {
    console.error("Translation function 't' not provided to getPlaceValueLabel");
    // Fallback to non-translated keys or default labels if needed
    return PLACE_VALUE_LABELS[placeValue] || ''; // Keep original labels as fallback
  }
  switch (placeValue) {
    case PLACE_VALUES.THOUSANDS:
      return t('place_value_label_thousands');
    case PLACE_VALUES.HUNDREDS:
      return t('place_value_label_hundreds');
    case PLACE_VALUES.TENS:
      return t('place_value_label_tens');
    case PLACE_VALUES.UNITS:
      return t('place_value_label_units');
    default:
      return '';
  }
};
