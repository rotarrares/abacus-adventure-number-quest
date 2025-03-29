import React from 'react';
import { Canvas } from '@react-three/fiber';
import AbacusModel from './AbacusModel';
import AbacusControls from './AbacusControls';
import { useGameContext } from '../../context/GameContext';
import '../../styles/Abacus.css';

const Abacus = ({ onBeadChange }) => {
  const { gameState } = useGameContext();
  const { abacusState } = gameState;

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