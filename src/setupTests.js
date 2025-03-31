// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Polyfill for ResizeObserver
import ResizeObserver from 'resize-observer-polyfill';
global.ResizeObserver = ResizeObserver;

// Mock window.speechSynthesis
global.speechSynthesis = {
  speak: jest.fn(),
  cancel: jest.fn(),
  paused: false,
  pending: false,
  speaking: false,
  onvoiceschanged: null,
  getVoices: jest.fn(() => []),
  pause: jest.fn(),
  resume: jest.fn(),
};
// Mock SpeechSynthesisUtterance
global.SpeechSynthesisUtterance = jest.fn().mockImplementation((text) => {
  return {
    text: text,
    lang: '',
    voice: null,
    volume: 1,
    rate: 1,
    pitch: 1,
    onstart: null,
    onend: null,
    onerror: null,
    onpause: null,
    onresume: null,
    onmark: null,
    onboundary: null,
  };
});


// Mock matchMedia (often needed for responsive components or libraries)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});


// You can add other global setup here if needed

// Mock i18n initialization
jest.mock('./i18n', () => ({
  // Provide a minimal mock object to prevent the original init code from running.
  // If specific i18n instance properties/methods are accessed directly
  // elsewhere (outside useTranslation), mock them here.
  t: (key) => key, // Basic t function mock if needed directly
  changeLanguage: jest.fn(),
  language: 'en',
}));

// Mock react-i18next globally
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, options) => {
      // Simple global mock translation - can be overridden in specific tests if needed
      // Add keys observed in the failing test's DOM output
      const translations = {
        'compare_numbers_mode_title': 'Compare the Numbers Title', // Added
        'compare_display_level': 'Level:', // Added
        'compare_display_robi_alt': 'Robi Character', // Added
        'compare_display_robi_speech': 'Robi says compare!', // Added
        'compare_display_ana_alt': 'Ana Character', // Added
        'compare_display_ana_speech': 'Ana says compare!', // Added
        'compare_instructions_title': 'Instructions Title', // Added
        'compare_instructions_level1_part1': 'Instruction part 1', // Added
        'compare_instructions_level1_part2_left': 'Instruction part 2 left', // Added
        'compare_instructions_level1_part2_right': 'Instruction part 2 right', // Added
        'compare_instructions_level1_part3': 'Instruction part 3', // Added
        'compare_guide_show': 'Show Guide', // Added
        'compare_number_line_label': 'Number Line', // Added
        'feedback.correct': 'Correct!',
        'feedback.incorrect': 'Try again!',
        'number_word_cincisprezece': 'cincisprezece', // Assuming number words might be keys too
        'number_word_zece': 'zece', // Assuming number words might be keys too
        'number_word_sapte': 'șapte', // Assuming number words might be keys too
        // Add other common keys or return the key itself
      };
      let translation = translations[key] || key; // Return key if not found
      // Basic interpolation mock
      if (options && typeof options === 'object') {
        Object.keys(options).forEach(optKey => {
          const regex = new RegExp(`{{${optKey}}}`, 'g');
          translation = translation.replace(regex, options[optKey]);
        });
      }
      return translation;
    },
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      language: 'en', // Default language for tests
      // Add other i18n instance properties/methods if needed by components
      isInitialized: true, // Mock initialization state
      options: {}, // Mock options
      services: {
        interpolator: { // Mock interpolator if needed
          interpolate: (str, data) => {
            let result = str;
            if (data) {
              Object.keys(data).forEach(key => {
                const regex = new RegExp(`{{${key}}}`, 'g');
                result = result.replace(regex, data[key]);
              });
            }
            return result;
          }
        }
      }
    },
  }),
  // Mock other exports if used (e.g., Trans component)
  // Trans: ({ i18nKey }) => i18nKey,
}));
