import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { useGameContext } from '../context/GameContext';
// Import utility functions if needed (e.g., for number generation)
// import { generateAdditionProblem } from '../utils/magicBakeryUtils'; // To be created

const useMagicBakeryGame = () => {
  const { t } = useTranslation(); // Get the translation function
  const { gameState, dispatch, actions } = useGameContext();
  const { level, sound } = gameState;

  // State for the current problem
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [correctSum, setCorrectSum] = useState(0);

  // State for the step-by-step process
  const [currentStep, setCurrentStep] = useState('units'); // 'units', 'tens', 'hundreds', 'thousands', 'done'
  const [carryOver, setCarryOver] = useState(0);
  const [resultDigits, setResultDigits] = useState({ units: null, tens: null, hundreds: null, thousands: null });
  const [userInput, setUserInput] = useState(''); // For potential direct input answer

  // State for feedback and character messages
  const [message, setMessage] = useState('');
  const [robiSpeaking, setRobiSpeaking] = useState(true); // Or Ana starts
  const [feedback, setFeedback] = useState(''); // 'correct', 'incorrect', ''
  const [bakedTreatImage, setBakedTreatImage] = useState(null); // State for the individual treat image
  const [robiMood, setRobiMood] = useState('neutral'); // 'neutral', 'happy', 'wrong', 'explain'
  const [anaMood, setAnaMood] = useState('neutral'); // 'neutral', 'happy', 'thinking', 'explains'
  const [showTreasure, setShowTreasure] = useState(false); // State for treasure reward modal

  // Function to generate a new problem based on the level
  // --- Constants ---
  const MAX_LEVEL = 30; // Define the maximum level

  // --- Problem Generation ---
  const generateProblem = useCallback(() => {
    console.log(`Generating problem for level ${level}`);
    let n1 = 0, n2 = 0, sum = 0;

    // Function to generate numbers ensuring carry-over at a specific place value
    const generateWithCarry = (placeValue) => {
      let num1 = 0, num2 = 0;
      let digit1 = 0, digit2 = 0;
      // Adjust maxVal based on placeValue to allow for larger numbers later
      const maxDigits = placeValue <= 1 ? 2 : (placeValue === 2 ? 3 : 4); // Up to 4 digits
      const maxVal = Math.pow(10, maxDigits) - 1; // e.g., placeValue 0 -> max 99, placeValue 2 -> max 999
      const minVal = placeValue > 0 ? Math.pow(10, maxDigits - 1) : 10; // Ensure minimum digits

      do {
        num1 = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
        num2 = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
        // Ensure the sum doesn't exceed 10000 for simplicity
        // Ensure sum doesn't exceed 9999 for 4-digit display consistency
        if (num1 + num2 > 9999) continue;

        const s1 = String(num1).padStart(4, '0');
        const s2 = String(num2).padStart(4, '0');
        let carry = 0;
        let carryGenerated = false;

        // Check carry-over up to the target place value
        for (let i = 3; i >= (3 - placeValue); i--) {
            digit1 = parseInt(s1[i]);
            digit2 = parseInt(s2[i]);
            let digitSum = digit1 + digit2 + carry;
            carry = Math.floor(digitSum / 10);
            if (carry > 0 && i === (3 - placeValue)) {
                carryGenerated = true;
            }
        }
        if (carryGenerated) break; // Found a suitable pair

      } while (true);
      return { n1: num1, n2: num2, sum: num1 + num2 };
    };

    // Difficulty Scaling Logic (Example)
    if (level <= 5) { // Levels 1-5: Basic units carry
      ({ n1, n2, sum } = generateWithCarry(0));
    } else if (level <= 10) { // Levels 6-10: Tens carry
      ({ n1, n2, sum } = generateWithCarry(1));
    } else if (level <= 15) { // Levels 11-15: Hundreds carry
      ({ n1, n2, sum } = generateWithCarry(2));
    } else if (level <= 20) { // Levels 16-20: Multiple carries (simple 4-digit)
       do {
          n1 = Math.floor(Math.random() * 2000) + 1000; // 1000-2999
          n2 = Math.floor(Math.random() * 2000) + 1000;
          sum = n1 + n2;
          if (sum > 9999) continue; // Ensure sum fits
          const s1 = String(n1).padStart(4, '0');
          const s2 = String(n2).padStart(4, '0');
          let carryCount = 0; let currentCarry = 0;
          for (let i = 3; i >= 1; i--) {
              let digitSum = parseInt(s1[i]) + parseInt(s2[i]) + currentCarry;
              currentCarry = Math.floor(digitSum / 10);
              if (currentCarry > 0) carryCount++;
          }
          if (carryCount >= 2) break;
       } while(true);
    } else if (level <= 25) { // Levels 21-25: Larger 4-digit, multiple carries
       do {
          n1 = Math.floor(Math.random() * 4000) + 1000; // 1000-4999
          n2 = Math.floor(Math.random() * 4000) + 1000;
          sum = n1 + n2;
          if (sum > 9999) continue;
          const s1 = String(n1).padStart(4, '0');
          const s2 = String(n2).padStart(4, '0');
          let carryCount = 0; let currentCarry = 0;
          for (let i = 3; i >= 1; i--) {
              let digitSum = parseInt(s1[i]) + parseInt(s2[i]) + currentCarry;
              currentCarry = Math.floor(digitSum / 10);
              if (currentCarry > 0) carryCount++;
          }
          if (carryCount >= 2) break;
       } while(true);
    } else { // Levels 26-30: Edge cases / Max difficulty within 4 digits
        const type = Math.random();
        if (type < 0.5) { // Sum is near 9999
            n1 = Math.floor(Math.random() * 500) + 9000; // 9000-9499
            n2 = Math.floor(Math.random() * (9999 - n1)) + 500; // Ensure sum <= 9999
        } else { // Multiple complex carries
            n1 = Math.floor(Math.random() * 1000) + 8900; // 8900-9899
            n2 = Math.floor(Math.random() * 100) + 90;   // 90-189
        }
        sum = n1 + n2;
        if (sum > 9999) { // Recalculate if sum exceeds max
            n1 = 5000; n2 = 4999; sum = 9999; // Fallback
        }
    }

    setNum1(n1);
    setNum2(n2);
    setCorrectSum(sum);
    setCurrentStep('units');
    setCarryOver(0);
    setResultDigits({ units: null, tens: null, hundreds: null, thousands: null });
    setUserInput('');
    setFeedback('');
    setBakedTreatImage(null); // Reset treat image
    setShowTreasure(false); // Ensure treasure is hidden on new problem
    const initialSpeakerIsRobi = Math.random() < 0.5;
    setRobiSpeaking(initialSpeakerIsRobi);
    setRobiMood(initialSpeakerIsRobi ? 'explain' : 'neutral');
    setAnaMood(!initialSpeakerIsRobi ? 'explains' : 'neutral');
    setMessage(t('magic_bakery.initial_prompt', { num1: n1, num2: n2 }));
  }, [level, t]);

  // Effect to generate a new problem when the level changes
  useEffect(() => {
    generateProblem();
  }, [level, generateProblem]);

  // Function to handle the "Mix" action for the current step
  const handleMixStep = useCallback(() => {
    if (feedback === 'correct') return; // Don't allow mixing after correct answer

    setFeedback(''); // Clear previous feedback
    // TODO: Implement step-by-step addition logic
    console.log(`Mixing step: ${currentStep}`);
    let currentCarry = carryOver;
    let digitSum = 0;
    let placeResult = 0;
    let nextStep = currentStep;
    let newResultDigits = { ...resultDigits };

    const n1Str = String(num1).padStart(4, '0');
    const n2Str = String(num2).padStart(4, '0');

    switch (currentStep) {
      case 'units':
        digitSum = parseInt(n1Str[3]) + parseInt(n2Str[3]) + currentCarry;
        placeResult = digitSum % 10;
        setCarryOver(Math.floor(digitSum / 10));
        newResultDigits.units = placeResult;
        // Determine next step based on whether numbers have higher place values
        nextStep = (num1 > 9 || num2 > 9 || correctSum > 9) ? 'tens' : 'done';
        setMessage(t('magic_bakery.step_units', { n1u: n1Str[3], n2u: n2Str[3], sum: digitSum, result: placeResult, carry: Math.floor(digitSum / 10) }));
        break;
      case 'tens':
         digitSum = parseInt(n1Str[2]) + parseInt(n2Str[2]) + currentCarry;
         placeResult = digitSum % 10;
         setCarryOver(Math.floor(digitSum / 10));
         newResultDigits.tens = placeResult;
         nextStep = (num1 > 99 || num2 > 99 || correctSum > 99) ? 'hundreds' : 'done';
         setMessage(t('magic_bakery.step_tens', { n1t: n1Str[2], n2t: n2Str[2], carryIn: currentCarry, sum: digitSum, result: placeResult, carryOut: Math.floor(digitSum / 10) }));
         break;
      case 'hundreds':
         digitSum = parseInt(n1Str[1]) + parseInt(n2Str[1]) + currentCarry;
         placeResult = digitSum % 10;
         setCarryOver(Math.floor(digitSum / 10));
         newResultDigits.hundreds = placeResult;
         nextStep = (num1 > 999 || num2 > 999 || correctSum > 999) ? 'thousands' : 'done';
         setMessage(t('magic_bakery.step_hundreds', { n1h: n1Str[1], n2h: n2Str[1], carryIn: currentCarry, sum: digitSum, result: placeResult, carryOut: Math.floor(digitSum / 10) }));
         break;
      case 'thousands':
         digitSum = parseInt(n1Str[0]) + parseInt(n2Str[0]) + currentCarry;
         // For thousands, we write the full result (could be more than one digit if sum > 9999)
         placeResult = digitSum; // No modulo here for the last step
         setCarryOver(0); // No further carry
         newResultDigits.thousands = placeResult; // Store the full result for thousands place
         nextStep = 'done';
         // Use a slightly different message structure for the final place value if needed, or reuse hundreds structure
         setMessage(t('magic_bakery.step_thousands', { n1th: n1Str[0], n2th: n2Str[0], carryIn: currentCarry, sum: digitSum, result: placeResult, carryOut: 0 }));
         break;
      default:
        break;
    }

    // Only update result digits if they are not null (to avoid showing leading zeros prematurely)
    const finalResultDigits = {};
    if (newResultDigits.thousands !== null) finalResultDigits.thousands = newResultDigits.thousands;
    if (newResultDigits.hundreds !== null) finalResultDigits.hundreds = newResultDigits.hundreds;
    if (newResultDigits.tens !== null) finalResultDigits.tens = newResultDigits.tens;
    if (newResultDigits.units !== null) finalResultDigits.units = newResultDigits.units;

    setResultDigits(finalResultDigits);
    setCurrentStep(nextStep);
    const nextSpeakerIsRobi = !robiSpeaking;
    setRobiSpeaking(nextSpeakerIsRobi);
    // Set moods for explanation steps
    setRobiMood(nextSpeakerIsRobi ? 'explain' : 'neutral');
    setAnaMood(!nextSpeakerIsRobi ? 'explains' : 'neutral');

    if (nextStep === 'done') {
        setMessage(t('magic_bakery.prompt_final_sum'));
        // Set moods for final prompt (e.g., thinking/waiting)
        // Keep the current speaker active, but change mood
        setRobiMood(robiSpeaking ? 'explain' : 'neutral'); // Robi waits for answer
        setAnaMood(!robiSpeaking ? 'thinking' : 'neutral'); // Ana waits for answer
    }

  }, [currentStep, carryOver, num1, num2, resultDigits, feedback, t]); // Add t to dependency array

  // Function to check the final answer (if using direct input or options)
  const checkFinalAnswer = useCallback((answer) => {
    const finalAnswer = parseInt(answer);
    if (finalAnswer === correctSum) {
      setFeedback('correct');
      // Determine the treat based on the level (keep this for individual level success)
      let treatImage = null;
      let treatKey = 'magic_bakery.treat_cookie'; // Default fallback key
      // Simple treat logic for now, can be expanded
      const treatIndex = (level - 1) % 5; // Cycle through 5 treats
      const treats = ['cupcake', 'cookie', 'pie', 'donut', 'cake'];
      treatKey = `magic_bakery.treat_${treats[treatIndex]}`;
      treatImage = `/assets/images/magic_bakery/treat_${treats[treatIndex]}.png`;
      // Handle potential missing images gracefully
      if (treatIndex === 3) treatImage = '/assets/images/magic_bakery/donut.png'; // Explicit path if needed

      setBakedTreatImage(treatImage); // Show the baked treat first
      setMessage(t('magic_bakery.success_message', { treatName: t(treatKey), num1: num1, num2: num2, correctSum: correctSum }));
      // playSound('correct', sound); // Assuming playSound utility exists
      dispatch({ type: actions.ADD_STARS, payload: 10 }); // Award stars
      // Set moods for success
      setRobiMood('happy');
      setAnaMood('happy');
      // Check for treasure reward milestone AFTER setting success state
      if (level % 5 === 0 && level <= MAX_LEVEL) {
        // Trigger treasure reward display after a short delay to show the baked treat
        setTimeout(() => {
          setBakedTreatImage(null); // Hide individual treat before showing treasure
          setShowTreasure(true);
          // Level advancement will happen in handleCloseTreasure
        }, 1500); // Short delay to see the baked item
      } else {
        // If not a milestone, advance level after a delay
        setTimeout(() => {
          if (level < MAX_LEVEL) {
             dispatch({ type: actions.SET_LEVEL, payload: level + 1 });
             // generateProblem will be called by useEffect on level change
          } else {
             // Handle MAX_LEVEL completion
             setMessage(t('magic_bakery.game_complete_message') || "Wow! You baked everything!");
             setRobiMood('happy');
             setAnaMood('happy');
             // Optionally show treasure one last time?
             // setShowTreasure(true);
          }
        }, 3000); // Delay for non-milestone level advance
      }
    } else {
      setFeedback('incorrect');
      setMessage(t('magic_bakery.incorrect_message'));
      // playSound('incorrect', sound);
      // Set moods for incorrect answer
      setRobiMood(robiSpeaking ? 'wrong' : 'neutral');
      setAnaMood(!robiSpeaking ? 'thinking' : 'neutral'); // Ana might look thoughtful
    }
    // Don't switch speaker on final answer check, keep the one who gave feedback
    // setRobiSpeaking(prev => !prev);
  }, [correctSum, num1, num2, dispatch, actions, level, sound, t]);


  // --- Treasure Handling ---
  const handleCloseTreasure = useCallback(() => {
    setShowTreasure(false);
    // Advance level after closing treasure
    if (level < MAX_LEVEL) {
      dispatch({ type: actions.SET_LEVEL, payload: level + 1 });
      // generateProblem is triggered by useEffect watching level
    } else {
      // This case might be redundant if handled in checkFinalAnswer, but safe to have
      setMessage(t('magic_bakery.game_complete_message') || "Wow! You baked everything!");
      setRobiMood('happy');
      setAnaMood('happy');
    }
  }, [level, dispatch, actions, t]);


  // --- Return Hook Values ---
  return {
    num1,
    num2,
    currentStep,
    carryOver,
    resultDigits,
    message,
    robiSpeaking,
    feedback,
    userInput,
    setUserInput,
    handleMixStep,
    checkFinalAnswer,
    bakedTreatImage,
    robiMood,
    anaMood,
    showTreasure, // Expose treasure state
    handleCloseTreasure, // Expose treasure close handler
  };
};

export default useMagicBakeryGame;