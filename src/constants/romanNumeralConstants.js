/**
 * Defines constants related to Roman numerals for the game.
 */

// Mapping of Roman numerals to their Arabic values.
// IMPORTANT: Keys must be sorted from highest value to lowest for the toRoman conversion algorithm.
// Includes subtractive pairs (CM, CD, XC, XL, IX, IV).
export const ROMAN_NUMERAL_MAP = {
  M: 1000, // Although the game goes to 100, including M might be useful for future expansion or stricter validation.
  CM: 900,
  D: 500,
  CD: 400,
  C: 100,
  XC: 90,
  L: 50,
  XL: 40,
  X: 10,
  IX: 9,
  V: 5,
  IV: 4,
  I: 1,
};

// The maximum value the game currently supports for Roman numeral conversion/generation.
export const MAX_ROMAN_VALUE = 100;

// Basic symbols taught in Level 1
export const LEVEL1_SYMBOLS = ['I', 'V', 'X', 'L', 'C']; // Include L and C as they are needed up to 100

// Additive pairs commonly used
export const ADDITIVE_EXAMPLES = {
  6: 'VI',
  7: 'VII',
  8: 'VIII',
  11: 'XI',
  12: 'XII',
  13: 'XIII',
  15: 'XV',
  16: 'XVI',
  17: 'XVII',
  18: 'XVIII',
  20: 'XX',
  30: 'XXX',
  60: 'LX',
  70: 'LXX',
  80: 'LXXX',
};

// Subtractive pairs taught
export const SUBTRACTIVE_EXAMPLES = {
  4: 'IV',
  9: 'IX',
  40: 'XL',
  90: 'XC',
};

// Define number ranges or specific numbers for each level
export const LEVEL_CONFIG = {
  1: { // Recognize Basic Symbols
    type: 'match_symbol',
    symbols: ['I', 'V', 'X', 'L', 'C'], // Focus on these
    range: [1, 100], // Ensure the values match the symbols
    taskCount: 5,
  },
  2: { // Adding Symbols
    type: 'build_add',
    range: [2, 39], // Numbers formed by simple addition (avoiding subtractive for now) e.g., II, III, VI, VII, VIII, XI-XIII, XV-XVIII, XXI-XXIII, etc.
    exclude: [4, 9, 14, 19, 24, 29, 34, 39], // Exclude numbers requiring subtraction
    taskCount: 8,
  },
  3: { // Subtracting Symbols
    type: 'build_subtract', // Or read_subtract
    numbers: [4, 9, 40, 90], // Focus on these specific subtractive forms
    range: [1, 100], // Allow reading/writing numbers that *use* these forms
    taskCount: 8,
  },
  4: { // Mixed Reading and Writing
    type: 'mixed',
    range: [1, 50], // Increase complexity gradually
    taskCount: 10,
  },
  5: { // Challenge Chamber with Robi
    type: 'challenge',
    range: [1, 100], // Full range
    taskCount: 12, // More tasks for the final level
  },
};
