// Romanian number words
const units = ['', 'unu', 'doi', 'trei', 'patru', 'cinci', 'șase', 'șapte', 'opt', 'nouă'];
const teens = ['zece', 'unsprezece', 'doisprezece', 'treisprezece', 'paisprezece', 'cincisprezece', 'șaisprezece', 'șaptesprezece', 'optsprezece', 'nouăsprezece'];
const tens = ['', 'zece', 'douăzeci', 'treizeci', 'patruzeci', 'cincizeci', 'șaizeci', 'șaptezeci', 'optzeci', 'nouăzeci'];

/**
 * Convert a number to its Romanian text representation
 * @param {number} num - Number to convert (0-10000)
 * @returns {string} Romanian text representation
 */
export const numberToRomanianWord = (num) => {
  if (num === 0) return 'zero';
  
  if (num < 10) {
    return units[num];
  }
  
  if (num < 20) {
    return teens[num - 10];
  }
  
  if (num < 100) {
    const ten = Math.floor(num / 10);
    const unit = num % 10;
    return unit === 0 ? tens[ten] : `${tens[ten]} și ${units[unit]}`;
  }
  
  if (num < 1000) {
    const hundred = Math.floor(num / 100);
    const rest = num % 100;
    
    let result;
    if (hundred === 1) {
      result = 'o sută';
    } else if (hundred === 2) {
      result = 'două sute';
    } else {
      result = `${units[hundred]} sute`;
    }
    
    if (rest > 0) {
      result += ` ${numberToRomanianWord(rest)}`;
    }
    
    return result;
  }
  
  if (num < 10000) {
    const thousand = Math.floor(num / 1000);
    const rest = num % 1000;
    
    let result;
    if (thousand === 1) {
      result = 'o mie';
    } else if (thousand === 2) {
      result = 'două mii';
    } else {
      result = `${units[thousand]} mii`;
    }
    
    if (rest > 0) {
      result += ` ${numberToRomanianWord(rest)}`;
    }
    
    return result;
  }
  
  return 'număr prea mare'; // Number too large
};

/**
 * Convert a number to its place value representation
 * @param {number} num - Number to convert
 * @returns {Object} Place values object (thousands, hundreds, tens, units)
 */
export const numberToPlaceValues = (num) => {
  return {
    thousands: Math.floor(num / 1000) % 10,
    hundreds: Math.floor(num / 100) % 10,
    tens: Math.floor(num / 10) % 10,
    units: num % 10
  };
};

/**
 * Convert place values to a number
 * @param {Object} placeValues - Place values object
 * @returns {number} The number
 */
export const placeValuesToNumber = (placeValues) => {
  return (
    placeValues.thousands * 1000 +
    placeValues.hundreds * 100 +
    placeValues.tens * 10 +
    placeValues.units
  );
};

/**
 * Generate a random number in the given range
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @returns {number} Random number
 */
export const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};