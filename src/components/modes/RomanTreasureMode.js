import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRomanTreasureGame } from '../../hooks/useRomanTreasureGame';
import TreasureReward from '../ui/TreasureReward'; // Reusable component

// Import game-specific components
import Ruins from '../roman/Ruins';
import PuzzleCard from '../roman/PuzzleCard';
import AnaCharacterRoman from '../roman/AnaCharacterRoman';
import RobiCharacter from '../roman/RobiCharacter';
import RomanOptions from '../roman/RomanOptions';
import TreasureLog from '../roman/TreasureLog';

// Import styles (optional main style for the mode)
// import '../../styles/RomanTreasureMode.css';

const RomanTreasureMode = () => {
  const { t } = useTranslation();
  const {
    level,
    treasures,
    currentTask,
    // taskProgress, // Removed unused variable
    // levelGoal, // Removed unused variable
    feedback,
    isCorrect,
    showRobi,
    robiHint,
    gamePhase,
    showLevelComplete,
    handleAnswer,
    nextLevel,
    restartGame,
  } = useRomanTreasureGame(); // Assuming default sound setting

  const getAnaMessage = () => {
    if (!currentTask) return t('roman_treasure.loading');

    if (isCorrect === true) return t('roman_treasure.ana_correct');
    if (isCorrect === false) return t('roman_treasure.ana_incorrect');

    switch (currentTask.type) {
      case 'match_symbol':
        return t('roman_treasure.ana_level1', { symbol: currentTask.question });
      case 'build_add':
      case 'write_subtract':
      case 'write_mixed':
      case 'write_challenge':
        return t('roman_treasure.ana_write', { number: currentTask.question });
      case 'read_subtract':
      case 'read_mixed':
      case 'read_challenge':
        return t('roman_treasure.ana_read', { roman: currentTask.question });
      default:
        return t('roman_treasure.ana_default');
    }
  };

  const getAnaMood = () => {
    if (isCorrect === true) return 'happy';
    if (isCorrect === false) return 'wrong';
    return 'normal'; // or 'explaining' based on context?
  };

  if (gamePhase === 'loading') {
    return <div>{t('roman_treasure.loading')}...</div>; // TODO: Add proper loading indicator
  }

  if (gamePhase === 'game_over') {
    return (
      <div>
        <h2>{t('roman_treasure.game_over_title')}</h2>
        <p>{t('roman_treasure.game_over_message', { treasures: treasures })}</p>
        <button onClick={restartGame}>{t('roman_treasure.play_again')}</button>
      </div>
    );
  }

  if (gamePhase === 'error') {
      return <div>{t('roman_treasure.error_loading')}</div>;
  }

  return (
    <div className="roman-treasure-mode">
      {/* Header/Log could go here */}
      <TreasureLog treasures={treasures} level={level} />

      <Ruins isAnswerCorrect={isCorrect}>
        <div className="game-area">
          {/* Characters & Interactive Elements */}
          <AnaCharacterRoman message={getAnaMessage()} mood={getAnaMood()} />

          {/* Grouping Puzzle, Options, and Treasure Chest */}
          <div className="puzzle-treasure-group">
            {currentTask && (
              <>
                <PuzzleCard task={currentTask} />
                <RomanOptions
                  options={currentTask.options}
                  onSelect={handleAnswer}
                  disabled={isCorrect !== null} // Disable options after answer
                />
              </>
            )}
            {/* Treasure Chest Container - For stable positioning */}
            <div className="treasure-chest-container">
              {/* Closed Chest Image */}
              <img
                className={`treasure-chest ${isCorrect ? 'hidden' : ''}`}
                src={`${process.env.PUBLIC_URL}/assets/images/treasure-closed.png`}
                alt={t('roman_treasure.treasure_chest_closed_alt', 'Closed Treasure Chest')}
              />
              {/* Open Chest Image */}
              <img
                className={`treasure-chest treasure-chest-open ${!isCorrect ? 'hidden' : ''}`}
                src={`${process.env.PUBLIC_URL}/assets/images/treasure-open.png`}
                alt={t('roman_treasure.treasure_chest_open_alt', 'Open Treasure Chest')}
              />
            </div>
          </div>

          {/* Robi Character (Conditional) */}
          {showRobi && <RobiCharacter message={t('roman_treasure.robi_greeting')} hint={robiHint} />}
        </div>

        {/* Feedback Display (Outside game-area but inside Ruins) */}
        {feedback && (
          <div className={`feedback-display ${isCorrect ? 'correct' : 'incorrect'}`}>
            {feedback}
          </div>
        )}
      </Ruins>

      {/* Level Complete Modal */}
      <TreasureReward
        show={showLevelComplete}
        level={level}
        onClose={nextLevel}
        // sound={soundEnabled} // Pass sound setting if available globally
      />
    </div>
  );
};

export default RomanTreasureMode;
