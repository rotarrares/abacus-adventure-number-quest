// Romanian terms for place values (matched to match existing abacus implementation)
export const PLACE_VALUES = {
  THOUSANDS: 'thousands', // Mii
  HUNDREDS: 'hundreds',   // Sute
  TENS: 'tens',           // Zeci
  UNITS: 'units'          // Unități
};

// Display labels for place values - These are now handled by getPlaceValueLabel(placeValue, t) using translation keys
export const PLACE_VALUE_LABELS = {
  [PLACE_VALUES.THOUSANDS]: 'M', // Fallback/Internal ID
  [PLACE_VALUES.HUNDREDS]: 'S', // Fallback/Internal ID
  [PLACE_VALUES.TENS]: 'Z', // Fallback/Internal ID
  [PLACE_VALUES.UNITS]: 'U'  // Fallback/Internal ID
};

// Comparison operators - Symbols are universal, text is handled via translation keys in components
export const COMPARISON_OPERATORS = {
  LESS_THAN: {
    symbol: '<',
    translationKey: 'operator_less_than' 
  },
  GREATER_THAN: {
    symbol: '>',
    translationKey: 'operator_greater_than'
  },
  EQUAL_TO: {
    symbol: '=',
    translationKey: 'operator_equal_to'
  }
};

// Difficulty levels - Names are now handled via translation keys
export const DIFFICULTY_LEVELS = {
  LEVEL_1: {
    nameKey: 'difficulty_level_1', // Use translation key
    range: { min: 0, max: 99 },
    usedPlaceValues: [PLACE_VALUES.TENS, PLACE_VALUES.UNITS]
  },
  LEVEL_2: {
    nameKey: 'difficulty_level_2', // Use translation key
    range: { min: 100, max: 999 },
    usedPlaceValues: [PLACE_VALUES.HUNDREDS, PLACE_VALUES.TENS, PLACE_VALUES.UNITS]
  },
  LEVEL_3: {
    nameKey: 'difficulty_level_3', // Use translation key
    range: { min: 1000, max: 10000 }, // Note: Max was 10000, likely intended 9999? Keeping 10000 for now.
    usedPlaceValues: [PLACE_VALUES.THOUSANDS, PLACE_VALUES.HUNDREDS, PLACE_VALUES.TENS, PLACE_VALUES.UNITS]
  }
};

// Color mapping for abacus beads by place value
export const BEAD_COLORS = {
  [PLACE_VALUES.THOUSANDS]: '#3498db', // Blue
  [PLACE_VALUES.HUNDREDS]: '#e74c3c',  // Red
  [PLACE_VALUES.TENS]: '#2ecc71',      // Green
  [PLACE_VALUES.UNITS]: '#9b59b6'      // Purple
};

// Feedback messages - Text is now handled via translation keys
export const FEEDBACK_MESSAGES = {
  CORRECT: {
    translationKey: 'compare_feedback_correct_specific', // Use translation key
    character: 'Robi' // Character name might need translation if displayed
  },
  INCORRECT: {
    translationKey: 'compare_feedback_incorrect_specific', // Use translation key
    character: 'Ana' // Character name might need translation if displayed
  },
  HINT_KEY: 'compare_hint_message' // Key for the hint message format
};
