import { motion } from 'framer-motion';
import { FiStar, FiTrendingUp, FiBookOpen } from 'react-icons/fi';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Badge from '@components/common/Badge';
import Button from '@components/common/Button';

const JargonOfWeek = ({ jargon, onLearnMore }) => {
  const navigate = useNavigate();

  if (!jargon) {
    return null;
  }

  const difficultyColors = {
    Beginner: 'success',
    Intermediate: 'warning',
    Advanced: 'danger',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 p-6 relative overflow-hidden"
    >
      {/* Badge */}
      <div className="absolute top-4 right-4">
        <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <FiStar className="w-3 h-3 fill-current" />
          Jargon of the Week
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant={difficultyColors[jargon.difficulty] || 'info'}>
            {jargon.difficulty}
          </Badge>
          {jargon.category && (
            <Badge variant="gray">{jargon.category}</Badge>
          )}
          {jargon.trending && (
            <Badge variant="warning" leftIcon={<FiTrendingUp />}>
              Trending
            </Badge>
          )}
        </div>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {jargon.term}
        </h3>

        {jargon.pronunciation && (
          <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-3">
            {jargon.pronunciation}
          </p>
        )}

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          {jargon.definition}
        </p>

        {/* Quick Example */}
        {jargon.examples && jargon.examples.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Quick Example:
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 italic">
              "{jargon.examples[0]}"
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          {jargon.views && (
            <div className="flex items-center gap-1">
              <FiBookOpen className="w-4 h-4" />
              <span>{jargon.views.toLocaleString()} views</span>
            </div>
          )}
          {jargon.learnedBy && (
            <div>
              <span className="font-medium text-green-600 dark:text-green-400">
                {jargon.learnedBy.toLocaleString()}
              </span>{' '}
              people learned this
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="primary"
          onClick={() => navigate(`/jargon/${jargon._id}`)}
          fullWidth
        >
          Learn More
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/jargon/flashcards')}
        >
          Practice
        </Button>
      </div>

      {/* Decorative Element */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20" />
      <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20" />
    </motion.div>
  );
};

JargonOfWeek.propTypes = {
  jargon: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    term: PropTypes.string.isRequired,
    definition: PropTypes.string.isRequired,
    pronunciation: PropTypes.string,
    difficulty: PropTypes.string,
    category: PropTypes.string,
    examples: PropTypes.arrayOf(PropTypes.string),
    trending: PropTypes.bool,
    views: PropTypes.number,
    learnedBy: PropTypes.number,
  }),
  onLearnMore: PropTypes.func,
};

export default JargonOfWeek;