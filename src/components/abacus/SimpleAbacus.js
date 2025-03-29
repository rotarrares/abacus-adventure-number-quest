import React from 'react';
import AbacusControls from './AbacusControls';
import { useGameContext } from '../../context/GameContext';
import '../../styles/Abacus.css';

// A simplified 2D version of the abacus that doesn't use Three.js
const SimpleAbacus = ({ onBeadChange }) => {
  const { gameState } = useGameContext();
  const { abacusState } = gameState;

  // Colors for the beads
  const beadColors = {
    thousands: '#3498db', // Blue
    hundreds: '#e74c3c',  // Red
    tens: '#2ecc71',      // Green
    units: '#9b59b6'      // Purple
  };

  // Function to render a column of beads
  const renderBeadColumn = (count, columnName, color) => {
    const beads = [];
    
    // Add beads based on count
    for (let i = 0; i < count; i++) {
      beads.push(
        <div 
          key={`bead-${columnName}-${i}`}
          className="bead"
          style={{ backgroundColor: color }}
          onClick={() => onBeadChange(columnName, count - 1)}
        />
      );
    }
    
    // Add "slots" for remaining beads (up to 9)
    for (let i = count; i < 9; i++) {
      beads.push(
        <div 
          key={`empty-${columnName}-${i}`}
          className="bead-slot"
          onClick={() => onBeadChange(columnName, count + 1)}
        />
      );
    }
    
    return (
      <div className="bead-column">
        {beads}
      </div>
    );
  };

  return (
    <div className="abacus-container">
      <div className="simple-abacus">
        <div className="abacus-frame">
          <div className="column-labels">
            <div className="column-label" style={{ backgroundColor: beadColors.thousands }}>M</div>
            <div className="column-label" style={{ backgroundColor: beadColors.hundreds }}>S</div>
            <div className="column-label" style={{ backgroundColor: beadColors.tens }}>Z</div>
            <div className="column-label" style={{ backgroundColor: beadColors.units }}>U</div>
          </div>
          
          <div className="bead-columns">
            {renderBeadColumn(abacusState.thousands, 'thousands', beadColors.thousands)}
            {renderBeadColumn(abacusState.hundreds, 'hundreds', beadColors.hundreds)}
            {renderBeadColumn(abacusState.tens, 'tens', beadColors.tens)}
            {renderBeadColumn(abacusState.units, 'units', beadColors.units)}
          </div>
        </div>
      </div>
      
      <AbacusControls 
        abacusState={abacusState}
        onBeadChange={onBeadChange}
      />
    </div>
  );
};

export default SimpleAbacus;