import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiBook,
  FiStar,
  FiCheck,
  FiCopy,
  FiShare2,
  FiExternalLink,
  FiCode,
} from 'react-icons/fi';
import PropTypes from 'prop-types';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import toast from 'react-hot-toast';

const JargonDetail = ({
  jargon,
  relatedTerms = [],
  isLearned = false,
  isFavorite = false,
  onToggleLearned,
  onToggleFavorite,
}) => {
  const [copiedCode, setCopiedCode] = useState(null);

  const {
    term,
    definition,
    pronunciation,
    category,
    difficulty,
    examples = [],
    codeExamples = [],
    relatedConcepts = [],
    resources = [],
  } = jargon;

  const difficultyColors = {
    Beginner: 'success',
    Intermediate: 'warning',
    Advanced: 'danger',
  };

  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(index);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: term,
        text: definition,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <FiBook className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <Badge variant={difficultyColors[difficulty] || 'info'}>
                {difficulty}
              </Badge>
              {category && <Badge variant="gray">{category}</Badge>}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {term}
            </h1>
            {pronunciation && (
              <p className="text-lg text-gray-600 dark:text-gray-400 italic">
                {pronunciation}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant={isFavorite ? 'warning' : 'outline'}
              size="small"
              onClick={onToggleFavorite}
              leftIcon={<FiStar className={isFavorite ? 'fill-current' : ''} />}
            >
              {isFavorite ? 'Favorited' : 'Favorite'}
            </Button>
            <Button
              variant={isLearned ? 'success' : 'outline'}
              size="small"
              onClick={onToggleLearned}
              leftIcon={<FiCheck />}
            >
              {isLearned ? 'Learned' : 'Mark as Learned'}
            </Button>
            <Button variant="ghost" size="small" onClick={handleShare}>
              <FiShare2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Definition */}
        <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
          {definition}
        </p>
      </div>

      {/* Examples */}
      {examples.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Examples
          </h2>
          <div className="space-y-4">
            {examples.map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-blue-500"
              >
                <p className="text-gray-700 dark:text-gray-300 italic">"{example}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Code Examples */}
      {codeExamples.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FiCode className="w-6 h-6 mr-2" />
            Code Examples
          </h2>
          <div className="space-y-4">
            {codeExamples.map((example, index) => (
              <div key={index} className="relative">
                <div className="flex items-center justify-between mb-2">
                  {example.title && (
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {example.title}
                    </p>
                  )}
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => handleCopyCode(example.code, index)}
                    leftIcon={copiedCode === index ? <FiCheck /> : <FiCopy />}
                  >
                    {copiedCode === index ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">{example.code}</code>
                </pre>
                {example.description && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {example.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Concepts */}
      {relatedConcepts.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Related Concepts
          </h2>
          <div className="flex flex-wrap gap-2">
            {relatedConcepts.map((concept, index) => (
              <Badge key={index} variant="info" size="large">
                {concept}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Related Terms */}
      {relatedTerms.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Related Terms
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTerms.map((relatedTerm) => (
              <motion.a
                key={relatedTerm._id}
                href={`/jargon/${relatedTerm._id}`}
                whileHover={{ scale: 1.02 }}
                className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                      {relatedTerm.term}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {relatedTerm.definition}
                    </p>
                  </div>
                  <FiExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      )}

      {/* Additional Resources */}
      {resources.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Additional Resources
          </h2>
          <div className="space-y-3">
            {resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors group"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {resource.title}
                  </p>
                  {resource.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {resource.description}
                    </p>
                  )}
                </div>
                <FiExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

JargonDetail.propTypes = {
  jargon: PropTypes.shape({
    term: PropTypes.string.isRequired,
    definition: PropTypes.string.isRequired,
    pronunciation: PropTypes.string,
    category: PropTypes.string,
    difficulty: PropTypes.string,
    examples: PropTypes.arrayOf(PropTypes.string),
    codeExamples: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        code: PropTypes.string.isRequired,
        description: PropTypes.string,
      })
    ),
    relatedConcepts: PropTypes.arrayOf(PropTypes.string),
    resources: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        description: PropTypes.string,
      })
    ),
  }).isRequired,
  relatedTerms: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      term: PropTypes.string.isRequired,
      definition: PropTypes.string.isRequired,
    })
  ),
  isLearned: PropTypes.bool,
  isFavorite: PropTypes.bool,
  onToggleLearned: PropTypes.func,
  onToggleFavorite: PropTypes.func,
};

export default JargonDetail;