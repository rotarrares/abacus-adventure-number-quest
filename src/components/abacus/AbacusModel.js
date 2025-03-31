import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Text } from '@react-three/drei';
import { animated, useSpring } from '@react-spring/three';
import * as THREE from 'three';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { playSound } from '../../utils/audioUtils';
import { useGameContext } from '../../context/GameContext';

// Constants for geometry and layout
const BEAD_RADIUS = 0.35;
const BEAD_HEIGHT = 0.25; // Keep this for spacing logic if needed
const BEAD_SPACING = 0.5; // Vertical distance between bead centers
const ROD_RADIUS = 0.08;
const ROD_HEIGHT = 5;
const FRAME_WIDTH = 8;
const FRAME_HEIGHT = 0.5;
const FRAME_DEPTH = 3;
const COLUMN_POSITIONS = [-3, -1, 1, 3]; // X positions for thousands, hundreds, tens, units

// Animated Bead Component
const Bead = ({ position, color, onClick, columnName, index }) => {
  const { y } = useSpring({
    to: { y: position[1] },
    config: { mass: 1, tension: 280, friction: 60 }, // Spring physics
  });

  return (
    <animated.mesh
      position-x={position[0]}
      position-y={y}
      position-z={position[2]}
      castShadow
      onClick={onClick}
      key={`bead-${columnName}-${index}`} // Ensure key is passed if needed outside
    >
      <sphereGeometry args={[BEAD_RADIUS, 32, 32]} />
      <meshStandardMaterial 
        color={color} 
        metalness={0.3} 
        roughness={0.4} 
      />
    </animated.mesh>
  );
};


