import { motion } from 'framer-motion';
import { FiCheckCircle, FiCircle } from 'react-icons/fi';
import PropTypes from 'prop-types';
import Badge from '@components/common/Badge';

const PlacementQuestion = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  showCorrectAnswer = false,
  correctAnswer,
}) => {
  const { text, options, difficulty, category } = question;

  const isAnswerCorrect = (index) => {
    return showCorrectAnswer && index === correctAnswer;
  };

  const isAnswerWrong = (index) => {
    return showCorrectAnswer && index === selectedAnswer && selectedAnswer !== correctAnswer;
  };

  const getOptionClassName = (index) => {
    const baseClasses =
      'w-full text-left p-4 rounded-lg border-2 transition-all duration-200 group';

    if (showCorrectAnswer) {
      if (isAnswerCorrect(index)) {
        return `${baseClasses} border-green-500 bg-green-50 dark:bg-green-900/20`;
      }
      if (isAnswerWrong(index)) {
        return `${baseClasses} border-red-500 bg-red-50 dark:bg-red-900/20`;
      }
      return `${baseClasses} border-gray-200 dark:border-gray-700 opacity-50`;
    }

    if (selectedAnswer === index) {
      return `${baseClasses} border-blue-500 bg-blue-50 dark:bg-blue-900/20`;
    }

    return `${baseClasses} border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/10`;
  };

  const getOptionIconColor = (index) => {
    if (showCorrectAnswer) {
      if (isAnswerCorrect(index)) return 'text-green-600 dark:text-green-400';
      if (isAnswerWrong(index)) return 'text-red-600 dark:text-red-400';
      return 'text-gray-400 dark:text-gray-600';
    }
    if (selectedAnswer === index) return 'text-blue-600 dark:text-blue-400';
    return 'text-gray-400 dark:text-gray-600 group-hover:text-blue-500';
  };

  const difficultyColors = {
    Easy: 'success',
    Medium: 'warning',
    Hard: 'danger',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      {/* Question Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div className="flex items-center gap-2">
            {difficulty && (
              <Badge variant={difficultyColors[difficulty] || 'info'} size="small">
                {difficulty}
              </Badge>
            )}
            {category && (
              <Badge variant="gray" size="small">
                {category}
              </Badge>
            )}
          </div>
        </div>

        {/* Question Text */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white leading-relaxed">
          {text}
        </h3>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={!showCorrectAnswer ? { scale: 1.01 } : {}}
            whileTap={!showCorrectAnswer ? { scale: 0.99 } : {}}
            onClick={() => !showCorrectAnswer && onAnswerSelect(index)}
            disabled={showCorrectAnswer}
            className={getOptionClassName(index)}
          >
            <div className="flex items-center gap-3">
              {/* Option Icon */}
              <div className={`flex-shrink-0 ${getOptionIconColor(index)}`}>
                {selectedAnswer === index || isAnswerCorrect(index) ? (
                  <FiCheckCircle className="w-6 h-6" />
                ) : (
                  <FiCircle className="w-6 h-6" />
                )}
              </div>

              {/* Option Letter */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  isAnswerCorrect(index)
                    ? 'bg-green-500 text-white'
                    : isAnswerWrong(index)
                    ? 'bg-red-500 text-white'
                    : selectedAnswer === index
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {String.fromCharCode(65 + index)}
              </div>

              {/* Option Text */}
              <div
                className={`flex-1 text-left ${
                  showCorrectAnswer && (isAnswerCorrect(index) || isAnswerWrong(index))
                    ? 'font-medium'
                    : ''
                } ${
                  isAnswerCorrect(index)
                    ? 'text-green-900 dark:text-green-100'
                    : isAnswerWrong(index)
                    ? 'text-red-900 dark:text-red-100'
                    : selectedAnswer === index
                    ? 'text-blue-900 dark:text-blue-100'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {option}
              </div>

              {/* Correct/Wrong Indicator */}
              {showCorrectAnswer && (
                <>
                  {isAnswerCorrect(index) && (
                    <Badge variant="success" size="small">
                      Correct
                    </Badge>
                  )}
                  {isAnswerWrong(index) && (
                    <Badge variant="danger" size="small">
                      Wrong
                    </Badge>
                  )}
                </>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Selection Hint */}
      {!showCorrectAnswer && !selectedAnswer && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
          Select an answer to continue
        </p>
      )}
    </motion.div>
  );
};

PlacementQuestion.propTypes = {
  question: PropTypes.shape({
    text: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    difficulty: PropTypes.string,
    category: PropTypes.string,
  }).isRequired,
  questionNumber: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  selectedAnswer: PropTypes.number,
  onAnswerSelect: PropTypes.func.isRequired,
  showCorrectAnswer: PropTypes.bool,
  correctAnswer: PropTypes.number,
};

export default PlacementQuestion;