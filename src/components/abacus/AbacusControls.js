import React from 'react';
import { playSound } from '../../utils/audioUtils';
import { useGameContext } from '../../context/GameContext';

const AbacusControls = ({ abacusState, onBeadChange }) => {
  const { gameState } = useGameContext();
  
  const handleAddBead = (column) => {
    if (abacusState[column] < 9) {
      playSound('beadPlace', gameState.sound);
      onBeadChange(column, abacusState[column] + 1);
    }
  };
  
  const handleRemoveBead = (column) => {
    if (abacusState[column] > 0) {
      playSound('beadRemove', gameState.sound);
      onBeadChange(column, abacusState[column] - 1);
    }
  };
  
  const renderColumnControl = (column, label, color) => {
    return (
      <div className="abacus-column-control">
        <h3 className="column-label" style={{ backgroundColor: color }}>{label}</h3>
        <div className="bead-controls">
          <button 
            className="bead-button add-button"
            onClick={() => handleAddBead(column)}
            disabled={abacusState[column] >= 9}
          >
            +
          </button>
          <div className="bead-count">{abacusState[column]}</div>
          <button 
            className="bead-button remove-button"
            onClick={() => handleRemoveBead(column)}
            disabled={abacusState[column] <= 0}
          >
            -
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="abacus-controls">
      {renderColumnControl('thousands', 'M', '#3498db')}
      {renderColumnControl('hundreds', 'S', '#e74c3c')}
      {renderColumnControl('tens', 'Z', '#2ecc71')}
      {renderColumnControl('units', 'U', '#9b59b6')}
    </div>
  );
};

export default AbacusControls;