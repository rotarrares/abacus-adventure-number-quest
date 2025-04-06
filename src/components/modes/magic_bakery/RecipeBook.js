import React from 'react';
// Import relevant styles if needed

const RecipeBook = ({ completedRecipes, unlockedItems }) => {
  // This component could display progress, like treats baked (completed problems)
  // or unlocked decorations/recipes as rewards.

  return (
    <div className="recipe-book-container">
      <h4>My Recipe Book</h4>
      {/* Display baked treats or unlocked items */}
      <ul>
        {completedRecipes && completedRecipes.map((recipe, index) => (
          <li key={index}>{recipe.num1} + {recipe.num2} = {recipe.sum} ✅</li>
        ))}
      </ul>
      {/* Add display for unlockedItems if needed */}
    </div>
  );
};

export default RecipeBook;