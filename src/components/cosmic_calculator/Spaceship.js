import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/cosmic_calculator/Spaceship.css';

// Images are referenced from the public folder
// TODO: Reference other upgrade variants as needed from public folder

/**
 * Displays Robi's spaceship.
 * Can be animated based on game state (correct/incorrect answers) and upgrades.
 */
const Spaceship = ({ isCorrect = null, upgrades = { wings: 'basic', color: 'default', booster: null } }) => {
  // Determine the image source based on upgrades
  let shipImageSrc = '/assets/images/cosmicCalculator/spaceship_default.png'; // Default ship
  if (upgrades?.wings === 'level2_wings') {
    shipImageSrc = '/assets/images/cosmicCalculator/spaceship_wings_level2.png'; // Ship with upgraded wings
  }
  // Add more logic for colors, boosters etc. based on the 'upgrades' prop

  // Classes for the container (handles fly-off)
  const containerClasses = [
    'spaceship-container',
    isCorrect === true ? 'spaceship-fly-off' : '', // Apply fly-off to the container
  ].filter(Boolean).join(' ');

  // Classes specifically for the image (handles wobble)
  const shipClasses = [
    'spaceship',
    isCorrect === false ? 'spaceship-incorrect-wobble' : '',
    // Add classes based on upgrades if they affect appearance/animation
  ].filter(Boolean).join(' '); // Filter out empty strings and join

  return (
    <div className={containerClasses}>
      <img
        src={shipImageSrc} // Use the imported image source
        alt="Robi's Spaceship"
        className={shipClasses}
      />
      {/* Re-add booster effect for fly-off */}
      {isCorrect === true && <div className="boost-effect"></div>}
    </div>
  );
};

Spaceship.propTypes = {
  // Feedback state to trigger animations
  isCorrect: PropTypes.bool, // null | true | false
  // Ship customization/appearance
  upgrades: PropTypes.shape({
    wings: PropTypes.string,
    color: PropTypes.string,
    booster: PropTypes.string,
  }),
};


export default Spaceship;