import React from 'react';
import { Canvas } from '@react-three/fiber';
import AbacusModel from './AbacusModel';
import SimpleAbacus from './SimpleAbacus';
import AbacusControls from './AbacusControls';
import { useGameContext } from '../../context/GameContext';
import '../../styles/Abacus.css';

const Abacus = ({ onBeadChange }) => {
  const { gameState } = useGameContext();
  const { abacusState } = gameState;
  
  // Check if we should use the simple abacus
  const useSimpleAbacus = process.env.REACT_APP_USE_SIMPLE_ABACUS === 'true';
  
  // If using simple abacus, return that component
  if (useSimpleAbacus) {
    return <SimpleAbacus onBeadChange={onBeadChange} />;
  }
  
  // Otherwise, return the 3D abacus
  return (
    <div className="abacus-container">
      <div className="abacus-canvas-container">
        <Canvas
          camera={{ position: [0, 4, 8], fov: 50 }}
          shadows
        >
          <AbacusModel 
            abacusState={abacusState}
            onBeadChange={onBeadChange}
          />
        </Canvas>
      </div>
      
      <AbacusControls 
        abacusState={abacusState}
        onBeadChange={onBeadChange}
      />
    </div>
  );
};

export default Abacus;