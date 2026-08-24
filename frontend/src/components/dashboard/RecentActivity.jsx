import { motion } from 'framer-motion';
import {
  FiBook,
  FiCheckCircle,
  FiAward,
  FiFileText,
  FiUser,
  FiTrendingUp,
} from 'react-icons/fi';
import PropTypes from 'prop-types';
import { formatTimeAgo } from '@utils/formatters';
import EmptyState from '@components/common/EmptyState';

const RecentActivity = ({ activities = [], isLoading = false, maxItems = 10 }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'module_completed':
        return FiCheckCircle;
      case 'badge_earned':
        return FiAward;
      case 'assignment_submitted':
        return FiFileText;
      case 'course_enrolled':
        return FiBook;
      case 'level_up':
        return FiTrendingUp;
      default:
        return FiUser;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'module_completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'badge_earned':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400';
      case 'assignment_submitted':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
      case 'course_enrolled':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
      case 'level_up':
        return 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
    }
  };

  const getActivityMessage = (activity) => {
    const { type, metadata } = activity;
    switch (type) {
      case 'module_completed':
        return `Completed module "${metadata.moduleName}" in ${metadata.courseName}`;
      case 'badge_earned':
        return `Earned the "${metadata.badgeName}" badge`;
      case 'assignment_submitted':
        return `Submitted assignment "${metadata.assignmentName}"`;
      case 'course_enrolled':
        return `Enrolled in "${metadata.courseName}"`;
      case 'level_up':
        return `Reached level ${metadata.newLevel}!`;
      default:
        return activity.message || 'Activity recorded';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1">
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const displayActivities = activities.slice(0, maxItems);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Activity
        </h3>
        {activities.length > maxItems && (
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            View All ({activities.length})
          </button>
        )}
      </div>

      {displayActivities.length === 0 ? (
        <EmptyState
          icon={FiTrendingUp}
          title="No activity yet"
          description="Your recent learning activities will appear here"
        />
      ) : (
        <div className="space-y-4">
          {displayActivities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            const colorClass = getActivityColor(activity.type);

            return (
              <motion.div
                key={activity._id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-3 group"
              >
                {/* Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {getActivityMessage(activity)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatTimeAgo(activity.createdAt || activity.timestamp)}
                  </p>
                </div>

                {/* Optional Score/Points */}
                {activity.points && (
                  <div className="flex-shrink-0 text-right">
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      +{activity.points}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">points</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Timeline Line */}
      {displayActivities.length > 0 && (
        <div className="absolute left-[34px] top-[72px] bottom-6 w-px bg-gray-200 dark:bg-gray-700 -z-10" />
      )}
    </div>
  );
};

RecentActivity.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      type: PropTypes.oneOf([
        'module_completed',
        'badge_earned',
        'assignment_submitted',
        'course_enrolled',
        'level_up',
      ]).isRequired,
      message: PropTypes.string,
      metadata: PropTypes.object,
      createdAt: PropTypes.string,
      timestamp: PropTypes.string,
      points: PropTypes.number,
    })
  ),
  isLoading: PropTypes.bool,
  maxItems: PropTypes.number,
};

export default RecentActivity;