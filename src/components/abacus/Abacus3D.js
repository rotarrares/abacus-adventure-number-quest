import React from 'react';
import { Canvas } from '@react-three/fiber';
import AbacusModel from './AbacusModel';
import AbacusControls from './AbacusControls';
import '../../styles/Abacus.css';

// Removed useGameContext import as abacusState will now be a prop

// Added showControls prop, defaulting to true
const Abacus3D = ({ abacusState, onBeadChange, showControls = true }) => { 
  // Removed context fetching, abacusState is now a prop

  // Basic validation or default state if needed
  const currentAbacusState = abacusState || { thousands: 0, hundreds: 0, tens: 0, units: 0 };

  return (
    <div className="abacus-container">
      <div className="abacus-canvas-container">
        <Canvas
          camera={{ position: [0, 1, 8], fov: 50 }}
          shadows
        >
          <AbacusModel 
            abacusState={currentAbacusState} // Use the prop state
            onBeadChange={onBeadChange}
          />
        </Canvas>
      </div>
      
      {/* Conditionally render AbacusControls based on the showControls prop */}
      {showControls && (
        <AbacusControls 
          abacusState={currentAbacusState} // Use the prop state
          onBeadChange={onBeadChange}
        />
      )}
    </div>
  );
};

export default Abacus3D;
