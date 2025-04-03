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
  const [imageLoaded, setImageLoaded] = useState(false);
  const { t } = useTranslation();
  
  // Play sound and animation when treasure is shown
  useEffect(() => {
    if (show && containerRef.current) {
      playSound('complete', sound);
      createConfettiEffect(containerRef.current, 150, 4000);
    }
  }, [show, sound]);

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
  const reward = getReward();

  // Check if the image exists - Moved before conditional return
  useEffect(() => {
    // Only run if showing and we have a reward image path
    if (show && reward.image) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageLoaded(false); // Handle potential errors
      img.src = reward.image;
    } else if (!show) {
      // Reset image loaded state when not showing
      setImageLoaded(false);
    }
  }, [show, reward.image]); // Depend on show and reward.image

  if (!show) return null; // Conditional return is now after all hooks

  const rewardName = t(reward.nameKey);
  const rewardDescription = t(reward.descriptionKey);

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
                src={reward.image} 
                alt={rewardName} 
                className="treasure-image pulse"
              />
            ) : (
              <div 
                className="treasure-placeholder pulse" 
                style={{ background: reward.color }}
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
