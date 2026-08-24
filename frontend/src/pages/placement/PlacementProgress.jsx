import { motion } from 'framer-motion';
import { FiCheckCircle, FiCircle, FiClock } from 'react-icons/fi';
import PropTypes from 'prop-types';
import ProgressBar from '@components/common/ProgressBar';
import Badge from '@components/common/Badge';

const PlacementProgress = ({
  totalQuestions,
  currentQuestion,
  answeredQuestions = [],
  timeRemaining,
  onQuestionNavigate,
}) => {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const answeredCount = answeredQuestions.length;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionStatus = (index) => {
    if (answeredQuestions.includes(index)) return 'answered';
    if (index === currentQuestion) return 'current';
    return 'unanswered';
  };

  const statusConfig = {
    answered: {
      className: 'bg-green-500 text-white',
      icon: FiCheckCircle,
    },
    current: {
      className: 'bg-blue-500 text-white ring-4 ring-blue-200 dark:ring-blue-900',
      icon: FiCircle,
    },
    unanswered: {
      className: 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
      icon: FiCircle,
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
      {/* Progress Summary */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Test Progress
          </h3>
          {timeRemaining !== undefined && (
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
              <FiClock className="w-4 h-4" />
              <span className="font-mono font-semibold">
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
        </div>
        <ProgressBar value={progress} max={100} variant="primary" showLabel />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalQuestions}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
        </div>
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {answeredCount}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Answered</div>
        </div>
        <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {totalQuestions - answeredCount}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Remaining</div>
        </div>
      </div>

      {/* Question Navigator */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Question Navigator
          </h4>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded" />
              <span className="text-gray-600 dark:text-gray-400">Answered</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded" />
              <span className="text-gray-600 dark:text-gray-400">Current</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
              <span className="text-gray-600 dark:text-gray-400">Unanswered</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: totalQuestions }, (_, index) => {
            const status = getQuestionStatus(index);
            const config = statusConfig[status];
            const Icon = config.icon;

            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onQuestionNavigate && onQuestionNavigate(index)}
                className={`aspect-square rounded-lg font-semibold text-sm transition-all ${config.className}`}
                disabled={status === 'current'}
              >
                {index + 1}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Warnings */}
      {answeredCount < totalQuestions && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <p className="text-sm text-yellow-700 dark:text-yellow-300 flex items-center">
            <FiCircle className="w-4 h-4 mr-2" />
            You have {totalQuestions - answeredCount} unanswered question
            {totalQuestions - answeredCount !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {timeRemaining !== undefined && timeRemaining < 300 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-700 dark:text-red-300 flex items-center">
            <FiClock className="w-4 h-4 mr-2" />
            Less than 5 minutes remaining!
          </p>
        </div>
      )}
    </div>
  );
};

PlacementProgress.propTypes = {
  totalQuestions: PropTypes.number.isRequired,
  currentQuestion: PropTypes.number.isRequired,
  answeredQuestions: PropTypes.arrayOf(PropTypes.number),
  timeRemaining: PropTypes.number,
  onQuestionNavigate: PropTypes.func,
};

export default PlacementProgress;