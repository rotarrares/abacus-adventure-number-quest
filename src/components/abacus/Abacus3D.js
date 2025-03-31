import React from 'react';
import { Canvas } from '@react-three/fiber';
import AbacusModel from './AbacusModel';
import AbacusControls from './AbacusControls';
import '../../styles/Abacus.css';

// Removed useGameContext import as abacusState will now be a prop

// Added showControls prop, defaulting to true
// Added optional cameraPosition prop, changed default Z from 8 to 6
const Abacus3D = ({ abacusState, onBeadChange, showControls = true, cameraPosition = [0, 1, 10] }) => { 
  // Removed context fetching, abacusState is now a prop

  // Basic validation or default state if needed
  const currentAbacusState = abacusState || { thousands: 0, hundreds: 0, tens: 0, units: 0 };

  return (
    <div className="abacus-container">
      {/* HTML Labels Removed */}
      
      <div className="abacus-canvas-container">
        <Canvas
          camera={{ position: cameraPosition, fov: 50 }} /* Use cameraPosition prop */
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
