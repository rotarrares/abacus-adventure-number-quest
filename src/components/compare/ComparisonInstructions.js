import React, { useState } from 'react';
import { getPlaceValueName } from '../../utils/compareNumbersUtils';
import '../../styles/ComparisonInstructions.css';

/**
 * Component displaying instructions for the number comparison game
 * 
 * @param {Object} props
 * @param {number} props.level - Current game level
 * @param {Object} props.difficultyLevel - Current difficulty level settings
 */
const ComparisonInstructions = ({ level, difficultyLevel }) => {
  const [showGuide, setShowGuide] = useState(false);
  
  // Generate instructions text based on the current difficulty level
  const getInstructionsText = () => {
    const usedPlaceValues = difficultyLevel.usedPlaceValues;
    const placeValueNames = usedPlaceValues.map(pv => getPlaceValueName(pv));
    
    // For level 1 (most basic)
    if (level <= 5) {
      return (
        <>
          <p>Pune mărgelele pe abacuri pentru a reprezenta numerele:</p>
          <ul>
            <li>Abacul din stânga pentru primul număr</li>
            <li>Abacul din dreapta pentru al doilea număr</li>
          </ul>
          <p>Apoi, compară valorile din {placeValueNames.join(' și ')} pentru a determina care număr este mai mare.</p>
        </>
      );
    }
    
    // For higher levels
    return (
      <>
        <p>Construiește numerele pe abacuri, apoi compară-le începând cu cea mai mare valoare de poziție ({placeValueNames[0]}):</p>
        <ul>
          <li>Dacă valorile sunt egale, treci la următoarea poziție</li>
          <li>Dacă valorile sunt diferite, numărul cu valoarea mai mare este mai mare</li>
        </ul>
        <p>Selectează simbolul de comparare corect (mai mic decât, mai mare decât, sau egal cu).</p>
      </>
    );
  };
  
  // Show comprehensive step-by-step guide
  const renderComparisonGuide = () => (
    <div className="comparison-guide">
      <h4>Ghid de Comparare</h4>
      <ol>
        <li>
          <span className="step-number">1</span>
          <span className="step-text">Construiește numerele pe cele două abacuri</span>
        </li>
        <li>
          <span className="step-number">2</span>
          <span className="step-text">Începe cu poziția de cea mai mare valoare (Mii - M)</span>
        </li>
        <li>
          <span className="step-number">3</span>
          <span className="step-text">Compară mărgelele de pe aceeași poziție pe ambele abacuri</span>
        </li>
        <li>
          <span className="step-number">4</span>
          <span className="step-text">Dacă valorile sunt egale, treci la următoarea poziție (Sute - S)</span>
        </li>
        <li>
          <span className="step-number">5</span>
          <span className="step-text">Continuă până găsești o diferență sau verifici toate pozițiile</span>
        </li>
        <li>
          <span className="step-number">6</span>
          <span className="step-text">Alege simbolul de comparare corect:
            <ul>
              <li>&lt; (mai mic decât): Când primul număr este mai mic</li>
              <li>&gt; (mai mare decât): Când primul număr este mai mare</li>
              <li>= (egal cu): Când numerele sunt identice</li>
            </ul>
          </span>
        </li>
      </ol>
    </div>
  );
  
  return (
    <div className="comparison-instructions">
      <div className="instructions-content">
        <h3>Instrucțiuni:</h3>
        <div className="basic-instructions">
          {getInstructionsText()}
        </div>
        
        <button 
          className="guide-toggle-button"
          onClick={() => setShowGuide(!showGuide)}
        >
          {showGuide ? 'Ascunde ghidul' : 'Arată ghidul de comparare'}
        </button>
        
        {showGuide && renderComparisonGuide()}
      </div>
      
      <div className="number-line">
        <div className="number-line-label">Linie Numerică:</div>
        <div className="number-line-graphic">
          <div className="number-point">0</div>
          <div className="number-line-segment"></div>
          {difficultyLevel.range.max <= 100 ? (
            // Show more points for smaller ranges
            <>
              <div className="number-point">25</div>
              <div className="number-line-segment"></div>
              <div className="number-point">50</div>
              <div className="number-line-segment"></div>
              <div className="number-point">75</div>
              <div className="number-line-segment"></div>
              <div className="number-point">100</div>
            </>
          ) : difficultyLevel.range.max <= 1000 ? (
            // Fewer points for medium ranges
            <>
              <div className="number-point">250</div>
              <div className="number-line-segment"></div>
              <div className="number-point">500</div>
              <div className="number-line-segment"></div>
              <div className="number-point">750</div>
              <div className="number-line-segment"></div>
              <div className="number-point">1000</div>
            </>
          ) : (
            // Even fewer points for large ranges
            <>
              <div className="number-point">2500</div>
              <div className="number-line-segment"></div>
              <div className="number-point">5000</div>
              <div className="number-line-segment"></div>
              <div className="number-point">7500</div>
              <div className="number-line-segment"></div>
              <div className="number-point">10000</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparisonInstructions;
