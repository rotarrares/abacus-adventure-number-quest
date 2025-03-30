import React, { Suspense } from 'react'; // Import Suspense
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import './i18n'; // Import i18next configuration
import App from './App';
import { GameProvider } from './context/GameContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Wrap App with Suspense */}
    <Suspense fallback={<div>Loading...</div>}> 
      <GameProvider>
        <App />
      </GameProvider>
    </Suspense>
  </React.StrictMode>
);
