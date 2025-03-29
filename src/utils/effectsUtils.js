/**
 * Utility functions for visual effects and animations
 */

/**
 * Create a confetti explosion effect
 * @param {HTMLElement} container - Container element to add confetti to
 * @param {number} particleCount - Number of confetti particles
 * @param {number} duration - Duration of the effect in milliseconds
 */
export const createConfettiEffect = (container, particleCount = 100, duration = 3000) => {
  // Create a container for the confetti
  const confettiContainer = document.createElement('div');
  confettiContainer.style.position = 'absolute';
  confettiContainer.style.top = '0';
  confettiContainer.style.left = '0';
  confettiContainer.style.width = '100%';
  confettiContainer.style.height = '100%';
  confettiContainer.style.pointerEvents = 'none';
  confettiContainer.style.zIndex = '100';
  
  container.appendChild(confettiContainer);
  
  // Create confetti particles
  const colors = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590', '#277da1'];
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    
    // Random particle properties
    const size = Math.random() * 10 + 5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const duration = Math.random() * 3 + 2;
    const delay = Math.random() * 0.5;
    
    // Set particle styles
    particle.style.position = 'absolute';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    particle.style.borderRadius = '50%';
    particle.style.left = `${left}%`;
    particle.style.top = '-20px';
    particle.style.opacity = '1';
    particle.style.transform = 'translateY(0) rotate(0deg)';
    particle.style.animation = `confetti ${duration}s ease ${delay}s forwards`;
    
    confettiContainer.appendChild(particle);
  }
  
  // Add keyframe animation to document
  if (!document.getElementById('confetti-animation')) {
    const style = document.createElement('style');
    style.id = 'confetti-animation';
    style.innerHTML = `
      @keyframes confetti {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(calc(100vh)) rotate(720deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Remove the confetti after duration
  setTimeout(() => {
    if (confettiContainer && confettiContainer.parentNode) {
      confettiContainer.parentNode.removeChild(confettiContainer);
    }
  }, duration);
};

/**
 * Add a pulsing effect to an element
 * @param {HTMLElement} element - Element to add pulse effect to
 * @param {number} duration - Duration of each pulse in milliseconds
 * @param {number} count - Number of pulses (0 for infinite)
 */
export const addPulseEffect = (element, duration = 1000, count = 3) => {
  // Store original scale
  const originalTransform = element.style.transform || '';
  const computedStyle = window.getComputedStyle(element);
  const transition = computedStyle.transition;
  
  element.style.transition = `transform ${duration/2}ms ease-in-out`;
  
  let pulseCount = 0;
  
  // Pulse function
  const pulse = () => {
    setTimeout(() => {
      element.style.transform = `${originalTransform} scale(1.1)`;
      
      setTimeout(() => {
        element.style.transform = originalTransform;
        
        pulseCount++;
        if (count === 0 || pulseCount < count) {
          pulse();
        } else {
          // Restore original transition
          element.style.transition = transition;
        }
      }, duration / 2);
    }, 0);
  };
  
  pulse();
};

/**
 * Create a floating animation for an element
 * @param {HTMLElement} element - Element to animate
 */
export const addFloatingEffect = (element) => {
  // Add CSS classes for animation if not present
  if (!element.classList.contains('float')) {
    element.classList.add('float');
  }
};

/**
 * Stop a floating animation for an element
 * @param {HTMLElement} element - Element to stop animating
 */
export const removeFloatingEffect = (element) => {
  // Remove CSS classes for animation
  if (element.classList.contains('float')) {
    element.classList.remove('float');
  }
};

/**
 * Add a bounce effect to an element
 * @param {HTMLElement} element - Element to animate
 */
export const addBounceEffect = (element) => {
  // Add CSS classes for animation if not present
  if (!element.classList.contains('bounce')) {
    element.classList.add('bounce');
  }
};

/**
 * Stop a bounce animation for an element
 * @param {HTMLElement} element - Element to stop animating
 */
export const removeBounceEffect = (element) => {
  // Remove CSS classes for animation
  if (element.classList.contains('bounce')) {
    element.classList.remove('bounce');
  }
};