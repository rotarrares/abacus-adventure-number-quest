import React, { useContext } from 'react'; // Import useContext
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { GameContext, actions } from '../../context/GameContext'; // Import context and actions
import * as roundingConstants from '../../constants/roundingConstants';
import useRoundingGame from '../../hooks/useRoundingGame';
import Garden from '../rounding/Garden';
import Scoreboard from '../rounding/Scoreboard';
import AnaCharacter from '../rounding/AnaCharacter';
import NumberCard from '../rounding/NumberCard';
import RoundingOptions from '../rounding/RoundingOptions';
import PlaceValueDragger from '../rounding/PlaceValueDragger';
import '../../styles/RoundingNumbersMode.css'; // Ensure this file exists or is created

const RoundingNumbersMode = () => {
  const { gameState, dispatch } = useContext(GameContext); // Get context
  const { level: initialLevelFromContext } = gameState; // Get initial level from context
  const { t } = useTranslation(); // Get translation function

  // Pass the initial level from context to the hook
  const {
    level, // This will now reflect the level managed *within* the hook
    currentNumber,
    targetPlace, // e.g., 'tens', 'hundreds', 'thousands'
    options, // rounding choices or place value targets
    score,
    progress, // e.g., flowers grown in current level
    feedback, // { type: 'correct' | 'incorrect', message: '...', selectedOption: ... }
    anaMessage,
    isLevelComplete,
    levelGoal,
    handleOptionSelect, // For levels 2-5
    handleDragDrop, // For level 1
    // advanceLevel, // advanceLevel is handled internally by the hook's effect
    resetLevel1Signal, // Get the reset signal
  } = useRoundingGame(); // Hook now uses context level directly

  // Derive completion status locally for rendering purposes
  const isLevelActuallyComplete = progress >= levelGoal;

  console.log("RoundingNumbersMode rendering - Context Level:", level, "Progress:", progress, "Goal:", levelGoal, "Derived Complete:", isLevelActuallyComplete, "Number:", currentNumber); // Updated log

  // Display loading or initial state if number isn't ready yet
  if (currentNumber === null && level <= Object.keys(roundingConstants.LEVELS).length) { // Check if game is not complete
    return <div className="rounding-numbers-mode loading">{t('rounding_loading')}</div>;
  }

  // Handle game completion state
  if (currentNumber === null && level > Object.keys(roundingConstants.LEVELS).length) {
      return (
          <div className="rounding-numbers-mode game-complete">
              <h2>{t('rounding_game_complete')}</h2>
              {/* Optionally add final score or other elements */}
          </div>
      );
  }

  // Determine Ana's mood based on feedback and message
  let anaMood = 'normal';
  if (feedback) {
    if (feedback.type === 'correct') {
      anaMood = 'happy';
    } else if (feedback.type === 'incorrect') {
      anaMood = 'wrong';
    }
  } else if (anaMessage) { // If no feedback, but there's a message, she's explaining
    anaMood = 'explaining';
  }

  return (
    <div className="rounding-numbers-mode">
      <Scoreboard score={score} progress={progress} level={level} levelGoal={levelGoal} />
      <Garden>
        {/* Position Ana and the Number Card appropriately within the Garden */}
        <div className="game-area">
            <AnaCharacter message={anaMessage} mood={anaMood} /> {/* Pass the mood prop */}
            <NumberCard number={currentNumber} highlightDigit={targetPlace} />
        </div>

        {/* Render interaction component based on level AND derived completion status */}
        {level === 1 && !isLevelActuallyComplete && (
          <PlaceValueDragger number={currentNumber} onDrop={handleDragDrop} feedback={feedback} resetSignal={resetLevel1Signal} />
        )}

        {level > 1 && !isLevelActuallyComplete && (
          <RoundingOptions options={options} onSelect={handleOptionSelect} feedback={feedback} />
        )}

        {/* Level completion message is handled by AnaCharacter via anaMessage */}
        {/* Automatic advancement is handled by the useRoundingGame hook */}
      </Garden>
    </div>
  );
};

export default RoundingNumbersMode;
