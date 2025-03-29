import React, { useState, useEffect } from 'react';
import { useGameContext } from '../../context/GameContext';
import { playSound } from '../../utils/audioUtils';
import '../../styles/StartScreen.css';

const StartScreen = () => {
  const { gameState, dispatch, actions } = useGameContext();
  const [characterImageLoaded, setCharacterImageLoaded] = useState(false);

  // Check if the character image exists
  useEffect(() => {
    const img = new Image();
    img.onload = () => setCharacterImageLoaded(true);
    img.onerror = () => setCharacterImageLoaded(false);
    img.src = '/assets/images/ana.png';
  }, []);

  const handleStartGame = (mode) => {
    playSound('click', gameState.sound);
    
    dispatch({ type: actions.SET_GAME_MODE, payload: mode });
    dispatch({ type: actions.SET_SCREEN, payload: 'game' });
    dispatch({ type: actions.SET_LEVEL, payload: 1 });
    
    // Set initial difficulty based on level
    dispatch({ 
      type: actions.SET_DIFFICULTY, 
      payload: { min: 8, max: 99 } 
    });
  };

  const handleTutorial = () => {
    playSound('click', gameState.sound);
    dispatch({ type: actions.SET_SCREEN, payload: 'tutorial' });
  };

  const toggleSound = () => {
    playSound('click', gameState.sound);
    dispatch({ type: actions.TOGGLE_SOUND });
  };

  return (
    <div className="start-screen">
      <div className="start-screen-content">
        <h1 className="game-title">Aventura Abacului</h1>
        <h2 className="game-subtitle">Călătoria Numerelor</h2>
        
        <div className="character">
          {characterImageLoaded ? (
            <img 
              src="/assets/images/ana.png" 
              alt="Ana character" 
              className="float" 
            />
          ) : (
            <div className="character-placeholder float">
              👧
            </div>
          )}
        </div>
        
        <div className="mode-selection">
          <h3>Alege modul de joc:</h3>
          <div className="mode-buttons">
            <button 
              className="mode-button" 
              onClick={() => handleStartGame('match')}
            >
              Potrivește Numărul
            </button>
            <button 
              className="mode-button" 
              onClick={() => handleStartGame('read')}
            >
              Citește și Construiește
            </button>
            <button 
              className="mode-button" 
              onClick={() => handleStartGame('write')}
            >
              Scrie Numărul
            </button>
          </div>
        </div>
        
        <div className="stars-display">
          <span className="star-icon">⭐</span>
          <span className="star-count">{gameState.stars}</span>
        </div>
        
        <div className="bottom-buttons">
          <button className="tutorial-button" onClick={handleTutorial}>
            Tutorial
          </button>
          <button className="sound-button" onClick={toggleSound}>
            {gameState.sound ? '🔊 Sunet Pornit' : '🔇 Sunet Oprit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;