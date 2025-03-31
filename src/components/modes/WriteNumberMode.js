import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGameContext } from '../../context/GameContext';
// import SimpleAbacus from '../abacus/SimpleAbacus'; // Replaced with Abacus3D
import Abacus3D from '../abacus/Abacus3D'; // Import the 3D Abacus
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
    <div className="game-mode-container write-number-mode"> {/* Added specific class */}
      {/* Column 1: Abacus */}
      <div className="abacus-column">
        <Abacus3D 
          abacusState={gameState.abacusState} // Pass the state from context
          onBeadChange={handleBeadChange} 
          showControls={false} // Hide controls in this mode
          cameraPosition={[0, 1, 14]} // Set specific camera distance for this mode
        />
      </div>

      {/* Column 2: Controls, Feedback, etc. */}
      <div className="controls-column">
        <Instructions 
          title={t('write_number_mode')}
          description={t('write_number_mode_description')}
        level={gameState.level}
        difficultyLabel={getDifficultyLabel()}
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
    </div>
  );
};

export default WriteNumberMode;
