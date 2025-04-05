// Configuration for Robi's Cosmic Calculator Game

// Defines parameters for each level
export const LEVEL_CONFIG = [
  {
    level: 1,
    zoneName: 'Moon Market', // i18n key: cosmic_calculator.zone_moon_market
    numDigits: 1,
    rangeMax: 9,
    problemsPerLevel: 5,
  },
  {
    level: 2,
    zoneName: 'Asteroid Alley', // i18n key: cosmic_calculator.zone_asteroid_alley
    numDigits: 2,
    rangeMax: 99,
    problemsPerLevel: 7,
  },
  {
    level: 3,
    zoneName: 'Star Station', // i18n key: cosmic_calculator.zone_star_station
    numDigits: 3,
    rangeMax: 999,
    problemsPerLevel: 8,
  },
  {
    level: 4,
    zoneName: 'Nebula Nursery', // i18n key: cosmic_calculator.zone_nebula_nursery
    numDigits: 4,
    rangeMax: 9999,
    problemsPerLevel: 10,
  },
  {
    level: 5,
    zoneName: 'Galaxy Gateway', // i18n key: cosmic_calculator.zone_galaxy_gateway
    numDigits: 4, // Still 4 digits, but maybe more complex problems or faster pace
    rangeMax: 9999,
    problemsPerLevel: 10,
  },
];

// Initial state for ship upgrades (example)
export const INITIAL_SHIP_UPGRADES = {
  wings: 'basic', // e.g., 'basic', 'level2_wings', 'level4_wings'
  color: 'default', // e.g., 'default', 'red', 'blue'
  booster: null, // e.g., null, 'sparkle_boost'
};

// Keys for character messages (to be defined in translation files)
export const CHARACTER_MESSAGE_KEYS = {
  ROBI_GREETING: 'cosmic_calculator.robi_greeting',
  ROBI_CORRECT: 'cosmic_calculator.robi_correct',
  ROBI_INCORRECT: 'cosmic_calculator.robi_incorrect',
  ROBI_LEVEL_START: 'cosmic_calculator.robi_level_start', // Takes {level} and {zoneName}
  ROBI_HINT: 'cosmic_calculator.robi_hint', // Takes {placeValue} e.g., "tens"

  ANA_GREETING: 'cosmic_calculator.ana_greeting',
  ANA_CORRECT: 'cosmic_calculator.ana_correct',
  ANA_INCORRECT: 'cosmic_calculator.ana_incorrect',
  ANA_LEVEL_START: 'cosmic_calculator.ana_level_start', // Takes {level} and {zoneName}
  ANA_HINT: 'cosmic_calculator.ana_hint', // Takes {placeValue}

  GENERAL_LOADING: 'cosmic_calculator.general_loading',
  GENERAL_GAME_OVER_TITLE: 'cosmic_calculator.general_game_over_title',
  GENERAL_GAME_OVER_MESSAGE: 'cosmic_calculator.general_game_over_message', // Takes {starCoins}
  GENERAL_PLAY_AGAIN: 'cosmic_calculator.general_play_again',
  GENERAL_LEVEL_COMPLETE_TITLE: 'cosmic_calculator.general_level_complete_title', // Takes {level}
  GENERAL_LEVEL_COMPLETE_MESSAGE: 'cosmic_calculator.general_level_complete_message', // Takes {starCoinsEarned}
  GENERAL_CONTINUE: 'cosmic_calculator.general_continue',
};

// Animation timings (in milliseconds)
export const ANIMATION_TIMINGS = {
  DIGIT_FLY: 500,
  DIGIT_MERGE: 300,
  STEP_DELAY: 800, // Delay between place value steps
  FEEDBACK_DELAY: 1500, // How long feedback is shown before next action
};

// Place value names (for hints, etc.) - could also be i18n keys
export const PLACE_VALUE_NAMES = [
  'units',    // Index 0, i18n key: cosmic_calculator.place_units
  'tens',     // Index 1, i18n key: cosmic_calculator.place_tens
  'hundreds', // Index 2, i18n key: cosmic_calculator.place_hundreds
  'thousands' // Index 3, i18n key: cosmic_calculator.place_thousands
];