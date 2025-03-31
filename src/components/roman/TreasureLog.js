import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/roman/TreasureLog.css'; // Styles to be created later

/**
 * Component to display the player's progress in the Roman Treasure game.
 * Shows the current level and number of treasures collected.
 * @param {Object} props - Component props
 * @param {number} props.treasures - The number of treasures (correct answers) collected.
 * @param {number} props.level - The current game level.
 * @param {number} [props.levelGoal] - Optional: The total tasks needed for the current level.
 */
const TreasureLog = ({ treasures, level, levelGoal }) => {
  const { t } = useTranslation();

  return (
    <div className="treasure-log-container">
      <div className="log-item level-display">
        <span className="log-label">{t('roman_treasure.log_level')}:</span>
        <span className="log-value">{level}</span>
      </div>
      <div className="log-item treasures-display">
        <span className="log-label">{t('roman_treasure.log_treasures')}:</span>
        <span className="log-value">{treasures} 💎</span> {/* Using gem emoji for treasure */}
      </div>
      {/* Optionally display progress within the level if needed */}
      {/* {levelGoal && (
        <div className="log-item progress-display">
          <span className="log-label">Progress:</span>
          <span className="log-value">{taskProgress}/{levelGoal}</span>
        </div>
      )} */}
    </div>
  );
};

export default TreasureLog;
