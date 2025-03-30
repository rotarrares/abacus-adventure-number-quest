import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGameContext } from '../../context/GameContext';
import SimpleAbacus from '../abacus/SimpleAbacus';
import Numpad from '../ui/Numpad';
import FeedbackDisplay from '../ui/FeedbackDisplay';
import Instructions from '../ui/Instructions';
import useWriteNumberGame from '../../hooks/useWriteNumberGame';
import '../../styles/GameModes.css';

const WriteNumberMode = () => {
  const { gameState } = useGameContext();
  const { t } = useTranslation();
  const { 
    userAnswer, 
    handleDigitClick, 
    handleBackspace, 
    handleClear, 
    handleBeadChange, 
    checkAnswer 
  } = useWriteNumberGame();
  
  // Determine difficulty label based on level
  const getDifficultyLabel = () => {
    if (gameState.level <= 2) {
      return t('difficulty_easy');
    } else if (gameState.level <= 4) {
      return t('difficulty_medium');
    } else {
      return t('difficulty_hard');
    }
  };
  
  return (
    <div className="game-mode-container">
      <Instructions 
        title={t('write_number_mode')}
        description={t('write_number_mode_description')}
        level={gameState.level}
        difficultyLabel={getDifficultyLabel()}
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
        {t('check_button')}
      </button>
    </div>
  );
};

export default WriteNumberMode;
