import React from 'react';
import { numberToRomanianWord } from '../../utils/numberUtils';
import '../../styles/CompareDisplay.css';

/**
 * Component to display the numbers to be compared
 * 
 * @param {Object} props
 * @param {Array} props.numbers - Array of two numbers to compare
 * @param {number} props.level - Current game level
 * @param {Object} props.difficultyLevel - Current difficulty level settings
 */
const CompareDisplay = ({ numbers, level, difficultyLevel }) => {
  // Format numbers as strings with leading zeros based on difficulty
  const formatNumber = (num) => {
    if (num === null) return '';
    return num.toString();
  };

  // Get Romanian word representation of the numbers
  const getNumberWord = (num) => {
    if (num === null) return '';
    return numberToRomanianWord(num);
  };

  return (
    <div className="compare-display">
      <div className="level-indicator">
        <span>Nivel: {level}</span>
        <span>{difficultyLevel.name}</span>
      </div>
      
      <div className="character-speech-bubble robi">
        <div className="character-icon">
          <img src="/assets/images/robi.png" alt="Robi" className="character-avatar" />
        </div>
        <div className="speech-content">
          <p>Hai să comparăm {numbers[0]} și {numbers[1]}!</p>
        </div>
      </div>
      
      <div className="numbers-container">
        <div className="number-box">
          <div className="number-value">{formatNumber(numbers[0])}</div>
          <div className="number-word">{getNumberWord(numbers[0])}</div>
        </div>
        
        <div className="question-mark">
          <span>?</span>
        </div>
        
        <div className="number-box">
          <div className="number-value">{formatNumber(numbers[1])}</div>
          <div className="number-word">{getNumberWord(numbers[1])}</div>
        </div>
      </div>
      
      <div className="character-speech-bubble ana">
        <div className="character-icon">
          <img src="/assets/images/ana.png" alt="Ana" className="character-avatar" />
        </div>
        <div className="speech-content">
          <p>Pune mărgelele pe abacuri și apoi compară numerele!</p>
        </div>
      </div>
    </div>
  );
};

export default CompareDisplay;
