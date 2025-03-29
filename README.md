# Abacus Adventure: Number Quest

An educational game for learning about natural numbers (from 8 to 10,000) using a virtual abacus. Built with React and Three.js.

## 📝 Description

Abacus Adventure: Number Quest is a fun and interactive educational game designed to help children learn about forming, reading, and writing natural numbers. The game uses a virtual abacus as its main learning tool, with colorful visuals and engaging gameplay to make the learning experience enjoyable.

The game is set in Romanian language, focusing on number representation and Romanian number words.

## 🎮 Game Features

### Three Game Modes

1. **Match the Number**: A number is shown on the screen, and the player must place the correct beads on the abacus.
2. **Read and Build**: The number is written in words (in Romanian), and the player must interpret and create it on the abacus.
3. **Write the Number**: The abacus is pre-filled with beads, and the player must write the number in digits.

### Progressive Difficulty

- Level 1-5: Numbers from 8 to 99 (using tens and units)
- Level 6-10: Numbers from 100 to 999 (adding hundreds)
- Level 11+: Numbers from 1000 to 10,000 (using all four columns)

### Interactive 3D Abacus

- Realistic 3D rendering using Three.js
- Interactive beads that can be added or removed
- Color-coded columns for thousands, hundreds, tens, and units

### Rewards and Motivation

- Points system for correct answers
- Star rewards for consistent correct answers
- Treasure chest that opens after every 5 levels

### Accessibility Features

- Text-to-speech for numbers and words
- Visual feedback for correct/incorrect answers
- Hints for challenging problems

## 🛠️ Technologies Used

- **React**: For the UI components and state management
- **Three.js**: For 3D rendering of the abacus
- **react-three-fiber**: React bindings for Three.js
- **Web Speech API**: For text-to-speech functionality

## 🧠 Educational Value

The game helps children develop:

- Understanding of place values (units, tens, hundreds, thousands)
- Number reading skills in Romanian
- Number writing skills
- Number sense and mental arithmetic

## 📦 Project Structure

The project follows a modular architecture with small, focused files:

- `src/components/abacus/`: Components for the 3D abacus
- `src/components/modes/`: Game mode implementations
- `src/components/screens/`: Main screens (Start, Game, Tutorial)
- `src/components/ui/`: UI elements like headers and buttons
- `src/context/`: Game state management
- `src/utils/`: Utility functions for numbers and audio
- `src/styles/`: CSS files for styling components

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/rotarrares/abacus-adventure-number-quest.git

# Navigate to the project directory
cd abacus-adventure-number-quest

# Install dependencies
npm install

# Start the development server
npm start
```

## 📱 Responsive Design

The game is designed to work well on both desktop and mobile devices, with responsive layouts that adapt to different screen sizes.

## 🌐 Browser Support

The game works best in modern browsers that support WebGL and Web Speech API.

## 📄 License

This project is open-source, free to use and modify for educational purposes.
