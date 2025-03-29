import React from 'react';
import '../../styles/GameModes.css';

const Instructions = ({ title, description, level, difficultyLabel }) => {
  return (
    <>
      <h2 className="mode-title">{title}</h2>
      <div className="instructions-container">
        <p className="instructions">
          {description} (Nivel {level})
        </p>
        {difficultyLabel && (
          <div className={`difficulty-badge difficulty-${difficultyLabel.toLowerCase()}`}>
            {difficultyLabel}
          </div>
        )}
      </div>
    </>
  );
};

export default Instructions;