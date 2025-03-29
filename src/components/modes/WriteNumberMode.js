import React from 'react';
import { useGameContext } from '../../context/GameContext';
import SimpleAbacus from '../abacus/SimpleAbacus';
import Numpad from '../ui/Numpad';
import FeedbackDisplay from '../ui/FeedbackDisplay';
import Instructions from '../ui/Instructions';
import useWriteNumberGame from '../../hooks/useWriteNumberGame';
import '../../styles/GameModes.css';

const WriteNumberMode = () => {
  const { gameState } = useGameContext();
  const { 
    userAnswer, 
    handleDigitClick, 
    handleBackspace, 
    handleClear, 
    handleBeadChange, 
    checkAnswer 
  } = useWriteNumberGame();
  
  return (
    <div className="game-mode-container">
      <Instructions 
        title="Scrie Numărul"
        description="Care număr este reprezentat pe abac?"
        level={gameState.level}
      />
      
      <SimpleAbacus 
        onBeadChange={handleBeadChange} 
        showControls={false} 
      />
      
      <div className="answer-container">
        <Numpad 
          userAnswer={userAnswer}
          onDigitClick={handleDigitClick}
          onBackspace={handleBackspace}
          onClear={handleClear}
        />
      </div>
      
      <FeedbackDisplay 
        feedback={gameState.feedback}
        showHint={gameState.showHint}
        abacusState={gameState.abacusState}
      />
      
      <button 
        className="check-button"
        onClick={checkAnswer}
      >
        Verifică
      </button>
    </div>
  );
};

export default WriteNumberMode;