import React from 'react';
import '../../styles/rounding/RoundingOptions.css';

// Helper function to format numbers with commas
const formatNumber = (num) => {
  // Ensure num is treated as a number before converting to string
  return Number(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const RoundingOptions = ({ options, onSelect, feedback }) => {
  console.log("RoundingOptions rendering with options:", options); // Placeholder

  // Determine feedback class for buttons
  const getFeedbackClass = (option) => {
    if (!feedback || feedback.selectedOption !== option) {
      return '';
    }
    return feedback.type === 'correct' ? 'feedback-correct' : 'feedback-incorrect';
  };

  return (
    <div className="rounding-options-container">
      {options && options.map((option, index) => (
        <button
          key={index}
          className={`option-button ${getFeedbackClass(option)}`}
          onClick={() => onSelect(option)}
          // Disable buttons after feedback is shown for the current round?
          // disabled={!!feedback}
        >
          {formatNumber(option)}
        </button>
      ))}
      {/* TODO: Add animations for button feedback (lighting up) */}
    </div>
  );
};

export default RoundingOptions;
