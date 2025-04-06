import React, { useState } from 'react'; // Removed useEffect as it wasn't used
import { useGameContext } from '../../context/GameContext';
import { playSound } from '../../utils/audioUtils';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { LEVELS as roundingLevels } from '../../constants/roundingConstants'; // Import named export LEVELS
import '../../styles/StartScreen.css';

const StartScreen = () => {
  const { gameState, dispatch, actions } = useGameContext();
  // const { highestRoundingLevelUnlocked } = gameState; // Removed unused variable
  const { t, i18n } = useTranslation(); // Get translation function and i18n instance
  const [selectedGame, setSelectedGame] = useState(null); // null, 'abacus', 'other', 'roman'

  // Generic handler for Abacus modes
  const handleStartAbacusGame = (mode) => {
    playSound('click', gameState.sound);
    dispatch({ type: actions.SET_GAME_MODE, payload: mode });
    dispatch({ type: actions.SET_LEVEL, payload: 1 }); // Abacus games start at level 1
    dispatch({ type: actions.SET_SCREEN, payload: 'game' });
    // Set initial difficulty if needed for this mode
    // dispatch({ type: actions.SET_DIFFICULTY, payload: { min: 8, max: 99 } });
  };

  // Specific handler for starting Rounding game at a chosen level
  const handleStartRoundingGame = (level) => {
    playSound('click', gameState.sound);
    dispatch({ type: actions.SET_GAME_MODE, payload: 'rounding' });
    dispatch({ type: actions.SET_LEVEL, payload: level }); // Set the chosen level
    dispatch({ type: actions.SET_SCREEN, payload: 'game' });
  };

  // Handler for starting Roman Treasure game
  const handleStartRomanGame = () => {
    playSound('click', gameState.sound);
    dispatch({ type: actions.SET_GAME_MODE, payload: 'roman' });
    dispatch({ type: actions.SET_LEVEL, payload: 1 }); // Roman game manages internal levels, start at 1
    dispatch({ type: actions.SET_SCREEN, payload: 'game' });
  };
  // Handler for starting Cosmic Calculator game
  const handleStartCosmicGame = () => {
    playSound('click', gameState.sound);
    dispatch({ type: actions.SET_GAME_MODE, payload: 'cosmic_calculator' }); // Use 'cosmic_calculator' mode key
    dispatch({ type: actions.SET_LEVEL, payload: 1 }); // Cosmic Calculator starts at level 1
    dispatch({ type: actions.SET_SCREEN, payload: 'game' });
  };

  // Handler for starting Magic Bakery game
  const handleStartMagicBakeryGame = () => {
    playSound('click', gameState.sound);
    dispatch({ type: actions.SET_GAME_MODE, payload: 'magic_bakery' }); // Use 'magic_bakery' mode key
    dispatch({ type: actions.SET_LEVEL, payload: 1 }); // Magic Bakery starts at level 1
    dispatch({ type: actions.SET_SCREEN, payload: 'game' });
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
              >
                {t('anas_number_garden_button')}
              </button>
              {/* Add button for Roman Treasure Hunt */}
              <button
                className="game-button"
                onClick={() => selectGame('roman')}
              >
                {t('roman_treasure_button')} {/* Add translation key */}
              </button>
              {/* Add button for Cosmic Calculator */}
              <button
                className="game-button"
                onClick={() => selectGame('cosmic')}
              >
                {t('cosmic_calculator_button')} {/* Use new translation key */}
              </button>
              {/* Add button for Magic Bakery */}
              <button
                className="game-button"
                onClick={() => selectGame('magic_bakery')}
              >
                {t('magic_bakery_button')} {/* Use new translation key */}
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
                onClick={() => handleStartAbacusGame('match')}
              >
                {t('match_number_mode')}
              </button>
              <button
                className="mode-button"
                onClick={() => handleStartAbacusGame('read')}
              >
                {t('read_build_mode')}
              </button>
              <button
                className="mode-button"
                onClick={() => handleStartAbacusGame('write')}
              >
                {t('write_number_mode')}
              </button>
              <button
                className="mode-button featured"
                onClick={() => handleStartAbacusGame('compare')}
              >
                {t('compare_numbers_mode')}

              </button>
            </div>
          </div>
        )}

        {selectedGame === 'other' && (
          <div className="mode-selection level-selection">
             <button className="back-button" onClick={handleBack}>{t('back_button')}</button>
            <h3>{t('anas_number_garden_title')}</h3>
            <p>{t('anas_number_garden_description')}</p>
            <h4>{t('select_level')}</h4> {/* Add translation key */}
            <div className="level-buttons">
              {/* Generate buttons for ALL defined levels */}
              {Object.keys(roundingLevels) // Get level numbers as strings ('1', '2', ...)
                .map(Number) // Convert to numbers [1, 2, ...]
                .sort((a, b) => a - b) // Ensure correct order
                .map((levelNum) => (
                <button
                  key={levelNum}
                  className="level-button mode-button" // Reuse mode-button style
                  onClick={() => handleStartRoundingGame(levelNum)}
                >
                  {/* Use translation key for level label */}
                  {t('level_label', { level: levelNum })}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add section for Roman Treasure Hunt */}
        {selectedGame === 'roman' && (
          <div className="mode-selection">
            <button className="back-button" onClick={handleBack}>{t('back_button')}</button>
            <h3>{t('roman_treasure_title')}</h3> {/* Add translation key */}
            <p>{t('roman_treasure_description')}</p> {/* Add translation key */}
            <div className="mode-buttons"> {/* Reuse mode-buttons container */}
              <button
                className="mode-button" // Reuse mode-button style
                onClick={handleStartRomanGame}
              >
                {t('start_roman_game_button')} {/* Add translation key */}
              </button>
            </div>
          </div>
        )}

        {/* Add section for Magic Bakery */}
        {selectedGame === 'magic_bakery' && (
          <div className="mode-selection">
            <button className="back-button" onClick={handleBack}>{t('back_button')}</button>
            <h3>{t('magic_bakery_title')}</h3>
            <p>{t('magic_bakery_description')}</p>
            <div className="mode-buttons"> {/* Reuse mode-buttons container */}
              <button
                className="mode-button" // Reuse mode-button style
                onClick={handleStartMagicBakeryGame}
              >
                {t('start_magic_bakery_button')}
              </button>
            </div>
          </div>
        )}

        {/* Add section for Cosmic Calculator */}
        {selectedGame === 'cosmic' && (
          <div className="mode-selection">
            <button className="back-button" onClick={handleBack}>{t('back_button')}</button>
            <h3>{t('cosmic_calculator_title')}</h3> {/* Use new translation key */}
            <p>{t('cosmic_calculator_description')}</p> {/* Use new translation key */}
            <div className="mode-buttons"> {/* Reuse mode-buttons container */}
              <button
                className="mode-button" // Reuse mode-button style
                onClick={handleStartCosmicGame}
              >
                {t('start_cosmic_game_button')} {/* Use new translation key */}
              </button>
            </div>
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
