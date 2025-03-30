import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGameContext } from '../../context/GameContext';
import { playSound } from '../../utils/audioUtils';
import '../../styles/GameHeader.css';

const GameHeader = () => {
  const { gameState, dispatch, actions } = useGameContext();
  const { t } = useTranslation();
  
  const toggleSound = () => {
    playSound('click', gameState.sound);
    dispatch({ type: actions.TOGGLE_SOUND });
  };
  
  const getGameModeTitle = () => {
    switch (gameState.gameMode) {
      case 'match':
        return t('match_number_mode');
      case 'read':
        return t('read_build_mode'); // Assuming this key exists from previous work
      case 'write':
        return t('write_number_mode');
      case 'compare':
         return t('compare_numbers_mode'); // Added compare mode
      default:
        return '';
    }
  };
  
  const getDifficultyLabel = () => {
    // Using level ranges from WriteNumberMode for consistency, adjust if needed
    if (gameState.level <= 2) { 
      return t('difficulty_easy');
    } else if (gameState.level <= 4) {
      return t('difficulty_medium');
    } else {
      return t('difficulty_hard'); // Using 'hard' key
    }
  };
  
  return (
    <header className="game-header">
      <div className="game-info">
        <div className="level-badge">
          <span className="level-label">{t('game_header_level_label')}</span>
          <span className="level-number">{gameState.level}</span>
        </div>
        
        <h2 className="game-mode-title">{getGameModeTitle()}</h2>
        
        <div className="difficulty-badge">
          <span className="difficulty-label">{getDifficultyLabel()}</span>
        </div>
      </div>
      
      <div className="game-stats">
        <div className="score-display">
          <span className="score-label">{t('game_header_score_label')}</span>
          <span className="score-value">{gameState.score}</span>
        </div>
        
        <div className="stars-display">
          <span className="star-icon">⭐</span>
          <span className="star-count">{gameState.stars}</span>
        </div>
        
        <button 
          className="sound-toggle"
          onClick={toggleSound}
          aria-label={gameState.sound ? t('game_header_sound_off_aria') : t('game_header_sound_on_aria')}
        >
          {gameState.sound ? '🔊' : '🔇'}
        </button>
      </div>
    </header>
  );
};

export default GameHeader;
