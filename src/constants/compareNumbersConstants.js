// Romanian terms for place values
export const PLACE_VALUES = {
  THOUSANDS: 'M', // Mii
  HUNDREDS: 'S',  // Sute
  TENS: 'Z',      // Zeci
  UNITS: 'U'      // Unități
};

// Romanian terms for comparison operators
export const COMPARISON_OPERATORS = {
  LESS_THAN: {
    symbol: '<',
    text: 'mai mic decât'
  },
  GREATER_THAN: {
    symbol: '>',
    text: 'mai mare decât'
  },
  EQUAL_TO: {
    symbol: '=',
    text: 'egal cu'
  }
};

// Difficulty levels
export const DIFFICULTY_LEVELS = {
  LEVEL_1: {
    name: 'Nivel 1',
    range: { min: 0, max: 99 },
    usedPlaceValues: [PLACE_VALUES.TENS, PLACE_VALUES.UNITS]
  },
  LEVEL_2: {
    name: 'Nivel 2',
    range: { min: 100, max: 999 },
    usedPlaceValues: [PLACE_VALUES.HUNDREDS, PLACE_VALUES.TENS, PLACE_VALUES.UNITS]
  },
  LEVEL_3: {
    name: 'Nivel 3',
    range: { min: 1000, max: 10000 },
    usedPlaceValues: [PLACE_VALUES.THOUSANDS, PLACE_VALUES.HUNDREDS, PLACE_VALUES.TENS, PLACE_VALUES.UNITS]
  }
};

// Color mapping for abacus beads by place value
export const BEAD_COLORS = {
  [PLACE_VALUES.THOUSANDS]: 'blue',
  [PLACE_VALUES.HUNDREDS]: 'red',
  [PLACE_VALUES.TENS]: 'green',
  [PLACE_VALUES.UNITS]: 'purple'
};

// Romanian feedback messages
export const FEEDBACK_MESSAGES = {
  CORRECT: {
    text: 'Comparare excelentă!',
    character: 'Robi'
  },
  INCORRECT: {
    text: 'Hai să verificăm din nou!',
    character: 'Ana'
  },
  HINT: 'Verifică coloana {column} pentru {number}—ar trebui să aibă {count} mărgele!'
};
