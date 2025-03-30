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

// Cache for audio elements
const audioCache = {};

// Flag to track if speech synthesis is currently speaking
let isSpeaking = false;

/**
 * Preload all audio files
 */
export const preloadAudio = () => {
  Object.entries(AUDIO_PATHS).forEach(([key, path]) => {
    const audio = new Audio(path);
    audio.load();
    audioCache[key] = audio;
  });
};

/**
 * Play a sound effect if sound is enabled
 * @param {string} soundName - Name of the sound effect to play
 * @param {boolean} soundEnabled - Whether sound is enabled
 */
export const playSound = (soundName, soundEnabled = true) => {
  if (!soundEnabled) return;
  
  try {
    // Get from cache or create new
    const audio = audioCache[soundName] || new Audio(AUDIO_PATHS[soundName]);
    
    // Cache if not already cached
    if (!audioCache[soundName]) {
      audioCache[soundName] = audio;
    }
    
    // Stop and reset current playback if any
    audio.pause();
    audio.currentTime = 0;
    
    // Play the sound
    audio.play().catch(err => {
      console.error(`Error playing sound "${soundName}":`, err);
    });
  } catch (error) {
    console.error(`Error with sound "${soundName}":`, error);
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
 * Stop all audio playback
 */
export const stopAllAudio = () => {
  // Stop all cached audio elements
  Object.values(audioCache).forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
  
  // Stop speech synthesis
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    // No need to manage isSpeaking flag anymore
  }
};
