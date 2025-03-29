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

### Interactive Abacus

- Two abacus implementations:
  - 3D abacus using Three.js (for environments that support WebGL)
  - 2D abacus as a fallback (works everywhere)
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
- **Three.js**: For 3D rendering of the abacus (optional)
- **react-three-fiber**: React bindings for Three.js (optional)
- **Web Speech API**: For text-to-speech functionality
- **Express**: Server for production deployment

## 🧠 Educational Value

The game helps children develop:

- Understanding of place values (units, tens, hundreds, thousands)
- Number reading skills in Romanian
- Number writing skills
- Number sense and mental arithmetic

## 📦 Project Structure

The project follows a modular architecture with small, focused files:

- `src/components/abacus/`: Components for the abacus (3D and 2D versions)
- `src/components/modes/`: Game mode implementations
- `src/components/screens/`: Main screens (Start, Game, Tutorial)
- `src/components/ui/`: UI elements like headers and buttons
- `src/context/`: Game state management
- `src/utils/`: Utility functions for numbers and audio
- `src/styles/`: CSS files for styling components
- `public/assets/`: Directory for images and audio files (all optional)

## 🎨 Assets

All image and audio assets are optional. The application will display colorful placeholders for missing images and will function without sound effects. If you want to add custom assets:

1. Create these directories if they don't exist:
   - `public/assets/images/`
   - `public/assets/images/rewards/`
   - `public/assets/audio/`

2. Add your PNG image files and MP3 audio files as described in `public/assets/README.md`

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/rotarrares/abacus-adventure-number-quest.git

# Navigate to the project directory
cd abacus-adventure-number-quest

# Install dependencies
npm install

# Start the development server
npm run dev

# Build with 3D abacus (requires WebGL support)
npm run build

# Build with 2D abacus only (works everywhere)
npm run build:simple

# Start the production server
npm start
```

## 📱 Responsive Design

The game is designed to work well on both desktop and mobile devices, with responsive layouts that adapt to different screen sizes.

## 🌐 Browser Support

The game has two versions:

- **Standard version** with 3D abacus: Works best in modern browsers that support WebGL.
- **Simple version** with 2D abacus: Works in all browsers, including older ones.

## 🚀 Deployment to Heroku

This project is ready to be deployed to Heroku. By default, it uses the simple build (2D abacus) for maximum compatibility.

1. Create a Heroku account if you don't have one
2. Install the Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
3. Log in to Heroku CLI:
   ```
   heroku login
   ```
4. Create a new Heroku app:
   ```
   heroku create abacus-adventure-number-quest
   ```
5. Push to Heroku:
   ```
   git push heroku main
   ```
6. Alternatively, you can deploy directly from GitHub:
   - Go to your Heroku Dashboard
   - Create a new app
   - Go to the "Deploy" tab
   - Connect your GitHub repository
   - Enable automatic deploys or manually deploy

### One-Click Deployment

You can also use the "Deploy to Heroku" button below to create and deploy the app with a single click:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/rotarrares/abacus-adventure-number-quest)

## 📄 License

This project is open-source, free to use and modify for educational purposes.