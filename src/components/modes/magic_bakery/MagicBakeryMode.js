import React from 'react';
import { useGameContext } from '../../../context/GameContext';
import { useTranslation } from 'react-i18next';
// Import game hook
import useMagicBakeryGame from '../../../hooks/useMagicBakeryGame';
// Import sub-components
import Bakery from './Bakery';
import IngredientJars from './IngredientJars';
import MixingBowl from './MixingBowl';
import RobiAnaCharacters from './RobiAnaCharacters';
import AnswerOptions from './AnswerOptions'; // Assuming multiple choice for now
import TreasureReward from '../../ui/TreasureReward'; // Import TreasureReward
// import RecipeBook from './RecipeBook'; // Keep commented for now, add later
import '../../../styles/magic_bakery/MagicBakery.css';
import '../../../styles/magic_bakery/Ingredients.css'; // Import sub-component styles
import '../../../styles/magic_bakery/MixingBowl.css';
import '../../../styles/magic_bakery/Characters.css';

const MagicBakeryMode = () => {
  const { gameState } = useGameContext();
  const { level, sound } = gameState; // Get level and sound for TreasureReward
  const { t } = useTranslation();
  const gameLogic = useMagicBakeryGame(); // Initialize the game hook

  // Result digits object is now passed directly to MixingBowl
  // const displayResult = [ ... ]; // No longer needed here

  // Placeholder answer options (replace with logic later)
  const answerOptions = gameLogic.currentStep === 'done' && gameLogic.feedback !== 'correct'
    ? [gameLogic.num1 + gameLogic.num2, gameLogic.num1 + gameLogic.num2 + 10, gameLogic.num1 + gameLogic.num2 - 1].sort(() => Math.random() - 0.5)
    : [];

  return (
    <div className="magic-bakery-mode">

      <Bakery> {/* Wrap content in Bakery theme */}
        <RobiAnaCharacters
          message={gameLogic.message}
          robiSpeaking={gameLogic.robiSpeaking}
          robiMood={gameLogic.robiMood} // Pass Robi's mood
          anaMood={gameLogic.anaMood}   // Pass Ana's mood
        />

        <IngredientJars num1={gameLogic.num1} num2={gameLogic.num2} />

        {/* Main Interaction Area: Show Mixing Bowl OR Baked Treat */}
        {gameLogic.bakedTreatImage ? (
          <div className="baked-treat-container main-display-area"> {/* Reuse container or create specific style */}
            <img src={gameLogic.bakedTreatImage} alt={t('magic_bakery.baked_treat_reward_alt')} className="baked-treat" loading="lazy" />
          </div>
        ) : (
          <MixingBowl
            num1={gameLogic.num1} // Pass num1
            num2={gameLogic.num2} // Pass num2
            currentStep={gameLogic.currentStep}
            carryOver={gameLogic.carryOver}
            resultDigits={gameLogic.resultDigits} // Pass the result digits object
            onMixClick={gameLogic.currentStep !== 'done' && gameLogic.feedback !== 'correct' ? gameLogic.handleMixStep : null} // Only allow mixing before 'done' or correct
          />
        )}

        {/* Show answer options only when mixing is done and not yet correct */}
        {gameLogic.currentStep === 'done' && gameLogic.feedback !== 'correct' && (
           <AnswerOptions
             options={answerOptions}
             onSelectAnswer={gameLogic.checkFinalAnswer}
             disabled={gameLogic.feedback === 'correct'} // Disable after correct answer
           />
        )}

        {/* Feedback Indicator */}
        {gameLogic.feedback === 'correct' && <div className="feedback correct">{t('magic_bakery.feedback_correct_short')}</div>}
        {gameLogic.feedback === 'incorrect' && <div className="feedback incorrect">{t('magic_bakery.feedback_incorrect_short')}</div>}

        {/* Baked Treat Reward is now handled conditionally above */}

        {/* RecipeBook can be added here later */}
        {/* <RecipeBook completedRecipes={...} /> */}

        {/* Render Treasure Reward Modal */}
        <TreasureReward
          show={gameLogic.showTreasure}
          level={level} // Pass current level
          onClose={gameLogic.handleCloseTreasure}
          sound={sound} // Pass sound setting
        />
      </Bakery>
    </div>
  );
};

export default MagicBakeryMode;