import React, { useEffect, useRef, useState } from 'react';
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
    
    switch (rewardLevel) {
      case 1:
        return {
          name: 'Curcubeu',
          description: 'Un abac cu mărgele colorate în culorile curcubeului!',
          image: '/assets/images/rewards/rainbow.png',
          color: 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8b00ff)'
        };
      case 2:
        return {
          name: 'Spațiu',
          description: 'Un abac cu mărgele în formă de stele și planete!',
          image: '/assets/images/rewards/space.png',
          color: 'linear-gradient(135deg, #000033, #0033cc, #000033)'
        };
      case 3:
        return {
          name: 'Flori',
          description: 'Un abac cu mărgele în formă de flori colorate!',
          image: '/assets/images/rewards/flowers.png',
          color: 'linear-gradient(135deg, #ff9a9e, #fecfef, #ff9a9e)'
        };
      default:
        return {
          name: 'Comoară',
          description: 'Ai găsit o comoară! Continuă să înveți pentru mai multe recompense.',
          image: '/assets/images/treasure.png',
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

  return (
    <div className="treasure-overlay" ref={containerRef}>
      <div className="treasure-modal">
        <div className="treasure-header">
          <h2>Felicitări!</h2>
          <p>Ai terminat nivelul {level} și ai deblocat o recompensă!</p>
        </div>
        
        <div className="treasure-content">
          <div className="treasure-image-container">
            {imageLoaded ? (
              <img 
                src={reward.image} 
                alt={reward.name} 
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
            <h3>{reward.name}</h3>
            <p>{reward.description}</p>
          </div>
        </div>
        
        <button 
          className="continue-button"
          onClick={onClose}
        >
          Continuă Aventura
        </button>
      </div>
    </div>
  );
};

export default TreasureReward;