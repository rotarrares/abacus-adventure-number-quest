import React from 'react';
// Import relevant styles, e.g.,
// import '../../../styles/magic_bakery/Ingredients.css';

const IngredientJars = ({ num1, num2 }) => {

  // Helper function to render a number with color-coded digits
  const renderNumberWithColors = (num) => {
    if (num === undefined || num === null) {
      return <span className="number-placeholder">...</span>;
    }
    const numStr = String(num).padStart(4, '0'); // Pad to 4 digits for consistency
    const digits = numStr.split('');

    // Assign classes based on position (right-to-left: units, tens, hundreds, thousands)
    const placeValueClasses = ['digit-thousands', 'digit-hundreds', 'digit-tens', 'digit-units'];

    return digits.map((digit, index) => {
      // Only render digits that are part of the original number or leading zeros if needed for alignment
      // This logic prevents showing '0036' when the number is just 36, unless we want alignment
      const originalNumStr = String(num);
      const isLeadingZero = index < 4 - originalNumStr.length;

      // Option 1: Hide leading zeros (simpler display)
      // if (isLeadingZero) return null;

      // Option 2: Show leading zeros but maybe styled differently (for alignment)
      // For now, let's show them for alignment but maybe make them less prominent via CSS if desired
      const className = `${placeValueClasses[index]} ${isLeadingZero ? 'leading-zero' : ''}`;

      return (
        <span key={index} className={className}>
          {digit}
        </span>
      );
    }).filter(Boolean); // Filter out nulls if using Option 1
  };

  return (
    <div className="ingredient-jars-container">
      <div className="jar">
        <img src="/assets/images/magic_bakery/ingredient_jar.png" alt="Ingredient Jar 1" className="jar-image" loading="lazy" />
        <div className="number number-on-jar">
          {renderNumberWithColors(num1)}
        </div>
      </div>
      <div className="plus-sign">+</div>
      <div className="jar">
        <img src="/assets/images/magic_bakery/ingredient_jar.png" alt="Ingredient Jar 2" className="jar-image" loading="lazy" />
        <div className="number number-on-jar">
          {renderNumberWithColors(num2)}
        </div>
      </div>
    </div>
  );
};

export default IngredientJars;