import { motion } from 'framer-motion';
import { FiAlertCircle, FiClock, FiFileText, FiCalendar } from 'react-icons/fi';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Badge from '@components/common/Badge';
import EmptyState from '@components/common/EmptyState';
import { formatDate } from '@utils/formatters';

const UpcomingDeadlines = ({ deadlines = [], isLoading = false, maxItems = 5 }) => {
  const navigate = useNavigate();

  const getDaysUntilDue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyLevel = (daysUntilDue) => {
    if (daysUntilDue < 0) return 'overdue';
    if (daysUntilDue === 0) return 'today';
    if (daysUntilDue === 1) return 'tomorrow';
    if (daysUntilDue <= 3) return 'soon';
    return 'upcoming';
  };

  const getUrgencyConfig = (urgency) => {
    switch (urgency) {
      case 'overdue':
        return {
          variant: 'danger',
          icon: FiAlertCircle,
          label: 'Overdue',
          borderColor: 'border-red-500 dark:border-red-400',
          bgColor: 'bg-red-50 dark:bg-red-900/10',
        };
      case 'today':
        return {
          variant: 'danger',
          icon: FiClock,
          label: 'Due Today',
          borderColor: 'border-orange-500 dark:border-orange-400',
          bgColor: 'bg-orange-50 dark:bg-orange-900/10',
        };
      case 'tomorrow':
        return {
          variant: 'warning',
          icon: FiClock,
          label: 'Due Tomorrow',
          borderColor: 'border-yellow-500 dark:border-yellow-400',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/10',
        };
      case 'soon':
        return {
          variant: 'warning',
          icon: FiClock,
          label: 'Due Soon',
          borderColor: 'border-yellow-500 dark:border-yellow-400',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/10',
        };
      default:
        return {
          variant: 'info',
          icon: FiCalendar,
          label: 'Upcoming',
          borderColor: 'border-blue-500 dark:border-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-900/10',
        };
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Upcoming Deadlines
        </h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Sort deadlines by due date
  const sortedDeadlines = [...deadlines]
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, maxItems);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Upcoming Deadlines
        </h3>
        {deadlines.length > maxItems && (
          <button
            onClick={() => navigate('/assignments')}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            View All ({deadlines.length})
          </button>
        )}
      </div>

      {sortedDeadlines.length === 0 ? (
        <EmptyState
          icon={FiFileText}
          title="No upcoming deadlines"
          description="You're all caught up! Check back later for new assignments."
        />
      ) : (
        <div className="space-y-3">
          {sortedDeadlines.map((deadline, index) => {
            const daysUntilDue = getDaysUntilDue(deadline.dueDate);
            const urgency = getUrgencyLevel(daysUntilDue);
            const config = getUrgencyConfig(urgency);
            const UrgencyIcon = config.icon;

            return (
              <motion.div
                key={deadline._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border-l-4 ${config.borderColor} ${config.bgColor} rounded-r-lg p-4 cursor-pointer hover:shadow-md transition-shadow`}
                onClick={() => navigate(`/assignments/${deadline._id}`)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <UrgencyIcon className={`w-4 h-4 flex-shrink-0 ${
                        urgency === 'overdue' || urgency === 'today'
                          ? 'text-red-600 dark:text-red-400'
                          : urgency === 'tomorrow' || urgency === 'soon'
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-blue-600 dark:text-blue-400'
                      }`} />
                      <Badge variant={config.variant} size="small">
                        {config.label}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                      {deadline.title}
                    </h4>
                    {deadline.course && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {deadline.course.title}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                      <span className="flex items-center">
                        <FiCalendar className="w-3 h-3 mr-1" />
                        {formatDate(deadline.dueDate)}
                      </span>
                      {deadline.points && (
                        <span className="flex items-center">
                          <FiFileText className="w-3 h-3 mr-1" />
                          {deadline.points} points
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {daysUntilDue >= 0 ? (
                      <>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {daysUntilDue}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {daysUntilDue === 1 ? 'day' : 'days'}
                        </div>
                      </>
                    ) : (
                      <div className="text-lg font-bold text-red-600 dark:text-red-400">
                        {Math.abs(daysUntilDue)}d late
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

UpcomingDeadlines.propTypes = {
  deadlines: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      dueDate: PropTypes.string.isRequired,
      course: PropTypes.shape({
        _id: PropTypes.string,
        title: PropTypes.string,
      }),
      points: PropTypes.number,
    })
  ),
  isLoading: PropTypes.bool,
  maxItems: PropTypes.number,
};

export default UpcomingDeadlines;