import React, { useEffect, useRef } from 'react';
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
          image: '/assets/images/rewards/rainbow.png'
        };
      case 2:
        return {
          name: 'Spațiu',
          description: 'Un abac cu mărgele în formă de stele și planete!',
          image: '/assets/images/rewards/space.png'
        };
      case 3:
        return {
          name: 'Flori',
          description: 'Un abac cu mărgele în formă de flori colorate!',
          image: '/assets/images/rewards/flowers.png'
        };
      default:
        return {
          name: 'Comoară',
          description: 'Ai găsit o comoară! Continuă să înveți pentru mai multe recompense.',
          image: '/assets/images/treasure.png'
        };
    }
  };
  
  const reward = getReward();
  
  return (
    <div className="treasure-overlay" ref={containerRef}>
      <div className="treasure-modal">
        <div className="treasure-header">
          <h2>Felicitări!</h2>
          <p>Ai terminat nivelul {level} și ai deblocat o recompensă!</p>
        </div>
        
        <div className="treasure-content">
          <div className="treasure-image-container">
            <img 
              src={reward.image} 
              alt={reward.name} 
              className="treasure-image pulse"
            />
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