import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { playSound } from '../../utils/audioUtils';
import { useGameContext } from '../../context/GameContext';

const AbacusModel = ({ abacusState, onBeadChange }) => {
  const { gameState } = useGameContext();
  const abacusRef = useRef();
  
  // Rotate the abacus slightly for better view
  useFrame(() => {
    if (abacusRef.current) {
      abacusRef.current.rotation.y += 0.002;
    }
  });
  
  // Define colors for each column's beads
  const beadColors = {
    thousands: '#3498db', // Blue
    hundreds: '#e74c3c',  // Red
    tens: '#2ecc71',      // Green
    units: '#9b59b6'      // Purple
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow 
      />
      
      <Environment preset="sunset" />
      <OrbitControls 
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        enableZoom={true}
        enablePan={false}
      />
      
      <group ref={abacusRef}>
        {/* Abacus Frame */}
        <mesh receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[8, 0.5, 3]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        
        {/* Abacus Columns */}
        {renderColumn(-3, abacusState.thousands, 'thousands', beadColors.thousands)}
        {renderColumn(-1, abacusState.hundreds, 'hundreds', beadColors.hundreds)}
        {renderColumn(1, abacusState.tens, 'tens', beadColors.tens)}
        {renderColumn(3, abacusState.units, 'units', beadColors.units)}
        
        {/* Column Labels */}
        {renderLabel(-3, 'M', beadColors.thousands)}
        {renderLabel(-1, 'S', beadColors.hundreds)}
        {renderLabel(1, 'Z', beadColors.tens)}
        {renderLabel(3, 'U', beadColors.units)}
      </group>
    </>
  );
  
  function renderColumn(x, count, columnName, color) {
    const beads = [];
    // Render the rod
    beads.push(
      <mesh key={`rod-${columnName}`} position={[x, 2.5, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 5, 16]} />
        <meshStandardMaterial color="#555" />
      </mesh>
    );
    
    // Render the beads
    for (let i = 0; i < count; i++) {
      beads.push(
        <mesh 
          key={`bead-${columnName}-${i}`}
          position={[x, 0.6 + i * 0.5, 0]}
          castShadow
          onClick={() => {
            // Handle bead click - remove one bead
            if (count > 0) {
              playSound('beadRemove', gameState.sound);
              onBeadChange(columnName, count - 1);
            }
          }}
        >
          <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
          <meshStandardMaterial color={color} />
        </mesh>
      );
    }
    
    // Add a click area to add beads
    beads.push(
      <mesh
        key={`add-area-${columnName}`}
        position={[x, 5, 0]}
        onClick={() => {
          // Handle rod click - add a bead
          if (count < 9) {
            playSound('beadPlace', gameState.sound);
            onBeadChange(columnName, count + 1);
          }
        }}
      >
        <cylinderGeometry args={[0.2, 0.2, 0.5, 16]} />
        <meshStandardMaterial 
          color={count < 9 ? "#5cb85c" : "#d9534f"} 
          transparent
          opacity={0.6}
        />
      </mesh>
    );
    
    return beads;
  }
  
  function renderLabel(x, text, color) {
    return (
      <mesh position={[x, -0.3, 0]}>
        <boxGeometry args={[0.8, 0.5, 0.1]} />
        <meshStandardMaterial color={color} />
        {/* In a real application, we'd use a TextGeometry or HTML overlay for the text */}
      </mesh>
    );
  }
};

export default AbacusModel;