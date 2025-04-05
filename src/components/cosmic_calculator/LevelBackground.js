import React from 'react';
import PropTypes from 'prop-types';
import { LEVEL_CONFIG } from '../../constants/cosmicCalculatorConstants';
import '../../styles/cosmic_calculator/LevelBackground.css'; // We'll create this style file next

/**
 * Maps level zone names (or level numbers) to background image filenames.
 * Assumes images are in public/assets/images/cosmic_calculator/
 */
const zoneBackgrounds = {
  'Moon Market': 'zone_moon_market.png',
  'Asteroid Alley': 'zone_asteroid_alley.png',
  'Star Station': 'zone_star_station.png',
  'Nebula Nursery': 'zone_nebula_nursery.png',
  'Galaxy Gateway': 'zone_galaxy_gateway.png',
  // Add fallback if needed
  default: 'zone_default_space.png',
};

/**
 * Displays the space-themed background corresponding to the current game level/zone.
 */
const LevelBackground = ({ level, children }) => {
  const levelConfig = LEVEL_CONFIG.find(l => l.level === level);
  const zoneName = levelConfig?.zoneName || 'default'; // Use zoneName from config
  const backgroundImageFile = zoneBackgrounds[zoneName] || zoneBackgrounds.default;
  const backgroundImageUrl = `${process.env.PUBLIC_URL}/assets/images/cosmicCalculator/${backgroundImageFile}`; // Corrected path capitalization

  // No longer setting background image via inline style

  return (
    <div className="level-background">
      <img
        src={backgroundImageUrl}
        alt={`${zoneName} background`} // More descriptive alt text
        className="level-background-image"
      />
      <div className="level-content"> {/* Container for actual game content */}
        {children}
      </div>
    </div>
  );
};

LevelBackground.propTypes = {
  level: PropTypes.number.isRequired,
  children: PropTypes.node, // To allow nesting other components inside
};

export default LevelBackground;