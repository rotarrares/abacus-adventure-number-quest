import React, { useState, useEffect } from 'react';
import { useGameContext } from '../../context/GameContext';
import { playSound } from '../../utils/audioUtils';
import '../../styles/TutorialScreen.css';

const TutorialScreen = () => {
  const { gameState, dispatch, actions } = useGameContext();
  const [abacusImageLoaded, setAbacusImageLoaded] = useState(false);

  // Check if the abacus example image exists
  useEffect(() => {
    const img = new Image();
    img.onload = () => setAbacusImageLoaded(true);
    img.onerror = () => setAbacusImageLoaded(false);
    img.src = '/assets/images/abacus_example.png';
  }, []);

  const handleBack = () => {
    playSound('click', gameState.sound);
    dispatch({ type: actions.SET_SCREEN, payload: 'start' });
  };

  return (
    <div className="tutorial-screen">
      <div className="tutorial-content">
        <h2>Cum se joacă Abacus Adventure</h2>
        
        <div className="tutorial-section">
          <h3>Ce este abacul?</h3>
          <p>Abacul este un instrument de calcul format din coloane de mărgele. În jocul nostru, avem patru coloane:</p>
          <ul className="column-labels">
            <li><span className="column-label m-label">M</span> - Mii (Thousands)</li>
            <li><span className="column-label s-label">S</span> - Sute (Hundreds)</li>
            <li><span className="column-label z-label">Z</span> - Zeci (Tens)</li>
            <li><span className="column-label u-label">U</span> - Unități (Units)</li>
          </ul>
          <div className="abacus-example">
            {abacusImageLoaded ? (
              <img src="/assets/images/abacus_example.png" alt="Exemplu de abac" />
            ) : (
              <div className="abacus-placeholder">
                Exemplu de Abac
              </div>
            )}
          </div>
        </div>
        
        <div className="tutorial-section">
          <h3>Moduri de joc:</h3>
          
          <div className="game-mode">
            <h4>1. Potrivește Numărul</h4>
            <p>Un număr va fi afișat pe ecran (de exemplu, "2456"). Trebuie să plasezi:</p>
            <ul>
              <li>2 mărgele în coloana "M" (mii)</li>
              <li>4 mărgele în coloana "S" (sute)</li>
              <li>5 mărgele în coloana "Z" (zeci)</li>
              <li>6 mărgele în coloana "U" (unități)</li>
            </ul>
          </div>
          
          <div className="game-mode">
            <h4>2. Citește și Construiește</h4>
            <p>Numărul va fi scris în cuvinte (de exemplu, "două mii patru sute cincizeci și șase").</p>
            <p>Trebuie să interpretezi numărul și să plasezi mărgelele corespunzătoare pe abac.</p>
          </div>
          
          <div className="game-mode">
            <h4>3. Scrie Numărul</h4>
            <p>Abacul va fi deja completat cu mărgele (de exemplu, 3 mărgele în M, 7 în S, 0 în Z, 8 în U).</p>
            <p>Trebuie să scrii numărul în cifre (în acest caz, 3708).</p>
          </div>
        </div>
        
        <div className="tutorial-section">
          <h3>Cum să plasezi mărgelele:</h3>
          <ul>
            <li>Fă click sau atinge o coloană pentru a adăuga o mărgea</li>
            <li>Fă click dreapta sau atinge lung pentru a elimina o mărgea</li>
            <li>În modul mobil, poți folosi și butoanele + și - de lângă fiecare coloană</li>
          </ul>
        </div>
        
        <div className="tutorial-section">
          <h3>Punctaj și Recompense:</h3>
          <ul>
            <li>Primești puncte pentru fiecare răspuns corect</li>
            <li>După mai multe răspunsuri corecte, câștigi stele</li>
            <li>Cufărul cu comori se deschide după fiecare 5 nivele</li>
          </ul>
        </div>
        
        <button className="back-button" onClick={handleBack}>
          Înapoi la Meniu
        </button>
      </div>
    </div>
  );
};

export default TutorialScreen;