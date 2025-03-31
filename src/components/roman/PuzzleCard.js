import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/roman/PuzzleCard.css'; // Styles to be created later

/**
 * Component to display the current Roman numeral puzzle task.
 * @param {Object} props - Component props
 * @param {Object} props.task - The current task object from useRomanTreasureGame hook.
 *                              (e.g., { type: 'read', question: 'XIV', answer: 14, options: [...] })
 */
const PuzzleCard = ({ task }) => {
  const { t } = useTranslation();

  if (!task) {
    return <div className="puzzle-card loading">{t('roman_treasure.loading_task')}</div>;
  }

  const getTaskText = () => {
    switch (task.type) {
      case 'match_symbol':
        return t('roman_treasure.task_match_symbol', { symbol: task.question });
      case 'build_add':
      case 'write_subtract':
      case 'write_mixed':
      case 'write_challenge':
        return t('roman_treasure.task_write_number', { number: task.question });
      case 'read_subtract':
      case 'read_mixed':
      case 'read_challenge':
        return t('roman_treasure.task_read_roman', { roman: task.question });
      default:
        return t('roman_treasure.task_default');
    }
  };

  return (
    <div className="puzzle-card">
      <p className="puzzle-instruction">{getTaskText()}</p>
      {/* Optionally display the question again clearly if needed */}
      {/* <h3 className="puzzle-question-display">{task.question}</h3> */}
    </div>
  );
};

export default PuzzleCard;
