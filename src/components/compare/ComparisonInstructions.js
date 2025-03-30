import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { getPlaceValueName, getPlaceValueLabel } from '../../utils/compareNumbersUtils'; // Note: These might need translation if they return strings directly
import '../../styles/ComparisonInstructions.css';

/**
 * Component displaying instructions for the number comparison game
 * 
 * @param {Object} props
 * @param {number} props.level - Current game level
 * @param {Object} props.difficultyLevel - Current difficulty level settings
 */
const ComparisonInstructions = ({ level, difficultyLevel }) => {
  const { t } = useTranslation(); // Get translation function
  const [showGuide, setShowGuide] = useState(false);
  
  // Generate instructions text based on the current difficulty level
  const getInstructionsText = () => {
    const usedPlaceValues = difficultyLevel.usedPlaceValues;
    // Get both the full name and shorthand label for each place value
    const placeValueDetails = usedPlaceValues.map(pv => 
      `${getPlaceValueName(pv)} (${getPlaceValueLabel(pv)})`
    );
    
    // For level 1 (most basic)
    // TODO: Consider translating placeValueDetails joiner (' și ') if needed, maybe via t function options
    const placeValuesString = placeValueDetails.join(t('and_conjunction', ' and ')); // Add 'and_conjunction' key if needed

    if (level <= 5) {
      return (
        <>
          <p>{t('compare_instructions_level1_part1')}</p>
          <ul>
            <li>{t('compare_instructions_level1_part2_left')}</li>
            <li>{t('compare_instructions_level1_part2_right')}</li>
          </ul>
          <p>{t('compare_instructions_level1_part3', { placeValues: placeValuesString })}</p>
        </>
      );
    }
    
    // For higher levels
    return (
      <>
        <p>{t('compare_instructions_higher_level_part1', { placeValue: placeValueDetails[0] })}</p>
        <ul>
          <li>{t('compare_instructions_higher_level_part2_equal')}</li>
          <li>{t('compare_instructions_higher_level_part2_different')}</li>
        </ul>
        <p>{t('compare_instructions_higher_level_part3')}</p>
      </>
    );
  };
  
  // Show comprehensive step-by-step guide
  const renderComparisonGuide = () => {
    const firstPlaceValueDetail = `${getPlaceValueName(difficultyLevel.usedPlaceValues[0])} (${getPlaceValueLabel(difficultyLevel.usedPlaceValues[0])})`;
    const secondPlaceValueDetail = difficultyLevel.usedPlaceValues.length > 1 
      ? `${getPlaceValueName(difficultyLevel.usedPlaceValues[1])} (${getPlaceValueLabel(difficultyLevel.usedPlaceValues[1])})` 
      : '';

    return (
      <div className="comparison-guide">
        <h4>{t('compare_guide_title')}</h4>
        <ol>
          <li>
            <span className="step-number">1</span>
            <span className="step-text">{t('compare_guide_step1')}</span>
          </li>
          <li>
            <span className="step-number">2</span>
            <span className="step-text">{t('compare_guide_step2', { placeValue: firstPlaceValueDetail })}</span>
          </li>
          <li>
            <span className="step-number">3</span>
            <span className="step-text">{t('compare_guide_step3')}</span>
          </li>
          <li>
            <span className="step-number">4</span>
            <span className="step-text">{t('compare_guide_step4', { placeValue: secondPlaceValueDetail })}</span>
          </li>
          <li>
            <span className="step-number">5</span>
            <span className="step-text">{t('compare_guide_step5')}</span>
          </li>
          <li>
            <span className="step-number">6</span>
            <span className="step-text">{t('compare_guide_step6_title')}
              <ul>
                <li>{t('compare_guide_step6_less')}</li>
                <li>{t('compare_guide_step6_greater')}</li>
                <li>{t('compare_guide_step6_equal')}</li>
              </ul>
            </span>
          </li>
        </ol>
      </div>
    );
  };
  
  return (
    <div className="comparison-instructions">
      <div className="instructions-content">
        <h3>{t('compare_instructions_title')}</h3>
        <div className="basic-instructions">
          {getInstructionsText()}
        </div>
        
        <button 
          className="guide-toggle-button"
          onClick={() => setShowGuide(!showGuide)}
        >
          {showGuide ? t('compare_guide_hide') : t('compare_guide_show')}
        </button>
        
        {showGuide && renderComparisonGuide()}
      </div>
      
      <div className="number-line">
        <div className="number-line-label">{t('compare_number_line_label')}</div>
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
