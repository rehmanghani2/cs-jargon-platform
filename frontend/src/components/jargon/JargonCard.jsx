import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBook, FiStar, FiCheck, FiChevronRight } from 'react-icons/fi';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Badge from '@components/common/Badge';

const JargonCard = ({
  jargon,
  variant = 'default', // 'default', 'flashcard', 'compact'
  onToggleLearned,
  onToggleFavorite,
  isLearned = false,
  isFavorite = false,
}) => {
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);

  const {
    _id,
    term,
    definition,
    category,
    difficulty,
    pronunciation,
    examples = [],
  } = jargon;

  const difficultyColors = {
    Beginner: 'success',
    Intermediate: 'warning',
    Advanced: 'danger',
  };

  const handleCardClick = () => {
    if (variant === 'flashcard') {
      setIsFlipped(!isFlipped);
    } else {
      navigate(`/jargon/${_id}`);
    }
  };

  const handleToggleLearned = (e) => {
    e.stopPropagation();
    if (onToggleLearned) onToggleLearned(_id);
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    if (onToggleFavorite) onToggleFavorite(_id);
  };

  // Flashcard variant
  if (variant === 'flashcard') {
    return (
      <motion.div
        className="relative h-64 cursor-pointer perspective-1000"
        onClick={handleCardClick}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isFlipped ? 'definition' : 'term'}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center justify-center text-center"
          >
            {!isFlipped ? (
              // Front - Term
              <div className="space-y-4">
                <Badge variant={difficultyColors[difficulty] || 'info'}>
                  {difficulty}
                </Badge>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {term}
                </h3>
                {pronunciation && (
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    {pronunciation}
                  </p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                  Tap to see definition
                </p>
              </div>
            ) : (
              // Back - Definition
              <div className="space-y-4 max-h-full overflow-y-auto">
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  {definition}
                </p>
                {examples.length > 0 && (
                  <div className="mt-4 text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Example:
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                      "{examples[0]}"
                    </p>
                  </div>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                  Tap to see term
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ x: 4 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {term}
              </h3>
              {isLearned && (
                <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
              {definition}
            </p>
          </div>
          <Badge variant={difficultyColors[difficulty] || 'info'} size="small">
            {difficulty}
          </Badge>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <FiBook className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <Badge variant={difficultyColors[difficulty] || 'info'} size="small">
                {difficulty}
              </Badge>
              {category && (
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {category}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {term}
            </h3>
            {pronunciation && (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-1">
                {pronunciation}
              </p>
            )}
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <button
              className={`p-2 rounded-lg transition-colors ${
                isFavorite
                  ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                  : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
              }`}
              onClick={handleToggleFavorite}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <FiStar className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              className={`p-2 rounded-lg transition-colors ${
                isLearned
                  ? 'text-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
              }`}
              onClick={handleToggleLearned}
              title={isLearned ? 'Mark as unlearned' : 'Mark as learned'}
            >
              <FiCheck className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Definition */}
        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
          {definition}
        </p>

        {/* Example */}
        {examples.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Example:
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 italic line-clamp-2">
              "{examples[0]}"
            </p>
          </div>
        )}

        {/* Status Indicators */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            {isLearned && (
              <span className="flex items-center text-green-600 dark:text-green-400">
                <FiCheck className="w-3 h-3 mr-1" />
                Learned
              </span>
            )}
            {isFavorite && (
              <span className="flex items-center text-yellow-600 dark:text-yellow-400">
                <FiStar className="w-3 h-3 mr-1" />
                Favorite
              </span>
            )}
          </div>
          <FiChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
        </div>
      </div>
    </motion.div>
  );
};

JargonCard.propTypes = {
  jargon: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    term: PropTypes.string.isRequired,
    definition: PropTypes.string.isRequired,
    category: PropTypes.string,
    difficulty: PropTypes.string,
    pronunciation: PropTypes.string,
    examples: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  variant: PropTypes.oneOf(['default', 'flashcard', 'compact']),
  onToggleLearned: PropTypes.func,
  onToggleFavorite: PropTypes.func,
  isLearned: PropTypes.bool,
  isFavorite: PropTypes.bool,
};

export default JargonCard;