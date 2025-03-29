import React from 'react';
import '../../styles/GameModes.css';

const Instructions = ({ title, description, level }) => {
  return (
    <>
      <h2 className="mode-title">{title}</h2>
      <p className="instructions">
        {description} (Nivel {level})
      </p>
    </>
  );
};

export default Instructions;