import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import * as roundingConstants from '../../constants/roundingConstants';
import '../../styles/rounding/PlaceValueDragger.css';

// --- Draggable Digit Component ---
function DraggableDigit({ id, value, isDragging }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: { value: value } // Pass value in data if needed
  });

  const style = {
    // Use transform for smooth movement
    transform: CSS.Translate.toString(transform),
    // Add opacity or other styles when dragging
    opacity: isDragging ? 0.5 : 1,
    touchAction: 'none', // Important for mobile interaction
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="digit-box draggable" // Keep original classes for styling
    >
      {value}
    </div>
  );
}

// --- Droppable Target Component ---
function DroppableTarget({ id, placeKey, children, isOver }) {
    const { setNodeRef } = useDroppable({
        id: id, // Use placeKey as the unique ID for the droppable area
        data: { placeKey: placeKey } // Pass placeKey in data
    });

    return (
        <div
            ref={setNodeRef}
            className={`target-box droppable ${isOver ? 'drag-over' : ''} ${children ? 'filled' : ''}`} // Add drag-over class based on isOver
        >
            {children}
        </div>
    );
}


// --- Main PlaceValueDragger Component ---
const PlaceValueDragger = ({ number, onDrop, feedback, resetSignal }) => {
  const { t } = useTranslation();
  const numberString = number.toString();

  // Memoize initial digits creation
  const initialDigits = useMemo(() =>
    numberString.split('').map((digit, index) => ({ id: `digit-${digit}-${index}`, value: digit })),
    [numberString]
  );

  // Memoize place value keys
  const placeValueKeys = useMemo(() => {
    const keys = ['place_value_units', 'place_value_tens', 'place_value_hundreds', 'place_value_thousands'];
    return keys.slice(0, numberString.length).reverse();
  }, [numberString.length]);

  // State: { targetPlaceKey: digitId }
  const [placements, setPlacements] = useState({});
  // State: array of { id, value }
  const [availableDigits, setAvailableDigits] = useState(initialDigits);
  // State to track the currently dragged item's ID
  const [activeId, setActiveId] = useState(null);
  // State to track the droppable area the item is currently over
  const [overId, setOverId] = useState(null);


  // Reset state logic
  const resetState = useCallback(() => {
    setAvailableDigits(initialDigits);
    setPlacements({});
    setActiveId(null);
    setOverId(null);
  }, [initialDigits]);

  // Reset on number change or reset signal
  useEffect(() => {
    resetState();
  }, [number, resetSignal, resetState]);

  // Setup sensors for pointer (mouse/touch) and keyboard
  const sensors = useSensors(
    useSensor(PointerSensor, {
        // Require the mouse to move by 10 pixels before activating
        // Improves behavior on touchscreens and prevents accidental drags
        activationConstraint: {
          distance: 10,
        },
      }),
    useSensor(KeyboardSensor) // For accessibility
  );

  // --- Drag Handlers for DndContext ---
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    setOverId(null); // Reset overId on new drag start
  };

   const handleDragOver = (event) => {
        const { over } = event;
        setOverId(over ? over.id : null);
    };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null); // Reset activeId
    setOverId(null); // Reset overId

    if (over && active.id) {
      const digitId = active.id;
      const targetPlaceKey = over.id; // Droppable ID is the placeKey

      // Find the digit object being dragged
      const draggedDigit = initialDigits.find(d => d.id === digitId);

      // Check if the target is valid and not already filled by the *same* digit
      if (!draggedDigit || placements[targetPlaceKey] === digitId) {
        return; // Invalid drop or dropping onto its own spot
      }

      // --- Calculate Next State ---
      let nextPlacements = { ...placements };
      let nextAvailableDigits = [...availableDigits];

      // 1. Find previous location of the dragged digit
      const previousPlaceKey = Object.keys(nextPlacements).find(key => nextPlacements[key] === digitId);

      // 2. Check if the target is already occupied
      const existingDigitIdInTarget = nextPlacements[targetPlaceKey];

      // 3. Remove the dragged digit from its previous target (if any)
      if (previousPlaceKey) {
        delete nextPlacements[previousPlaceKey];
      }

      // 4. Handle swap if target was occupied
      let digitToMakeAvailable = null;
      if (existingDigitIdInTarget) {
        if (previousPlaceKey) {
          // Put the existing digit from the target into the dragged digit's old spot
          nextPlacements[previousPlaceKey] = existingDigitIdInTarget;
        } else {
          // The dragged digit came from the available pool, so the existing target digit goes back
          digitToMakeAvailable = initialDigits.find(d => d.id === existingDigitIdInTarget);
        }
      }

      // 5. Place the dragged digit in the new target
      nextPlacements[targetPlaceKey] = digitId;

      // 6. Update available digits
      // Remove the dragged digit
      nextAvailableDigits = nextAvailableDigits.filter(d => d.id !== digitId);
      // Add back the swapped digit if necessary
      if (digitToMakeAvailable) {
        nextAvailableDigits = [...nextAvailableDigits, digitToMakeAvailable];
      }

      // --- Update State ---
      setPlacements(nextPlacements);
      setAvailableDigits(nextAvailableDigits);

      // --- Check for Completion ---
      if (Object.keys(nextPlacements).length === numberString.length) {
        const resultPairs = [];
        const placeKeyToNameMap = {
            'place_value_units': roundingConstants.PLACE_VALUE_NAMES.units,
            'place_value_tens': roundingConstants.PLACE_VALUE_NAMES.tens,
            'place_value_hundreds': roundingConstants.PLACE_VALUE_NAMES.hundreds,
            'place_value_thousands': roundingConstants.PLACE_VALUE_NAMES.thousands,
          };

          Object.entries(nextPlacements).forEach(([placeKey, dId]) => {
            const digitObj = initialDigits.find(d => d.id === dId);
            const placeName = placeKeyToNameMap[placeKey];
            if (digitObj && placeName) {
              resultPairs.push([digitObj.value, placeName]);
            } else {
              console.warn(`Could not find digit or map place key: ${placeKey}`);
            }
          });
          // Ensure onDrop is called *after* state updates are scheduled
          // Using setTimeout ensures it happens in the next tick, after the current render cycle.
          setTimeout(() => onDrop(resultPairs), 0);
        }
      }
    };

  // Helper to find the digit object placed in a target
  const getPlacedDigit = (targetPlaceKey) => {
    const digitId = placements[targetPlaceKey];
    return initialDigits.find(d => d.id === digitId);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver} // Add onDragOver handler
    >
      <div className="place-value-dragger-container">
        <p className="instructions">{t('rounding_place_value_instruction')}</p>

        {/* Available Digits */}
        <div className="draggable-digits">
          {availableDigits.map((digit) => (
            <DraggableDigit
              key={digit.id}
              id={digit.id}
              value={digit.value}
              isDragging={activeId === digit.id}
            />
          ))}
          {availableDigits.length === 0 && <span className="placeholder-text">{t('rounding_place_value_all_placed')}</span>}
        </div>

        {/* Target Boxes */}
        <div className="droppable-targets">
          {placeValueKeys.map((placeKey) => {
            const placedDigit = getPlacedDigit(placeKey);
            return (
              <DroppableTarget
                key={placeKey}
                id={placeKey} // Use placeKey as the unique ID
                placeKey={placeKey}
                isOver={overId === placeKey} // Pass isOver state
              >
                {/* Label */}
                <span className="target-label">{t(placeKey)}</span>
                {/* Placed Digit (if any) */}
                {placedDigit && (
                   // Render the digit directly, it's not draggable from here
                   <div className="digit-box placed">
                     {placedDigit.value}
                   </div>
                )}
              </DroppableTarget>
            );
          })}
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`feedback-message ${feedback.type}`}>
            {feedback.message}
          </div>
        )}
      </div>
    </DndContext>
  );
};

export default PlaceValueDragger;