const AbacusModel = ({ abacusState, onBeadChange }) => {
  const { t } = useTranslation(); // Get the translation function
  const { gameState } = useGameContext();
  const abacusRef = useRef();

  // Define colors for each column's beads
  const beadColors = useMemo(() => ({
    thousands: '#3498db', // Blue
    hundreds: '#e74c3c',  // Red
    tens: '#2ecc71',      // Green
    units: '#9b59b6'      // Purple
  }), []);

  // Define paler versions of the bead colors for inactive beads
  const paleBeadColors = useMemo(() => ({
    thousands: '#a9cce3', // Lighter Blue
    hundreds: '#f5b7b1',  // Lighter Red
    tens: '#a3e4d7',      // Lighter Green
    units: '#d7bde2'      // Lighter Purple
  }), []);


  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />

      {/* Environment for reflections and ambient light */}
      <Environment preset="city" /> 
      
      {/* Controls */}
      <OrbitControls
        minPolarAngle={Math.PI / 4} // Slightly restrict vertical angle
        maxPolarAngle={Math.PI / 1.8} // Slightly restrict vertical angle
        enableZoom={true}
        enablePan={true} // Allow panning for better positioning
        target={[0, 2, 0]} // Center the view slightly higher
      />

      <group ref={abacusRef} position={[0, 2.2, 0]}> {/* Moved abacus model even higher */}
        {/* Abacus Frame - Top and Bottom */}
        <mesh receiveShadow position={[0, ROD_HEIGHT / 2 + FRAME_HEIGHT / 2, 0]}>
          <boxGeometry args={[FRAME_WIDTH, FRAME_HEIGHT, FRAME_DEPTH]} />
          <meshStandardMaterial color="#A0522D" metalness={0.2} roughness={0.8} />
        </mesh>
        <mesh receiveShadow position={[0, -ROD_HEIGHT / 2 - FRAME_HEIGHT / 2, 0]}>
          <boxGeometry args={[FRAME_WIDTH, FRAME_HEIGHT, FRAME_DEPTH]} />
          <meshStandardMaterial color="#A0522D" metalness={0.2} roughness={0.8} />
        </mesh>
        {/* Frame Sides (Optional, for visual completeness) */}
         <mesh receiveShadow position={[-FRAME_WIDTH/2 - FRAME_HEIGHT/2, 0, 0]}>
          <boxGeometry args={[FRAME_HEIGHT, ROD_HEIGHT + FRAME_HEIGHT*2, FRAME_DEPTH]} />
          <meshStandardMaterial color="#A0522D" metalness={0.2} roughness={0.8} />
        </mesh>
         <mesh receiveShadow position={[FRAME_WIDTH/2 + FRAME_HEIGHT/2, 0, 0]}>
          <boxGeometry args={[FRAME_HEIGHT, ROD_HEIGHT + FRAME_HEIGHT*2, FRAME_DEPTH]} />
          <meshStandardMaterial color="#A0522D" metalness={0.2} roughness={0.8} />
        </mesh>


        {/* Abacus Columns */}
        {renderColumn(COLUMN_POSITIONS[0], abacusState.thousands, 'thousands', beadColors.thousands)}
        {renderColumn(COLUMN_POSITIONS[1], abacusState.hundreds, 'hundreds', beadColors.hundreds)}
        {renderColumn(COLUMN_POSITIONS[2], abacusState.tens, 'tens', beadColors.tens)}
        {renderColumn(COLUMN_POSITIONS[3], abacusState.units, 'units', beadColors.units)}

        {/* Column Labels using Drei Text */}
        {renderLabel(COLUMN_POSITIONS[0], 'M', beadColors.thousands)}
        {renderLabel(COLUMN_POSITIONS[1], 'S', beadColors.hundreds)}
        {renderLabel(COLUMN_POSITIONS[2], 'Z', beadColors.tens)}
        {/* Use translation keys for labels */}
        {renderLabel(COLUMN_POSITIONS[0], t('place_value_label_thousands'), beadColors.thousands)}
        {renderLabel(COLUMN_POSITIONS[1], t('place_value_label_hundreds'), beadColors.hundreds)}
        {renderLabel(COLUMN_POSITIONS[2], t('place_value_label_tens'), beadColors.tens)}
        {renderLabel(COLUMN_POSITIONS[3], t('place_value_label_units'), beadColors.units)}
      </group>
    </>
  );

  function renderColumn(x, count, columnName, color) {
    const columnElements = [];
    const rodYPosition = 0; // Rod centered vertically

    // Render the rod
    columnElements.push(
      <mesh key={`rod-${columnName}`} position={[x, rodYPosition, 0]} receiveShadow>
        <cylinderGeometry args={[ROD_RADIUS, ROD_RADIUS, ROD_HEIGHT, 16]} />
        <meshStandardMaterial color="#777" metalness={0.6} roughness={0.4} />
      </mesh>
    );

    // Render the beads using the animated Bead component
    const startY = rodYPosition - ROD_HEIGHT / 2 + BEAD_SPACING / 2; // Start from bottom
    for (let i = 0; i < 9; i++) { // Always render 9 bead slots for animation
      const isActive = i < count;
      const targetY = isActive
        ? startY + i * BEAD_SPACING // Active beads at the bottom
        : rodYPosition + ROD_HEIGHT / 2 - (9 - 1 - i) * BEAD_SPACING - BEAD_SPACING / 2; // Inactive beads at the top

      // Determine the color based on active state
      const beadColor = isActive ? color : paleBeadColors[columnName];

      columnElements.push(
        <Bead
          key={`bead-${columnName}-${i}`}
          position={[x, targetY, 0]} // Initial position (will be animated)
          color={beadColor} // Use the determined color
          onClick={() => {
            playSound(isActive ? 'beadRemove' : 'beadPlace', gameState.sound);
            // If clicking an active bead (i < count), remove it (set count to i)
            // If clicking an inactive bead (i >= count), add up to it (set count to i + 1)
            onBeadChange(columnName, isActive ? i : i + 1);
          }}
          columnName={columnName}
          index={i}
        />
      );
    }

    return columnElements;
  }

  function renderLabel(x, text, color) {
    // Using Drei's Text component for better rendering
    return (
      <Text
        position={[x, -ROD_HEIGHT / 2 - FRAME_HEIGHT * 1.5, FRAME_DEPTH / 2 + 0.1]} // Position below bottom frame, slightly in front
        fontSize={0.5}
        color="black" // Keep text color consistent or use label color
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    );
  }
};

export default AbacusModel;
