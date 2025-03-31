import React from 'react';
import '../../styles/rounding/NumberCard.css';

// Helper function to add commas to numbers for readability
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Helper function to get digit color based on place value
const getDigitColor = (index, length) => {
  const placeValueIndex = length - 1 - index; // 0: units, 1: tens, 2: hundreds, 3: thousands
  switch (placeValueIndex) {
    case 0: return 'digit-units';    // Blue
    case 1: return 'digit-tens';     // Green
    case 2: return 'digit-hundreds'; // Orange
    case 3: return 'digit-thousands';// Red
    default: return '';
  }
};

const NumberCard = ({ number, highlightDigit }) => {
  console.log("NumberCard rendering with number:", number); // Placeholder
  const numberString = number.toString();
  const digits = numberString.split('');

  // Determine which digit index to highlight based on targetPlace
  let highlightIndex = -1;
  if (highlightDigit) {
    switch (highlightDigit) {
      case 'tens':
        highlightIndex = numberString.length - 1; // Units digit determines rounding to tens
        break;
      case 'hundreds':
        highlightIndex = numberString.length - 2; // Tens digit determines rounding to hundreds
        break;
      case 'thousands':
        highlightIndex = numberString.length - 3; // Hundreds digit determines rounding to thousands
        break;
      default:
        highlightIndex = -1;
    }
    // Ensure index is valid
    if (highlightIndex < 0 || highlightIndex >= numberString.length) {
        highlightIndex = -1;
    }
  }


  return (
    <div className="number-card">
      <span className="number-display">
        {digits.map((digit, index) => (
          <span
            key={index}
            className={`digit ${getDigitColor(index, digits.length)} ${index === highlightIndex ? 'highlight' : ''}`}
          >
            {digit}
          </span>
        ))}
        {/* Display formatted number below for clarity if needed */}
        {/* <span className="formatted-number">({formatNumber(number)})</span> */}
      </span>
      {/* TODO: Add hover/click interaction for hints */}
    </div>
  );
};

export default NumberCard;
