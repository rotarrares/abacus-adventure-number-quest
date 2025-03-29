import React from 'react';
import '../../styles/GameModes.css';

const FeedbackDisplay = ({ feedback, showHint, abacusState }) => {
  return (
    <div className="feedback-container">
      {feedback === 'correct' && (
        <div className="feedback correct">
          Corect! Excelent!
        </div>
      )}
      
      {feedback === 'incorrect' && (
        <div className="feedback incorrect">
          Hmm, nu este corect. Încearcă din nou!
          
          {showHint && (
            <div className="hint">
              Indiciu: 
              {abacusState.thousands > 0 && ` ${abacusState.thousands} mii`}
              {abacusState.hundreds > 0 && ` ${abacusState.hundreds} sute`}
              {abacusState.tens > 0 && ` ${abacusState.tens} zeci`}
              {abacusState.units > 0 && ` ${abacusState.units} unități`}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackDisplay;