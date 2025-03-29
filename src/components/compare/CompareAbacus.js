import React from 'react';
import AbacusControls from '../abacus/AbacusControls';
import '../../styles/Abacus.css';
import '../../styles/CompareAbacus.css';

/**
 * A simplified 2D version of the abacus that accepts state directly via props
 * instead of using the global context.
 */
const CompareAbacus = ({ abacusState, onBeadChange, showControls = true }) => {
  // Colors for the beads
  const beadColors = {
    thousands: '#3498db', // Blue
    hundreds: '#e74c3c',  // Red
    tens: '#2ecc71',      // Green
    units: '#9b59b6'      // Purple
  };

  // Labels for each column
  const columnLabels = {
    thousands: 'M', // Mii
    hundreds: 'S',  // Sute
    tens: 'Z',      // Zeci
    units: 'U'      // Unități
  };

  // Function to render a column of beads with its label
  const renderBeadColumn = (count, columnName, color, label) => {
    const beads = [];
    
    // Add beads based on count
    for (let i = 0; i < count; i++) {
      beads.push(
        <div 
          key={`bead-${columnName}-${i}`}
          className="bead compare-bead"
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
          className="bead-slot compare-bead-slot"
          onClick={() => onBeadChange(columnName, count + 1)}
        />
      );
    }
    
    return (
      <div className="bead-column-wrapper">
        <div className="column-label compare-column-label" style={{ backgroundColor: color }}>
          {label}
        </div>
        <div className="bead-column compare-bead-column">
          {beads}
        </div>
      </div>
    );
  };

  return (
    <div className="abacus-container compare-abacus-container">
      <div className="simple-abacus compare-simple-abacus">
        <div className="abacus-frame compare-abacus-frame">
          <div className="bead-columns compare-bead-columns">
            {renderBeadColumn(
              abacusState.thousands, 
              'thousands', 
              beadColors.thousands, 
              columnLabels.thousands
            )}
            {renderBeadColumn(
              abacusState.hundreds, 
              'hundreds', 
              beadColors.hundreds, 
              columnLabels.hundreds
            )}
            {renderBeadColumn(
              abacusState.tens, 
              'tens', 
              beadColors.tens, 
              columnLabels.tens
            )}
            {renderBeadColumn(
              abacusState.units, 
              'units', 
              beadColors.units, 
              columnLabels.units
            )}
          </div>
        </div>
      </div>
      
      {showControls && (
        <AbacusControls 
          abacusState={abacusState}
          onBeadChange={onBeadChange}
        />
      )}
    </div>
  );
};

export default CompareAbacus;