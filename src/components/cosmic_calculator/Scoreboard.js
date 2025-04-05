import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'; // Import translation hook
import '../../styles/cosmic_calculator/Scoreboard.css'; // CSS for styling

/**
 * Displays the player's current score (star coins) and progress within the level.
 */
const Scoreboard = ({ starCoins, progressCurrent, progressTotal }) => {
  const { t } = useTranslation(); // Initialize translation function

  return (
    <div className="scoreboard-container">
      <div className="scoreboard-item star-coins">
        <span className="label">{t('cosmic_calculator.scoreboard_star_coins')}</span>
        <span className="value">{starCoins} ✨</span> {/* Added star emoji */}
      </div>
      <div className="scoreboard-item level-progress">
        <span className="label">Progress:</span>
        <span className="value">{progressCurrent} / {progressTotal}</span>
      </div>
      {/* Optional: Add a visual progress bar */}
      {progressTotal > 0 && (
         <div className="progress-bar-container">
           <div
             className="progress-bar-fill"
             style={{ width: `${(progressCurrent / progressTotal) * 100}%` }}
           ></div>
         </div>
      )}
    </div>
  );
};

Scoreboard.propTypes = {
  /** The player's current score */
  starCoins: PropTypes.number.isRequired,
  /** The number of problems solved in the current level */
  progressCurrent: PropTypes.number.isRequired,
  /** The total number of problems in the current level */
  progressTotal: PropTypes.number.isRequired,
};

export default Scoreboard;