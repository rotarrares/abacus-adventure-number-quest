import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { playSound } from '../../utils/audioUtils';
import { createConfettiEffect } from '../../utils/effectsUtils';
import '../../styles/TreasureReward.css';

/**
 * Component for displaying a treasure reward animation
 * @param {Object} props - Component props
 * @param {boolean} props.show - Whether to show the treasure
 * @param {number} props.level - Current level (used to determine rewards)
 * @param {Function} props.onClose - Function to call when closing the treasure
 * @param {boolean} props.sound - Whether sound is enabled
 */
const TreasureReward = ({ show, level, onClose, sound }) => {
  const containerRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false); // Still useful for placeholder
  const [isOpen, setIsOpen] = useState(false); // State for chest open/closed
  const { t } = useTranslation();
  
  // Play sound and animation when treasure is shown
  // Handle opening animation and sound
  useEffect(() => {
    if (show) {
      setIsOpen(false); // Reset to closed when shown
      setImageLoaded(false); // Reset loaded state for closed image check
      const timer = setTimeout(() => {
        setIsOpen(true);
        playSound('complete', sound); // Play sound when it opens
        if (containerRef.current) {
          createConfettiEffect(containerRef.current, 150, 4000); // Confetti on open
        }
      }, 3000); // Open after 3 seconds

      return () => clearTimeout(timer); // Cleanup timer on unmount/hide
    }
  }, [show, sound]); // Rerun when 'show' changes

  // Determine reward based on level
  const getReward = () => {
    // Every 5 levels gives a different reward
    const rewardLevel = Math.floor(level / 5);
    
    // Return keys instead of hardcoded strings
    switch (rewardLevel) {
      case 1: // Levels 5-9
        return {
          nameKey: 'reward_name_rainbow',
          descriptionKey: 'reward_desc_rainbow',
          image: '/assets/images/rewards/rainbow.png',
          color: 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8b00ff)'
        };
      case 2: // Levels 10-14
        return {
          nameKey: 'reward_name_flowers',
          descriptionKey: 'reward_desc_flowers',
          image: '/assets/images/rewards/flowers.png',
          color: 'linear-gradient(135deg, #ff9a9e, #fecfef, #ff9a9e)'
        };
      case 3: // Levels 15-19
        return {
          nameKey: 'reward_name_space',
          descriptionKey: 'reward_desc_space',
          image: '/assets/images/rewards/space.png',
          color: 'linear-gradient(135deg, #000033, #0033cc, #000033)'
        };
      default: // Levels 0-4 and 20+
        return {
          nameKey: 'reward_name_treasure',
          descriptionKey: 'reward_desc_treasure',
          image: '/assets/images/treasure-open.png', // Default treasure image
          color: 'linear-gradient(135deg, #ffd700, #ffcc00, #ff9900)'
        };
    }
  };
  // const reward = getReward(); // We'll handle image logic directly based on isOpen

  const closedImgSrc = '/assets/images/treasure-closed.png';
  const openImgSrc = '/assets/images/treasure-open.png';
  const currentImgSrc = isOpen ? openImgSrc : closedImgSrc;

  // Check if the *current* image exists
  useEffect(() => {
    if (show) {
      setImageLoaded(false); // Assume not loaded initially
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = () => {
        console.error(`Failed to load treasure image: ${currentImgSrc}`);
        setImageLoaded(false); // Ensure placeholder shows on error
      };
      img.src = currentImgSrc;
    }
  }, [show, currentImgSrc]); // Depend on show and the current image source

  if (!show) return null; // Conditional return is now after all hooks

  // Use generic treasure text for now, or adapt getReward if needed
  const rewardName = t('reward_name_treasure');
  const rewardDescription = t('reward_desc_treasure');
  const rewardColor = 'linear-gradient(135deg, #ffd700, #ffcc00, #ff9900)'; // Default gold gradient

  return (
    <div className="treasure-overlay" ref={containerRef}>
      <div className="treasure-modal">
        <div className="treasure-header">
          <h2>{t('treasure_congratulations')}</h2>
          <p>{t('treasure_level_complete', { level: level })}</p>
        </div>
        
        <div className="treasure-content">
          <div className="treasure-image-container">
            {imageLoaded ? (
              <img 
                src={currentImgSrc} // Use state-driven image source
                alt={rewardName}
                // Add transition class if needed, pulse might be okay
                className={`treasure-image ${isOpen ? 'pulse' : ''}`}
              />
            ) : (
              <div 
                className="treasure-placeholder pulse" 
                style={{ background: rewardColor }} // Use default color
              >
                🎁
              </div>
            )}
          </div>
          
          <div className="reward-details">
            <h3>{rewardName}</h3>
            <p>{rewardDescription}</p>
          </div>
        </div>
        
        <button 
          className="continue-button"
          onClick={onClose}
        >
          {t('treasure_continue_button')}
        </button>
      </div>
    </div>
  );
};

export default TreasureReward;
