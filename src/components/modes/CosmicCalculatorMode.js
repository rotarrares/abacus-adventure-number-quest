import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCosmicCalculatorGame } from '../../hooks/useCosmicCalculatorGame';
import { LEVEL_CONFIG, CHARACTER_MESSAGE_KEYS } from '../../constants/cosmicCalculatorConstants';

// Import UI Components
import LevelBackground from '../cosmic_calculator/LevelBackground';
import Spaceship from '../cosmic_calculator/Spaceship';
import CalculatorDisplay from '../cosmic_calculator/CalculatorDisplay';
import AnswerOptions from '../cosmic_calculator/AnswerOptions';
import Scoreboard from '../cosmic_calculator/Scoreboard';
import RobiCharacter from '../cosmic_calculator/RobiCharacter';
import AnaCharacter from '../cosmic_calculator/AnaCharacter';
import TreasureReward from '../ui/TreasureReward'; // Reusing this for level complete

// Import Styles (optional main style for the mode)
// import '../../styles/CosmicCalculatorMode.css';

const CosmicCalculatorMode = () => {
  const { t } = useTranslation();
  const {
    level,
    starCoins,
    currentProblem,
    problemProgress,
    gamePhase,
    animationState,
    feedback,
    shipUpgrades, // Use this for spaceship appearance if needed
    error,
    // Actions
    startBreakdownAnimation, // We might trigger this automatically or via UI
    handleAnswer,
    nextLevel,
    restartGame,
  } = useCosmicCalculatorGame(); // Assuming default sound setting

  // --- Render Logic based on Game Phase ---

  if (gamePhase === 'loading') {
    return <div>{t(CHARACTER_MESSAGE_KEYS.GENERAL_LOADING)}...</div>; // TODO: Add styled loading indicator
  }

  if (gamePhase === 'error') {
    return <div>Error: {error || t('cosmic_calculator.general_error')}</div>; // Display specific error
  }

  if (gamePhase === 'game_over') {
    return (
      <div className="game-over-screen"> {/* TODO: Style this screen */}
        <h2>{t(CHARACTER_MESSAGE_KEYS.GENERAL_GAME_OVER_TITLE)}</h2>
        <p>{t(CHARACTER_MESSAGE_KEYS.GENERAL_GAME_OVER_MESSAGE, { starCoins: starCoins })}</p>
        <button onClick={restartGame}>{t(CHARACTER_MESSAGE_KEYS.GENERAL_PLAY_AGAIN)}</button>
      </div>
    );
  }

  // --- Determine Character States ---
  // TODO: Refine mood logic based on gamePhase, feedback, etc.
  let robiMood = 'default';
  let anaMood = 'default';
  let robiMessageKey = CHARACTER_MESSAGE_KEYS.ROBI_GREETING; // Default message
  let anaMessageKey = CHARACTER_MESSAGE_KEYS.ANA_GREETING; // Default message
  const currentLevelConfig = LEVEL_CONFIG.find(l => l.level === level);
  const zoneNameKey = currentLevelConfig ? `cosmic_calculator.zone_${currentLevelConfig.zoneName.toLowerCase().replace(/ /g, '_')}` : '';
  let messageParams = { level: level, zoneName: t(zoneNameKey) }; // Translate the constructed key

  if (gamePhase === 'showing_feedback' && feedback) {
    robiMood = feedback.isCorrect ? 'happy' : 'surprised';
    anaMood = feedback.isCorrect ? 'happy' : 'cheeky'; // Example moods
    robiMessageKey = feedback.isCorrect ? CHARACTER_MESSAGE_KEYS.ROBI_CORRECT : CHARACTER_MESSAGE_KEYS.ROBI_INCORRECT;
    anaMessageKey = feedback.isCorrect ? CHARACTER_MESSAGE_KEYS.ANA_CORRECT : CHARACTER_MESSAGE_KEYS.ANA_INCORRECT;
  } else if (gamePhase === 'animating_breakdown') {
     robiMood = 'thinking';
     anaMood = 'explaining';
     // Maybe show specific messages during breakdown steps?
  }
  // Add more conditions for different phases/hints

  // --- Main Game Render ---
  const levelConfig = LEVEL_CONFIG.find(l => l.level === level);
  const numDigits = levelConfig?.numDigits || 1;

  return (
    <LevelBackground level={level}>
      <Scoreboard
        starCoins={starCoins}
        progressCurrent={problemProgress.current}
        progressTotal={problemProgress.total}
      />

      <div className="game-area"> {/* TODO: Define layout styles for game-area */}
        <Spaceship
           isCorrect={feedback?.isCorrect}
           upgrades={shipUpgrades}
        />

        {currentProblem && (
          <div className="calculator-interaction-area"> {/* Added wrapper div */}
            <CalculatorDisplay
              num1={currentProblem.num1}
              num2={currentProblem.num2}
              animationState={animationState}
              numDigits={numDigits}
            />
            {/* Animation is now triggered by handleAnswer in the hook */}

            {gamePhase === 'awaiting_input' && (
              <AnswerOptions
                options={currentProblem.options}
                onSelect={handleAnswer}
                disabled={false} // Enable when awaiting input
                feedback={null} // No feedback before selection
              />
            )}
             {gamePhase === 'showing_feedback' && (
               <AnswerOptions
                 options={currentProblem.options}
                 onSelect={() => {}} // No action when showing feedback
                 disabled={true} // Disable after selection
                 feedback={{ // Pass feedback details for styling
                     isCorrect: feedback.isCorrect,
                     selectedOption: feedback.selectedOption,
                     correctAnswer: currentProblem.correctAnswer
                 }}
               />
             )}
          </div> /* Closing wrapper div */
        )}

        {/* Position characters */}
        <RobiCharacter messageKey={robiMessageKey} messageParams={messageParams} mood={robiMood} />
        <AnaCharacter messageKey={anaMessageKey} messageParams={messageParams} mood={anaMood} />

      </div>

      {/* Level Complete Modal */}
      <TreasureReward
        show={gamePhase === 'level_complete'}
        level={level} // Pass level completed
        // Pass score earned this level if calculated in hook, otherwise just show total
        // score={starCoinsEarnedThisLevel}
        onClose={nextLevel} // Proceed to next level or game over
        titleKey={CHARACTER_MESSAGE_KEYS.GENERAL_LEVEL_COMPLETE_TITLE}
        messageKey={CHARACTER_MESSAGE_KEYS.GENERAL_LEVEL_COMPLETE_MESSAGE}
        buttonTextKey={CHARACTER_MESSAGE_KEYS.GENERAL_CONTINUE}
      />
    </LevelBackground>
  );
};

export default CosmicCalculatorMode;