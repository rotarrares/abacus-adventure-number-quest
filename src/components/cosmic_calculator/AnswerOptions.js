import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/cosmic_calculator/AnswerOptions.css';

/**
 * Displays the multiple-choice answer options for the player to select.
 */
const AnswerOptions = ({ options, onSelect, disabled, feedback }) => {
  return (
    <div className="answer-options-container">
      {options.map((option) => {
        // Determine button state based on feedback (if available)
        let buttonClass = 'option-button';
        let isSelectedIncorrect = false;
        if (feedback) {
          if (option === feedback.selectedOption && !feedback.isCorrect) {
            buttonClass += ' incorrect';
            isSelectedIncorrect = true;
          }
          if (option === feedback.correctAnswer && feedback.isCorrect === false) {
             // Highlight correct answer if player was wrong (optional)
             // buttonClass += ' correct-highlight';
          }
        }

        return (
          <button
            key={option}
            className={buttonClass}
            onClick={() => !disabled && onSelect(option)}
            disabled={disabled || isSelectedIncorrect} // Disable all if feedback shown, or just the wrong selected one
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};

AnswerOptions.propTypes = {
  /** Array of possible answers (numbers) */
  options: PropTypes.arrayOf(PropTypes.number).isRequired,
  /** Function to call when an option is selected, passing the option value */
  onSelect: PropTypes.func.isRequired,
  /** Whether the options should be disabled (e.g., after answering) */
  disabled: PropTypes.bool,
  /** Feedback object to style buttons after selection (optional) */
  feedback: PropTypes.shape({
      isCorrect: PropTypes.bool,
      selectedOption: PropTypes.number,
      correctAnswer: PropTypes.number, // Need correctAnswer here if highlighting correct on wrong
  }),
};

AnswerOptions.defaultProps = {
  disabled: false,
  feedback: null,
};

export default AnswerOptions;