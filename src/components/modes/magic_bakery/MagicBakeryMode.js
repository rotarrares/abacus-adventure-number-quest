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
// import RecipeBook from './RecipeBook'; // Keep commented for now, add later
import '../../../styles/magic_bakery/MagicBakery.css';
import '../../../styles/magic_bakery/Ingredients.css'; // Import sub-component styles
import '../../../styles/magic_bakery/MixingBowl.css';
import '../../../styles/magic_bakery/Characters.css';

const MagicBakeryMode = () => {
  const { gameState } = useGameContext(); // Only need gameState here for level display
  const { t } = useTranslation();
  const gameLogic = useMagicBakeryGame(); // Initialize the game hook

  // Combine result digits into a displayable string (or handle in MixingBowl)
  const displayResult = [
      gameLogic.resultDigits.thousands,
      gameLogic.resultDigits.hundreds,
      gameLogic.resultDigits.tens,
      gameLogic.resultDigits.units
  ].filter(d => d !== null).join('') || t('magic_bakery.result_placeholder');

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
        />

        <IngredientJars num1={gameLogic.num1} num2={gameLogic.num2} />

        <MixingBowl
          currentStep={gameLogic.currentStep}
          carryOver={gameLogic.carryOver}
          resultDigits={displayResult} // Pass combined result string
          onMixClick={gameLogic.currentStep !== 'done' && gameLogic.feedback !== 'correct' ? gameLogic.handleMixStep : null} // Only allow mixing before 'done' or correct
        />

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

        {/* Display Baked Treat Reward */}
        {gameLogic.bakedTreatImage && (
          <div className="baked-treat-container">
            <img src={gameLogic.bakedTreatImage} alt={t('magic_bakery.baked_treat_reward_alt')} className="baked-treat" loading="lazy" />
          </div>
        )}

        {/* RecipeBook can be added here later */}
        {/* <RecipeBook completedRecipes={...} /> */}

      </Bakery>
    </div>
  );
};

export default MagicBakeryMode;