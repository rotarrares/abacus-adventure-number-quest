import React, { useState } from 'react'; // Removed useEffect as it wasn't used
import { useGameContext } from '../../context/GameContext';
import { playSound } from '../../utils/audioUtils';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import '../../styles/StartScreen.css';

const StartScreen = () => {
  const { gameState, dispatch, actions } = useGameContext();
  const { t, i18n } = useTranslation(); // Get translation function and i18n instance
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
  };

  const changeLanguage = (lng) => {
    playSound('click', gameState.sound);
    i18n.changeLanguage(lng);
  };

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
        <h1 className="game-title">{t('game_title')}</h1>
        <h2 className="game-subtitle">{t('game_subtitle')}</h2>

        <div className="language-switcher">
          <button onClick={() => changeLanguage('en')} disabled={i18n.language === 'en'}>
            {t('language_en')}
          </button>
          <button onClick={() => changeLanguage('ro')} disabled={i18n.language === 'ro'}>
            {t('language_ro')}
          </button>
        </div>

        <div className="character">
          {/* Use loading="lazy" attribute */}
          <img
            src="/assets/images/ana.png"
            alt="Ana character"
            className="float"
            loading="lazy" // Add lazy loading attribute
          />
        </div>

        {!selectedGame && (
          <div className="game-selection">
            <h3>{t('choose_game')}</h3>
            <div className="game-buttons">
              <button
                className="game-button"
                onClick={() => selectGame('abacus')}
              >
                {t('abacus_adventure_button')}
              </button>
              <button
                className="game-button"
                onClick={() => selectGame('other')}
                disabled // Disable the second game for now
              >
                {t('new_game_soon_button')}
              </button>
            </div>
          </div>
        )}

        {selectedGame === 'abacus' && (
          <div className="mode-selection">
            <button className="back-button" onClick={handleBack}>{t('back_button')}</button>
            <h3>{t('choose_abacus_mode')}</h3>
            <div className="mode-buttons">
              <button
                className="mode-button"
                onClick={() => handleStartGame('match')}
              >
                {t('match_number_mode')}
              </button>
              <button
                className="mode-button"
                onClick={() => handleStartGame('read')}
              >
                {t('read_build_mode')}
              </button>
              <button
                className="mode-button"
                onClick={() => handleStartGame('write')}
              >
                {t('write_number_mode')}
              </button>
              <button
                className="mode-button featured"
                onClick={() => handleStartGame('compare')}
              >
                {t('compare_numbers_mode')}

              </button>
            </div>
          </div>
        )}

        {selectedGame === 'other' && (
          <div className="placeholder-selection">
             <button className="back-button" onClick={handleBack}>{t('back_button')}</button>
            <h3>{t('new_game_title')}</h3>
            <p>{t('new_game_soon_text')}</p>
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
              {t('tutorial_button')}
            </button>
          )}
          <button className="sound-button" onClick={toggleSound}>
            {gameState.sound ? t('sound_on_button') : t('sound_off_button')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
