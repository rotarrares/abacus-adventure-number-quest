import React, { useState, useEffect } from 'react';
import { useGameContext } from '../../context/GameContext';
import { playSound } from '../../utils/audioUtils';
import '../../styles/StartScreen.css';

const StartScreen = () => {
  const { gameState, dispatch, actions } = useGameContext();
  // Removed characterImageLoaded state and useEffect
  const [selectedGame, setSelectedGame] = useState(null); // null, 'abacus', 'other'

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

  const selectGame = (game) => {
    playSound('click', gameState.sound);
    setSelectedGame(game);
  };

  const handleBack = () => {
    playSound('click', gameState.sound);
    setSelectedGame(null);
  }

  // Restore handleTutorial function
  const handleTutorial = () => {
    playSound('click', gameState.sound);
    dispatch({ type: actions.SET_SCREEN, payload: 'tutorial' });
  };

  const toggleSound = () => {
    playSound('click', gameState.sound);
    dispatch({ type: actions.TOGGLE_SOUND });
  };

  return (
    <div className={`start-screen ${!selectedGame ? 'game-select-active' : ''}`}>
      <div className="start-screen-content">
        <h1 className="game-title">Aventura Abacului</h1>
        <h2 className="game-subtitle">Călătoria Numerelor</h2>
        
        <div className="character">
          {/* Use loading="lazy" attribute */}
          <img 
            src="/assets/images/ana.png" 
            alt="Ana character" 
            className="float" 
            loading="lazy" // Add lazy loading attribute
            // Optional: Add placeholder handling if needed, e.g., via CSS background or a simple placeholder element
            // The browser handles the loading, so the explicit placeholder logic is removed.
            // You might want CSS to style the image container while loading.
          />
          {/* Removed the conditional rendering based on characterImageLoaded */}
        </div>

        {!selectedGame && (
          <div className="game-selection">
            <h3>Alege jocul:</h3>
            <div className="game-buttons">
              <button 
                className="game-button" 
                onClick={() => selectGame('abacus')}
              >
                Aventura Abacului
              </button>
              <button 
                className="game-button" 
                onClick={() => selectGame('other')}
                disabled // Disable the second game for now
              >
                Joc Nou (În curând)
              </button>
            </div>
          </div>
        )}

        {selectedGame === 'abacus' && (
          <div className="mode-selection">
            <button className="back-button" onClick={handleBack}>← Înapoi</button>
            <h3>Alege modul de joc (Abac):</h3>
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
              <button 
                className="mode-button featured"
                onClick={() => handleStartGame('compare')}
              >
                Bătălia Abacului: Compară Numerele
              </button>
            </div>
          </div>
        )}

        {selectedGame === 'other' && (
          <div className="placeholder-selection">
             <button className="back-button" onClick={handleBack}>← Înapoi</button>
            <h3>Joc Nou</h3>
            <p>Acest joc va fi disponibil în curând!</p>
            {/* Placeholder for the second game's options or start button */}
          </div>
        )}
        
        <div className="stars-display">
          <span className="star-icon">⭐</span>
          <span className="star-count">{gameState.stars}</span>
        </div>
        
        <div className="bottom-buttons">
          {/* Conditionally render Tutorial button only when a game is selected */}
          {selectedGame && (
            <button className="tutorial-button" onClick={handleTutorial}>
              Tutorial
            </button>
          )}
          <button className="sound-button" onClick={toggleSound}>
            {gameState.sound ? '🔊 Sunet Pornit' : '🔇 Sunet Oprit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
