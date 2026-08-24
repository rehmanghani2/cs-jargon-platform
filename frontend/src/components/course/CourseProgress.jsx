import { motion } from 'framer-motion';
import { FiCheckCircle, FiClock, FiBook, FiAward } from 'react-icons/fi';
import PropTypes from 'prop-types';
import ProgressBar from '@components/common/ProgressBar';
import Badge from '@components/common/Badge';

const CourseProgress = ({
  course,
  progress = 0,
  completedModules = 0,
  totalModules = 0,
  timeSpent = '0h',
  estimatedTimeRemaining = '0h',
  lastActivity,
  certificateEarned = false,
  grade,
}) => {
  const progressPercentage = totalModules > 0
    ? Math.round((completedModules / totalModules) * 100)
    : 0;

  const isCompleted = progress === 100 || completedModules === totalModules;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {course?.title || 'Course Progress'}
            </h3>
            <div className="flex items-center gap-2">
              {isCompleted && (
                <Badge variant="success" leftIcon={<FiCheckCircle />}>
                  Completed
                </Badge>
              )}
              {certificateEarned && (
                <Badge variant="warning" leftIcon={<FiAward />}>
                  Certificate Earned
                </Badge>
              )}
            </div>
          </div>
          {grade && (
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {grade}%
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Final Grade</p>
            </div>
          )}
        </div>
      </div>

      {/* Progress Details */}
      <div className="p-6 space-y-6">
        {/* Main Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Overall Progress
            </span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {progress}%
            </span>
          </div>
          <ProgressBar
            value={progress}
            max={100}
            variant={isCompleted ? 'success' : 'primary'}
            showLabel={false}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Modules Completed */}
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <FiBook className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {completedModules}/{totalModules}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Modules</div>
          </div>

          {/* Time Spent */}
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <FiClock className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {timeSpent}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Time Spent</div>
          </div>

          {/* Estimated Time Remaining */}
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <FiClock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {estimatedTimeRemaining}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Remaining</div>
          </div>

          {/* Completion Rate */}
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <FiCheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {progressPercentage}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Complete</div>
          </div>
        </div>

        {/* Last Activity */}
        {lastActivity && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Last activity
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {lastActivity}
              </span>
            </div>
          </div>
        )}

        {/* Completion Message */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <FiCheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                  Course Completed! 🎉
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Congratulations on completing this course! {certificateEarned
                    ? 'Your certificate is ready to download.'
                    : 'Keep up the great work!'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* In Progress Message */}
        {!isCompleted && progress > 0 && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Keep going!</strong> You're {progress}% through this course. Complete{' '}
              {totalModules - completedModules} more {totalModules - completedModules === 1 ? 'module' : 'modules'} to finish.
            </p>
          </div>
        )}

        {/* Not Started Message */}
        {progress === 0 && (
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <p className="text-sm text-purple-700 dark:text-purple-300">
              <strong>Ready to start?</strong> This course has {totalModules} modules waiting for you.
              Begin your learning journey today!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

CourseProgress.propTypes = {
  course: PropTypes.shape({
    title: PropTypes.string,
  }),
  progress: PropTypes.number,
  completedModules: PropTypes.number,
  totalModules: PropTypes.number,
  timeSpent: PropTypes.string,
  estimatedTimeRemaining: PropTypes.string,
  lastActivity: PropTypes.string,
  certificateEarned: PropTypes.bool,
  grade: PropTypes.number,
};

export default CourseProgress;