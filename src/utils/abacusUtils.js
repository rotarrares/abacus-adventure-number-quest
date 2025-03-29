/**
 * Convert a number to its place values for the abacus
 * @param {number} number - The number to convert
 * @returns {Object} - Object with thousands, hundreds, tens, and units values
 */
export const numberToAbacusPositions = (number) => {
  return {
    thousands: Math.floor(number / 1000) % 10,
    hundreds: Math.floor(number / 100) % 10,
    tens: Math.floor(number / 10) % 10,
    units: number % 10
  };
};

/**
 * Convert abacus positions back to a number
 * @param {Object} abacusState - The abacus state with thousands, hundreds, tens, and units
 * @returns {number} - The number represented by the abacus
 */
export const abacusPositionsToNumber = (abacusState) => {
  const { thousands, hundreds, tens, units } = abacusState;
  return thousands * 1000 + hundreds * 100 + tens * 10 + units;
};