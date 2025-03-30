// Audio files paths
const AUDIO_PATHS = {
  correct: '/assets/audio/correct.mp3',
  incorrect: '/assets/audio/incorrect.mp3',
  complete: '/assets/audio/complete.mp3',
  click: '/assets/audio/click.mp3',
  star: '/assets/audio/star.mp3',
  beadPlace: '/assets/audio/bead-place.mp3',
  beadRemove: '/assets/audio/bead-remove.mp3'
};

// Removed audioCache and preloadAudio function

// Flag to track if speech synthesis is currently speaking
// let isSpeaking = false; // This flag seems unused, removing it.

/**
 * Play a sound effect if sound is enabled (loads on demand)
 * @param {string} soundName - Name of the sound effect to play
 * @param {boolean} soundEnabled - Whether sound is enabled
 */
export const playSound = (soundName, soundEnabled = true) => {
  if (!soundEnabled || !AUDIO_PATHS[soundName]) return;
  
  try {
    // Create a new Audio object each time to load on demand
    const audio = new Audio(AUDIO_PATHS[soundName]);
    
    // Play the sound
    // No need to pause/reset currentTime as it's a new instance
    audio.play().catch(err => {
      // Log error but don't crash the app
      console.error(`Error playing sound "${soundName}":`, err);
      // Prevent further errors if play() fails repeatedly on the same object
      audio.onerror = () => console.error(`Audio element error for ${soundName}`); 
    });
  } catch (error) {
    console.error(`Error creating or playing sound "${soundName}":`, error);
  }
};

/**
 * Speak the given text using Web Speech API
 * @param {string} text - Text to speak
 * @param {boolean} soundEnabled - Whether sound is enabled
 */
export const speakText = (text, soundEnabled = true) => {
  if (!soundEnabled) return;
  
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech immediately before speaking the new text
    window.speechSynthesis.cancel();
      
    // Create speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(text);
      
    // Set language to Romanian
    utterance.lang = 'ro-RO';
      
    // Use a slightly slower rate for educational purposes
    utterance.rate = 0.9;
      
    // Speak the text
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn('Speech synthesis not supported in this browser');
  }
};

/**
 * Stop all audio playback (only affects speech synthesis now)
 */
export const stopAllAudio = () => {
  // No cached audio elements to stop anymore
  
  // Stop speech synthesis
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    // No need to manage isSpeaking flag anymore
  }
};
