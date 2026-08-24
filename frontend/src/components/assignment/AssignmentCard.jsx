import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiFileText, FiCheckCircle, FiAlertCircle, FiEye } from 'react-icons/fi';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Badge from '@components/common/Badge';
import Button from '@components/common/Button';
import { formatDate, formatTimeAgo } from '@utils/formatters';

const AssignmentCard = ({
  assignment,
  variant = 'default', // 'default', 'compact'
  showCourse = true,
}) => {
  const navigate = useNavigate();

  const {
    _id,
    title,
    description,
    course,
    dueDate,
    points,
    status,
    submittedAt,
    grade,
    isOverdue,
  } = assignment;

  const statusConfig = {
    pending: {
      variant: 'warning',
      label: 'Pending',
      icon: FiClock,
    },
    submitted: {
      variant: 'info',
      label: 'Submitted',
      icon: FiCheckCircle,
    },
    graded: {
      variant: 'success',
      label: 'Graded',
      icon: FiCheckCircle,
    },
    overdue: {
      variant: 'danger',
      label: 'Overdue',
      icon: FiAlertCircle,
    },
  };

  const currentStatus = isOverdue && status === 'pending' ? 'overdue' : status;
  const config = statusConfig[currentStatus] || statusConfig.pending;
  const StatusIcon = config.icon;

  const getDaysRemaining = () => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `${diffDays} days left`;
  };

  const handleClick = () => {
    navigate(`/assignments/${_id}`);
  };

  // Compact variant
  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ x: 4 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-blue-500 dark:border-blue-400 shadow-sm cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {title}
              </h3>
              <Badge variant={config.variant} size="small">
                {config.label}
              </Badge>
            </div>
            {showCourse && course && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {course.title}
              </p>
            )}
            <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
              <span className="flex items-center">
                <FiCalendar className="w-3 h-3 mr-1" />
                {formatDate(dueDate)}
              </span>
              <span className="flex items-center">
                <FiFileText className="w-3 h-3 mr-1" />
                {points} points
              </span>
            </div>
          </div>
          {grade && (
            <div className="text-right flex-shrink-0">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {grade}
              </div>
              <div className="text-xs text-gray-500">/ {points}</div>
            </div>
          )}
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
      onClick={handleClick}
    >
      {/* Header with Status */}
      <div className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 ${
        isOverdue && status === 'pending'
          ? 'bg-red-50 dark:bg-red-900/10'
          : 'bg-gray-50 dark:bg-gray-700/50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon className={`w-4 h-4 ${
              isOverdue && status === 'pending'
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-600 dark:text-gray-400'
            }`} />
            <Badge variant={config.variant}>
              {config.label}
            </Badge>
            {grade && (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {grade}/{points} points
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {getDaysRemaining()}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
          {title}
        </h3>

        {/* Course Name */}
        {showCourse && course && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <FiFileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Course</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {course.title}
              </p>
            </div>
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center">
            <FiCalendar className="w-4 h-4 mr-1" />
            <span>Due {formatDate(dueDate)}</span>
          </div>
          <div className="flex items-center">
            <FiFileText className="w-4 h-4 mr-1" />
            <span>{points} points</span>
          </div>
        </div>

        {/* Submission Info */}
        {submittedAt && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mb-4">
            <p className="text-sm text-green-700 dark:text-green-400">
              <FiCheckCircle className="inline w-4 h-4 mr-1" />
              Submitted {formatTimeAgo(submittedAt)}
            </p>
          </div>
        )}

        {/* Overdue Warning */}
        {isOverdue && status === 'pending' && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-700 dark:text-red-400">
              <FiAlertCircle className="inline w-4 h-4 mr-1" />
              This assignment is overdue!
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant={status === 'pending' ? 'primary' : 'outline'}
            fullWidth
            leftIcon={status === 'pending' ? <FiFileText /> : <FiEye />}
            onClick={handleClick}
          >
            {status === 'pending' ? 'Submit Assignment' : 'View Details'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

AssignmentCard.propTypes = {
  assignment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    course: PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string,
    }),
    dueDate: PropTypes.string.isRequired,
    points: PropTypes.number.isRequired,
    status: PropTypes.oneOf(['pending', 'submitted', 'graded']).isRequired,
    submittedAt: PropTypes.string,
    grade: PropTypes.number,
    isOverdue: PropTypes.bool,
  }).isRequired,
  variant: PropTypes.oneOf(['default', 'compact']),
  showCourse: PropTypes.bool,
};

export default AssignmentCard;