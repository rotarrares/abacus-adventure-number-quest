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
  const [bakedTreatImage, setBakedTreatImage] = useState(null); // State for the reward image
  const [robiMood, setRobiMood] = useState('neutral'); // 'neutral', 'happy', 'wrong', 'explain'
  const [anaMood, setAnaMood] = useState('neutral'); // 'neutral', 'happy', 'thinking', 'explains'

  // Function to generate a new problem based on the level
  const generateProblem = useCallback(() => {
    console.log(`Generating problem for level ${level}`);
    let n1 = 0, n2 = 0, sum = 0;

    // Function to generate numbers ensuring carry-over at a specific place value
    const generateWithCarry = (placeValue) => {
      let num1 = 0, num2 = 0;
      let digit1 = 0, digit2 = 0;
      const maxVal = Math.pow(10, placeValue + 1) - 1; // e.g., placeValue 0 (units) -> max 99
      const minVal = Math.pow(10, placeValue);        // e.g., placeValue 0 (units) -> min 10

      do {
        num1 = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
        num2 = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
        // Ensure the sum doesn't exceed 10000 for simplicity
        if (num1 + num2 > 10000) continue;

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

    switch (level) {
      case 1: // Units carry-over (e.g., 36 + 19)
        ({ n1, n2, sum } = generateWithCarry(0)); // Carry from units (index 3)
        break;
      case 2: // Tens carry-over (e.g., 178 + 45)
        ({ n1, n2, sum } = generateWithCarry(1)); // Carry from tens (index 2)
        break;
      case 3: // Hundreds carry-over (e.g., 1234 + 876)
        ({ n1, n2, sum } = generateWithCarry(2)); // Carry from hundreds (index 1)
        break;
      case 4: // Multiple carry-overs (e.g., 299 + 301) - generateWithCarry handles this implicitly
         // Generate a problem likely to have multiple carries
         do {
            n1 = Math.floor(Math.random() * 4000) + 1000; // e.g., 1000-4999
            n2 = Math.floor(Math.random() * 4000) + 1000;
            sum = n1 + n2;
            // Check for at least two carry-overs
            const s1 = String(n1).padStart(4, '0');
            const s2 = String(n2).padStart(4, '0');
            let carryCount = 0;
            let currentCarry = 0;
            for (let i = 3; i >= 1; i--) { // Check units, tens, hundreds
                let digitSum = parseInt(s1[i]) + parseInt(s2[i]) + currentCarry;
                currentCarry = Math.floor(digitSum / 10);
                if (currentCarry > 0) carryCount++;
            }
            if (carryCount >= 2 && sum <= 10000) break;
         } while(true);
        break;
      case 5: // Grand Cake Challenge (e.g., 999 + 1)
        // Generate problems resulting in exactly 1000, 10000 or similar edge cases
        const type = Math.random();
        if (type < 0.5) { // Sum is 1000
            n1 = Math.floor(Math.random() * 998) + 1; // 1 to 998
            n2 = 1000 - n1;
        } else { // Sum is 10000 or close
            n1 = Math.floor(Math.random() * 500) + 9500; // 9500-9999
            n2 = Math.floor(Math.random() * (10000 - n1)) + 1; // Ensure sum <= 10000
        }
        sum = n1 + n2;
        break;
      default: // Fallback for levels > 5 or invalid
        ({ n1, n2, sum } = generateWithCarry(0));
        break;
    }

    setNum1(n1);
    setNum2(n2);
    setCorrectSum(sum);
    setCurrentStep('units');
    setCarryOver(0);
    setResultDigits({ units: null, tens: null, hundreds: null, thousands: null });
    setUserInput('');
    setFeedback('');
    setBakedTreatImage(null); // Reset treat image on new problem
    const initialSpeakerIsRobi = Math.random() < 0.5;
    setRobiSpeaking(initialSpeakerIsRobi);
    // Set initial moods based on who speaks first
    setRobiMood(initialSpeakerIsRobi ? 'explain' : 'neutral');
    setAnaMood(!initialSpeakerIsRobi ? 'explains' : 'neutral');
    setMessage(t('magic_bakery.initial_prompt', { num1: n1, num2: n2 })); // Use translation
  }, [level, t]); // Add t to dependency array

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
      // Determine the treat based on the level
      let treatImage = null;
      let treatKey = 'magic_bakery.treat_cookie'; // Default fallback key
      switch (level) {
        case 1: treatImage = '/assets/images/magic_bakery/treat_cupcake.png'; treatKey = 'magic_bakery.treat_cupcake'; break;
        case 2: treatImage = '/assets/images/magic_bakery/treat_cookie.png'; treatKey = 'magic_bakery.treat_cookie'; break;
        case 3: treatImage = '/assets/images/magic_bakery/treat_pie.png'; treatKey = 'magic_bakery.treat_pie'; break;
        case 4: treatImage = '/assets/images/magic_bakery/donut.png'; treatKey = 'magic_bakery.treat_donut'; break; // Corrected path
        case 5: treatImage = '/assets/images/magic_bakery/treat_cake.png'; treatKey = 'magic_bakery.treat_cake'; break;
        default: treatImage = '/assets/images/magic_bakery/treat_cookie.png';
      }
      setBakedTreatImage(treatImage);
      setMessage(t('magic_bakery.success_message', { treatName: t(treatKey), num1: num1, num2: num2, correctSum: correctSum }));
      // playSound('correct', sound); // Assuming playSound utility exists
      dispatch({ type: actions.ADD_STARS, payload: 10 }); // Award stars
      // Set moods for success
      setRobiMood('happy');
      setAnaMood('happy');
      // Potentially trigger level advance after a delay
      setTimeout(() => {
         // Check if level 5 was just completed
         if (level < 5) {
            dispatch({ type: actions.SET_LEVEL, payload: level + 1 });
            // generateProblem will be called by useEffect on level change
         } else {
            // Handle game completion? Show final message?
            // Add a specific translation key for game completion
            setMessage(t('magic_bakery.game_complete_message') || "Wow! You baked everything!");
            // Keep moods happy or neutral
            setRobiMood('happy');
            setAnaMood('happy');
         }
      }, 3000); // Increased delay to show treat
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
  }, [correctSum, num1, num2, dispatch, actions, level, sound, t]); // Add t to dependency array


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
    bakedTreatImage, // Expose the treat image path
    robiMood, // Expose Robi's mood
    anaMood, // Expose Ana's mood
  };
};

export default useMagicBakeryGame;