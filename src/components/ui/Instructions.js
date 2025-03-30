import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/GameModes.css';

const Instructions = ({ title, description, level, difficultyLabel }) => {
  const { t } = useTranslation();

  return (
    <>
      <h2 className="mode-title">{title}</h2> {/* Title is already translated via props */}
      <div className="instructions-container">
        <p className="instructions">
          {description} {t('instructions_level_indicator', { level: level })} {/* Description is translated via props */}
        </p>
        {difficultyLabel && (
          <div className={`difficulty-badge difficulty-${difficultyLabel.toLowerCase()}`}> {/* Assuming CSS class names don't need translation */}
            {difficultyLabel}
          </div>
        )}
      </div>
    </>
  );
};

export default Instructions;
