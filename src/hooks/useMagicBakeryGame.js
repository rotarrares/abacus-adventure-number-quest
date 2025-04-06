import { useState, useEffect, useCallback } from 'react';
import { useGameContext } from '../context/GameContext';
// Import utility functions if needed (e.g., for number generation)
// import { generateAdditionProblem } from '../utils/magicBakeryUtils'; // To be created

const useMagicBakeryGame = () => {
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

  // Function to generate a new problem based on the level
  const generateProblem = useCallback(() => {
    // Placeholder logic - replace with actual generation based on level
    console.log(`Generating problem for level ${level}`);
    let n1 = 0, n2 = 0, sum = 0;
    // TODO: Implement level-based number generation ensuring carry-over
    if (level === 1) { // Units carry-over
        n1 = 36; n2 = 19; sum = 55;
    } else if (level === 2) { // Tens carry-over
        n1 = 178; n2 = 45; sum = 223;
    } else { // Default/placeholder
        n1 = Math.floor(Math.random() * 50) + 1;
        n2 = Math.floor(Math.random() * 50) + 1;
        sum = n1 + n2;
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
    setMessage(`Let's add ${n1} and ${n2}! Start with the units.`); // Initial message
    setRobiSpeaking(Math.random() < 0.5); // Randomly choose who speaks first
  }, [level]);

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
        nextStep = 'tens';
        setMessage(`Units: ${n1Str[3]} + ${n2Str[3]} = ${digitSum}. Write ${placeResult}, carry ${Math.floor(digitSum / 10)}.`);
        break;
      case 'tens':
         digitSum = parseInt(n1Str[2]) + parseInt(n2Str[2]) + currentCarry;
         placeResult = digitSum % 10;
         setCarryOver(Math.floor(digitSum / 10));
         newResultDigits.tens = placeResult;
         nextStep = 'hundreds';
         setMessage(`Tens: ${n1Str[2]} + ${n2Str[2]} + ${currentCarry} (carry) = ${digitSum}. Write ${placeResult}, carry ${Math.floor(digitSum / 10)}.`);
         break;
      // TODO: Add cases for 'hundreds', 'thousands'
      case 'hundreds':
         // Placeholder
         nextStep = 'thousands';
         setMessage('Mixing hundreds...');
         break;
      case 'thousands':
         // Placeholder
         nextStep = 'done';
         setMessage('Mixing thousands...');
         break;
      default:
        break;
    }
    setResultDigits(newResultDigits);
    setCurrentStep(nextStep);
    setRobiSpeaking(prev => !prev); // Switch speaker

    if (nextStep === 'done') {
        setMessage('Great! Now, what is the final sum?');
        // Enable answer input/options here
    }

  }, [currentStep, carryOver, num1, num2, resultDigits, feedback]);

  // Function to check the final answer (if using direct input or options)
  const checkFinalAnswer = useCallback((answer) => {
    const finalAnswer = parseInt(answer);
    if (finalAnswer === correctSum) {
      setFeedback('correct');
      // Determine the treat based on the level
      let treatImage = null;
      switch (level) {
        case 1: treatImage = '/assets/images/magic_bakery/treat_cupcake.png'; break;
        case 2: treatImage = '/assets/images/magic_bakery/treat_cookie.png'; break;
        case 3: treatImage = '/assets/images/magic_bakery/treat_pie.png'; break;
        case 4: treatImage = '/assets/images/magic_bakery/treat_donut.png'; break;
        case 5: treatImage = '/assets/images/magic_bakery/treat_cake.png'; break;
        default: treatImage = '/assets/images/magic_bakery/treat_cookie.png'; // Default fallback
      }
      setBakedTreatImage(treatImage);
      setMessage(`Yum! You baked a ${level === 1 ? 'cupcake' : level === 2 ? 'cookie' : level === 3 ? 'pie' : level === 4 ? 'donut' : 'cake'}! ${num1} + ${num2} = ${correctSum}.`);
      // playSound('correct', sound); // Assuming playSound utility exists
      dispatch({ type: actions.ADD_STARS, payload: 10 }); // Award stars
      // Potentially trigger level advance after a delay
      setTimeout(() => {
         dispatch({ type: actions.SET_LEVEL, payload: level + 1 });
         // generateProblem(); // generateProblem will be called by useEffect on level change
      }, 2000);
    } else {
      setFeedback('incorrect');
      setMessage(`Not quite! Try mixing the steps again.`);
      // playSound('incorrect', sound);
    }
    setRobiSpeaking(prev => !prev);
  }, [correctSum, num1, num2, dispatch, actions, level, sound]);


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
    // Add any other state or functions needed by the component
  };
};

export default useMagicBakeryGame;