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
  
  if (!show) return null;
  
  // Determine reward based on level
  const getReward = () => {
    // Every 5 levels gives a different reward
    const rewardLevel = Math.floor(level / 5);
    
    // Return keys instead of hardcoded strings
    switch (rewardLevel) {
      case 1:
        return {
          nameKey: 'reward_name_rainbow',
          descriptionKey: 'reward_desc_rainbow',
          image: '/assets/images/rewards/rainbow.png',
          color: 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8b00ff)'
        };
      case 2:
        return {
          nameKey: 'reward_name_space',
          descriptionKey: 'reward_desc_space',
          image: '/assets/images/rewards/space.png',
          color: 'linear-gradient(135deg, #000033, #0033cc, #000033)'
        };
      case 3:
        return {
          nameKey: 'reward_name_flowers',
          descriptionKey: 'reward_desc_flowers',
          image: '/assets/images/rewards/flowers.png',
          color: 'linear-gradient(135deg, #ff9a9e, #fecfef, #ff9a9e)'
        };
      default: // Includes level 0 or any other case
        return {
          nameKey: 'reward_name_treasure',
          descriptionKey: 'reward_desc_treasure',
          image: '/assets/images/treasure.png', // Default treasure image
          color: 'linear-gradient(135deg, #ffd700, #ffcc00, #ff9900)'
        };
    }
  };
  
  const reward = getReward();
  
  // Check if the image exists
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(false);
    img.src = reward.image;
  }, [reward.image]);

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
