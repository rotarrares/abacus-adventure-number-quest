import React from 'react';
import { useTranslation } from 'react-i18next';
// Removed import of numberToRomanianWord
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
  const { t } = useTranslation(); // Removed unused i18n

  // Format numbers as strings with leading zeros based on difficulty
  const formatNumber = (num) => {
    if (num === null) return '';
    return num.toString();
  };

  // Get localized word representation of the numbers using i18n
  const getNumberWord = (num) => {
    if (num === null || typeof num !== 'number') return '';
    // Use a specific key format for number words
    const key = `number_word_${num}`;
    // Fallback to the number itself if translation is missing
    return t(key, num.toString());
  };

  return (
    <div className="compare-display">
      <div className="level-indicator">
        <span>{t('compare_display_level', { level: level })}</span>
        <span>{difficultyLevel.name}</span> {/* Assuming difficulty name doesn't need translation? If it does, it needs a key */}
      </div>
      
      <div className="character-speech-bubble robi">
        <div className="character-icon">
          <img src="/assets/images/robi.png" alt={t('compare_display_robi_alt')} className="character-avatar" />
        </div>
        <div className="speech-content">
          <p>{t('compare_display_robi_speech', { num1: numbers[0], num2: numbers[1] })}</p>
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
          <img src="/assets/images/ana.png" alt={t('compare_display_ana_alt')} className="character-avatar" />
        </div>
        <div className="speech-content">
          <p>{t('compare_display_ana_speech')}</p>
        </div>
      </div>
    </div>
  );
};

export default CompareDisplay;
