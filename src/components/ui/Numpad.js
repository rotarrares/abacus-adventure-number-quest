import React from 'react';
import '../../styles/GameModes.css';

const Numpad = ({ userAnswer, onDigitClick, onBackspace, onClear }) => {
  return (
    <div className="numpad-container">
      <div className="numpad-display">{userAnswer}</div>
      <div className="numpad-buttons">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
          <button 
            key={digit}
            className="numpad-button"
            onClick={() => onDigitClick(digit.toString())}
          >
            {digit}
          </button>
        ))}
        <button 
          className="numpad-button numpad-action"
          onClick={onBackspace}
        >
          ⌫
        </button>
        <button 
          className="numpad-button numpad-action"
          onClick={onClear}
        >
          C
        </button>
      </div>
    </div>
  );
};

export default Numpad;