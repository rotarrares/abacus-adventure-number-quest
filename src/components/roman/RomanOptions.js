import React from 'react';
import '../../styles/roman/RomanOptions.css'; // Styles to be created later

/**
 * Component to display multiple-choice options (buttons) for the Roman numeral puzzle.
 * @param {Object} props - Component props
 * @param {Array<string|number>} props.options - An array of possible answers (can be Roman numerals or Arabic numbers).
 * @param {Function} props.onSelect - Function to call when an option button is clicked, passing the selected option.
 * @param {boolean} props.disabled - Whether the option buttons should be disabled (e.g., after an answer is submitted).
 */
const RomanOptions = ({ options, onSelect, disabled }) => {
  if (!options || options.length === 0) {
    return null; // Don't render if there are no options
  }

  return (
    <div className="roman-options-container">
      {options.map((option) => (
        <button
          key={option} // Use option as key, assuming options are unique per task
          className="roman-option-button"
          onClick={() => onSelect(option)}
          disabled={disabled}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default RomanOptions;
