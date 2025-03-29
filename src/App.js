import React from 'react';
import { useGameContext } from './context/GameContext';
import StartScreen from './components/screens/StartScreen';
import GameScreen from './components/screens/GameScreen';
import TutorialScreen from './components/screens/TutorialScreen';
import './styles/App.css';

function App() {
  const { gameState } = useGameContext();

  const renderScreen = () => {
    switch (gameState.currentScreen) {
      case 'start':
        return <StartScreen />;
      case 'game':
        return <GameScreen />;
      case 'tutorial':
        return <TutorialScreen />;
      default:
        return <StartScreen />;
    }
  };

  return (
    <div className="app">
      {renderScreen()}
    </div>
  );
}

export default App;