import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiVolume2, FiMaximize } from 'react-icons/fi';
import PropTypes from 'prop-types';

const LessonContent = ({ lesson, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const { type, content, videoUrl, duration } = lesson;

  const renderVideoPlayer = () => (
    <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
      {videoUrl ? (
        <video
          className="w-full h-full"
          src={videoUrl}
          controls
          onEnded={onComplete}
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-white">
            <FiPlay className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-gray-400">Video coming soon</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderTextContent = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );

  const renderQuizContent = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
      <div className="text-center py-12">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Quiz: {lesson.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Test your knowledge with this quiz
        </p>
        {/* Quiz component would be loaded here */}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Quiz component coming soon
        </p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case 'video':
        return renderVideoPlayer();
      case 'text':
      case 'article':
        return renderTextContent();
      case 'quiz':
        return renderQuizContent();
      default:
        return renderTextContent();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {renderContent()}
    </motion.div>
  );
};

LessonContent.propTypes = {
  lesson: PropTypes.shape({
    type: PropTypes.oneOf(['video', 'text', 'article', 'quiz']).isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string,
    videoUrl: PropTypes.string,
    duration: PropTypes.string,
  }).isRequired,
  onComplete: PropTypes.func,
};

export default LessonContent;