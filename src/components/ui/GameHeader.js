import React from 'react';
import { useGameContext } from '../../context/GameContext';
import { playSound } from '../../utils/audioUtils';
import '../../styles/GameHeader.css';

const GameHeader = () => {
  const { gameState, dispatch, actions } = useGameContext();
  
  const toggleSound = () => {
    playSound('click', gameState.sound);
    dispatch({ type: actions.TOGGLE_SOUND });
  };
  
  const getGameModeTitle = () => {
    switch (gameState.gameMode) {
      case 'match':
        return 'Potrivește Numărul';
      case 'read':
        return 'Citește și Construiește';
      case 'write':
        return 'Scrie Numărul';
      default:
        return '';
    }
  };
  
  const getDifficultyLabel = () => {
    if (gameState.level <= 5) {
      return 'Ușor';
    } else if (gameState.level <= 10) {
      return 'Mediu';
    } else {
      return 'Dificil';
    }
  };
  
  return (
    <header className="game-header">
      <div className="game-info">
        <div className="level-badge">
          <span className="level-label">Nivel</span>
          <span className="level-number">{gameState.level}</span>
        </div>
        
        <h2 className="game-mode-title">{getGameModeTitle()}</h2>
        
        <div className="difficulty-badge">
          <span className="difficulty-label">{getDifficultyLabel()}</span>
        </div>
      </div>
      
      <div className="game-stats">
        <div className="score-display">
          <span className="score-label">Scor:</span>
          <span className="score-value">{gameState.score}</span>
        </div>
        
        <div className="stars-display">
          <span className="star-icon">⭐</span>
          <span className="star-count">{gameState.stars}</span>
        </div>
        
        <button 
          className="sound-toggle"
          onClick={toggleSound}
          aria-label={gameState.sound ? 'Dezactivează sunetul' : 'Activează sunetul'}
        >
          {gameState.sound ? '🔊' : '🔇'}
        </button>
      </div>
    </header>
  );
};

export default GameHeader;