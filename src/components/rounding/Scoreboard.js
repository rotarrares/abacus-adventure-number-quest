import React from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import '../../styles/rounding/Scoreboard.css';

const Scoreboard = ({ score, progress, level, levelGoal = 10 }) => {
  const { t } = useTranslation(); // Get translation function
  console.log("Scoreboard rendering - Score:", score, "Progress:", progress, "Level:", level); // Placeholder

  const progressPercentage = Math.min((progress / levelGoal) * 100, 100);

  return (
    <div className="scoreboard-container">
      <div className="score-display">
        {t('rounding_scoreboard_seeds')} <span className="score-value">{score}</span> 🌱
      </div>
      <div className="level-display">
        {t('rounding_scoreboard_level')} <span className="level-value">{level}</span>
      </div>
      <div className="progress-section">
        <div className="progress-label">
          {t('rounding_scoreboard_flowers_grown')} {progress} / {levelGoal}
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      {/* TODO: Add bonus garden link/button after level completion? */}
    </div>
  );
};

export default Scoreboard;
