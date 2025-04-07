import React from 'react';
// Import relevant styles if needed

const AnswerOptions = ({ options, onSelectAnswer, disabled }) => {
  // This component could display multiple-choice answers
  // or potentially an input field for the final sum.

  if (!options || options.length === 0) {
    // Render nothing or an input field if no options provided
    return null; // Or return an input component
  }

  return (
    <div className="answer-options-container">
      {/* Title removed, character message provides the prompt */}
      <div className="options-buttons">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectAnswer(option)}
            disabled={disabled}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AnswerOptions;