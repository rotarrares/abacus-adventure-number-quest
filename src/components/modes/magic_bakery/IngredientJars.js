import React from 'react';
// Import relevant styles, e.g.,
// import '../../../styles/magic_bakery/Ingredients.css';

const IngredientJars = ({ num1, num2 }) => {
  // This component will display the two numbers to be added,
  // potentially with color-coded digits based on place value.

  // Placeholder rendering:
  return (
    <div className="ingredient-jars-container">
      <div className="jar">
        <img src="/assets/images/magic_bakery/ingredient_jar.png" alt="Ingredient Jar 1" className="jar-image" loading="lazy" />
        <span className="number number-on-jar">{num1 !== undefined ? num1 : '...'} </span>
      </div>
      <div className="plus-sign">+</div>
      <div className="jar">
        <img src="/assets/images/magic_bakery/ingredient_jar.png" alt="Ingredient Jar 2" className="jar-image" loading="lazy" />
        <span className="number number-on-jar">{num2 !== undefined ? num2 : '...'}</span>
      </div>
    </div>
  );
};

export default IngredientJars;