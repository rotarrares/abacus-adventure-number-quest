import React, { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next'; // Kept from game2 branch
import { useGameContext } from './context/GameContext';
import './styles/App.css'; // Moved CSS import to the top with other imports

// Lazy load screen components
const StartScreen = lazy(() => import('./components/screens/StartScreen'));
const GameScreen = lazy(() => import('./components/screens/GameScreen'));
const TutorialScreen = lazy(() => import('./components/screens/TutorialScreen'));
const BackgroundContainer = lazy(() => import('./components/screens/BackgroundContainer')); // Also lazy load container if possible

// Simple loading fallback component using translation
const LoadingFallback = () => {
  const { t } = useTranslation(); // Kept from game2 branch
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5rem' }}>
      {t('loading_text')} {/* Use translation key */}
    </div>
  );
};


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
    <Suspense fallback={<LoadingFallback />}>
      <BackgroundContainer>
        <div className="app">
          {renderScreen()}
        </div>
      </BackgroundContainer>
    </Suspense>
  );
}

export default App;
