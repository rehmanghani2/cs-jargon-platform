import { motion } from 'framer-motion';
import { FiBook, FiClock, FiUsers, FiStar, FiPlay, FiCheckCircle } from 'react-icons/fi';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Badge from '@components/common/Badge';
import ProgressBar from '@components/common/ProgressBar';
import Button from '@components/common/Button';

const CourseCard = ({
  course,
  showProgress = false,
  showEnrollButton = true,
  onEnroll,
  isEnrolled = false,
  variant = 'default', // 'default', 'compact', 'featured'
}) => {
  const navigate = useNavigate();

  const {
    _id,
    title,
    description,
    thumbnail,
    instructor,
    duration,
    level,
    category,
    studentsEnrolled = 0,
    rating = 0,
    reviewsCount = 0,
    modules = [],
    progress = 0,
    isCompleted = false,
  } = course;

  const difficultyColors = {
    Beginner: 'success',
    Intermediate: 'warning',
    Advanced: 'danger',
  };

  const handleCardClick = () => {
    navigate(`/courses/${_id}`);
  };

  const handleEnrollClick = (e) => {
    e.stopPropagation();
    if (onEnroll) onEnroll(course);
  };

  const handleContinueClick = (e) => {
    e.stopPropagation();
    navigate(`/courses/${_id}`);
  };

  // Compact variant
  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex items-start gap-3">
          <img
            src={thumbnail || '/images/default-course.jpg'}
            alt={title}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 truncate">
              {title}
            </h3>
            {showProgress && (
              <ProgressBar value={progress} max={100} size="small" variant="primary" />
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {modules.length} modules
              </span>
              {isCompleted && (
                <FiCheckCircle className="w-4 h-4 text-green-500" />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Featured variant
  if (variant === 'featured') {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg overflow-hidden cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="p-6 text-white">
          <Badge variant="gray" className="mb-3">
            Featured Course
          </Badge>
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-blue-100 mb-4 line-clamp-2">{description}</p>
          <div className="flex items-center gap-4 text-sm mb-4">
            <div className="flex items-center">
              <FiStar className="w-4 h-4 mr-1 fill-current text-yellow-300" />
              <span>{rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center">
              <FiUsers className="w-4 h-4 mr-1" />
              <span>{studentsEnrolled.toLocaleString()} students</span>
            </div>
          </div>
          <Button variant="secondary" fullWidth onClick={handleEnrollClick}>
            {isEnrolled ? 'Continue Learning' : 'Enroll Now'}
          </Button>
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
      {/* Thumbnail */}
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <img
          src={thumbnail || '/images/default-course.jpg'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {isCompleted && (
          <div className="absolute top-3 right-3 bg-green-500 text-white p-2 rounded-full">
            <FiCheckCircle className="w-5 h-5" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge variant={difficultyColors[level] || 'info'}>{level}</Badge>
        </div>
        {showProgress && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <ProgressBar value={progress} max={100} size="small" variant="success" />
            <p className="text-xs text-white mt-1">{progress}% Complete</p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase">
            {category}
          </span>
          {rating > 0 && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <FiStar className="w-4 h-4 mr-1 fill-current text-yellow-400" />
              <span className="font-medium">{rating.toFixed(1)}</span>
              <span className="ml-1">({reviewsCount})</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center">
            <FiBook className="w-4 h-4 mr-1" />
            <span>{modules.length} modules</span>
          </div>
          <div className="flex items-center">
            <FiClock className="w-4 h-4 mr-1" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center">
            <FiUsers className="w-4 h-4 mr-1" />
            <span>{studentsEnrolled}</span>
          </div>
        </div>

        {/* Instructor */}
        {instructor && (
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <img
              src={instructor.avatar || '/images/default-avatar.png'}
              alt={instructor.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Instructor</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {instructor.name}
              </p>
            </div>
          </div>
        )}

        {/* Action Button */}
        {showEnrollButton && (
          <div onClick={(e) => e.stopPropagation()}>
            {isEnrolled ? (
              <Button
                variant="primary"
                fullWidth
                leftIcon={<FiPlay />}
                onClick={handleContinueClick}
              >
                Continue Learning
              </Button>
            ) : (
              <Button variant="outline" fullWidth onClick={handleEnrollClick}>
                Enroll Now
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

CourseCard.propTypes = {
  course: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    thumbnail: PropTypes.string,
    instructor: PropTypes.shape({
      name: PropTypes.string,
      avatar: PropTypes.string,
    }),
    duration: PropTypes.string,
    level: PropTypes.string,
    category: PropTypes.string,
    studentsEnrolled: PropTypes.number,
    rating: PropTypes.number,
    reviewsCount: PropTypes.number,
    modules: PropTypes.array,
    progress: PropTypes.number,
    isCompleted: PropTypes.bool,
  }).isRequired,
  showProgress: PropTypes.bool,
  showEnrollButton: PropTypes.bool,
  onEnroll: PropTypes.func,
  isEnrolled: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'compact', 'featured']),
};

export default CourseCard;