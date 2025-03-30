import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameContext } from '../../context/GameContext';
import { playSound } from '../../utils/audioUtils';
import { PLACE_VALUES } from '../../constants/compareNumbersConstants'; // For place value keys
import { getPlaceValueName, getPlaceValueLabel } from '../../utils/compareNumbersUtils'; // For place value names/labels
import '../../styles/TutorialScreen.css';

const TutorialScreen = () => {
  const { gameState, dispatch, actions } = useGameContext();
  const { t } = useTranslation();
  const [abacusImageLoaded, setAbacusImageLoaded] = useState(false);

  // Check if the abacus example image exists
  useEffect(() => {
    const img = new Image();
    img.onload = () => setAbacusImageLoaded(true);
    img.onerror = () => setAbacusImageLoaded(false);
    img.src = '/assets/images/abacus_example.png';
  }, []);

  const handleBack = () => {
    playSound('click', gameState.sound);
    dispatch({ type: actions.SET_SCREEN, payload: 'start' });
  };

  return (
    <div className="tutorial-screen">
      <div className="tutorial-content">
        <h2>{t('tutorial_main_title')}</h2>
        
        <div className="tutorial-section">
          <h3>{t('tutorial_what_is_abacus_title')}</h3>
          <p>{t('tutorial_what_is_abacus_p1')}</p>
          <ul className="column-labels">
            <li><span className="column-label m-label">{getPlaceValueLabel(PLACE_VALUES.THOUSANDS, t)}</span> - {getPlaceValueName(PLACE_VALUES.THOUSANDS, t)}</li>
            <li><span className="column-label s-label">{getPlaceValueLabel(PLACE_VALUES.HUNDREDS, t)}</span> - {getPlaceValueName(PLACE_VALUES.HUNDREDS, t)}</li>
            <li><span className="column-label z-label">{getPlaceValueLabel(PLACE_VALUES.TENS, t)}</span> - {getPlaceValueName(PLACE_VALUES.TENS, t)}</li>
            <li><span className="column-label u-label">{getPlaceValueLabel(PLACE_VALUES.UNITS, t)}</span> - {getPlaceValueName(PLACE_VALUES.UNITS, t)}</li>
          </ul>
          <div className="abacus-example">
            {abacusImageLoaded ? (
              <img src="/assets/images/abacus_example.png" alt={t('tutorial_abacus_example_alt')} />
            ) : (
              <div className="abacus-placeholder">
                {t('tutorial_abacus_example_placeholder')}
              </div>
            )}
          </div>
        </div>
        
        <div className="tutorial-section">
          <h3>{t('tutorial_game_modes_title')}</h3>
          
          <div className="game-mode">
            <h4>{t('tutorial_mode1_title')}</h4>
            <p>{t('tutorial_mode1_p1')}</p>
            <ul>
              <li>{t('tutorial_mode1_li', { count: 2, label: getPlaceValueLabel(PLACE_VALUES.THOUSANDS, t), name: getPlaceValueName(PLACE_VALUES.THOUSANDS, t) })}</li>
              <li>{t('tutorial_mode1_li', { count: 4, label: getPlaceValueLabel(PLACE_VALUES.HUNDREDS, t), name: getPlaceValueName(PLACE_VALUES.HUNDREDS, t) })}</li>
              <li>{t('tutorial_mode1_li', { count: 5, label: getPlaceValueLabel(PLACE_VALUES.TENS, t), name: getPlaceValueName(PLACE_VALUES.TENS, t) })}</li>
              <li>{t('tutorial_mode1_li', { count: 6, label: getPlaceValueLabel(PLACE_VALUES.UNITS, t), name: getPlaceValueName(PLACE_VALUES.UNITS, t) })}</li>
            </ul>
          </div>
          
          <div className="game-mode">
            <h4>{t('tutorial_mode2_title')}</h4>
            <p>{t('tutorial_mode2_p1')}</p>
            <p>{t('tutorial_mode2_p2')}</p>
          </div>
          
          <div className="game-mode">
            <h4>{t('tutorial_mode3_title')}</h4>
            <p>{t('tutorial_mode3_p1')}</p>
            <p>{t('tutorial_mode3_p2')}</p>
          </div>
        </div>
        
        <div className="tutorial-section">
          <h3>{t('tutorial_placing_beads_title')}</h3>
          <ul>
            <li>{t('tutorial_placing_beads_li1')}</li>
            <li>{t('tutorial_placing_beads_li2')}</li>
            <li>{t('tutorial_placing_beads_li3')}</li>
          </ul>
        </div>
        
        <div className="tutorial-section">
          <h3>{t('tutorial_scoring_title')}</h3>
          <ul>
            <li>{t('tutorial_scoring_li1')}</li>
            <li>{t('tutorial_scoring_li2')}</li>
            <li>{t('tutorial_scoring_li3')}</li>
          </ul>
        </div>
        
        <button className="back-button" onClick={handleBack}>
          {t('back_to_menu')}
        </button>
      </div>
    </div>
  );
};

export default TutorialScreen;
