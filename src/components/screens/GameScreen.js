import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameContext } from '../../context/GameContext';
import { playSound } from '../../utils/audioUtils';
import MatchNumberMode from '../modes/MatchNumberMode';
import ReadBuildMode from '../modes/ReadBuildMode';
import WriteNumberMode from '../modes/WriteNumberMode';
import CompareNumbersMode from '../modes/CompareNumbersMode';
import GameHeader from '../ui/GameHeader';
import '../../styles/GameScreen.css';

const GameScreen = () => {
  const { gameState, dispatch, actions } = useGameContext();
  const { t } = useTranslation();
  
  useEffect(() => {
    // Play level complete sound when level changes (except first load)
    if (gameState.level > 1) {
      playSound('complete', gameState.sound);
    }
  }, [gameState.level, gameState.sound]);
  
  const renderGameMode = () => {
    switch (gameState.gameMode) {
      case 'match':
        return <MatchNumberMode />;
      case 'read':
        return <ReadBuildMode />;
      case 'write':
        return <WriteNumberMode />;
      case 'compare':
        return <CompareNumbersMode />;
      default:
        return <div>{t('unknown_game_mode')}</div>;
    }
  };
  
  const handleBackToMenu = () => {
    playSound('click', gameState.sound);
    dispatch({ type: actions.SET_SCREEN, payload: 'start' });
  };
  
  // Show the treasure chest every 5 levels
  const showTreasure = gameState.level % 5 === 0 && gameState.feedback === 'correct';
  
  return (
    <div className="game-screen">
      <GameHeader />
      
      <div className="game-content">
        {renderGameMode()}
      </div>
      
      <button 
        className="back-button"
        onClick={handleBackToMenu}
      >
        {t('back_to_menu')}
      </button>
      
      {showTreasure && (
        <div className="treasure-container">
          <div className="treasure-box bounce">
            <img src="/assets/images/treasure.png" alt={t('treasure_alt')} />
            <p>{t('treasure_unlocked')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameScreen;
