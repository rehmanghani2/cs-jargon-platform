import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiInfo, FiCalendar } from 'react-icons/fi';
import PropTypes from 'prop-types';

const ActivityHeatmap = ({
  activities = [],
  year = new Date().getFullYear(),
  isLoading = false,
}) => {
  const [hoveredDay, setHoveredDay] = useState(null);

  // Generate array of all days in the year
  const generateYearDays = () => {
    const days = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  };

  // Get activity count for a specific date
  const getActivityCount = (date) => {
    const dateString = date.toISOString().split('T')[0];
    const activity = activities.find((a) => a.date === dateString);
    return activity ? activity.count : 0;
  };

  // Get color intensity based on activity count
  const getIntensityColor = (count) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (count < 3) return 'bg-green-200 dark:bg-green-900';
    if (count < 6) return 'bg-green-400 dark:bg-green-700';
    if (count < 10) return 'bg-green-600 dark:bg-green-500';
    return 'bg-green-800 dark:bg-green-300';
  };

  // Group days by week
  const groupByWeeks = (days) => {
    const weeks = [];
    let currentWeek = [];

    // Add empty days to start on Sunday
    const firstDay = days[0];
    const firstDayOfWeek = firstDay.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    days.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    // Add remaining days
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const days = generateYearDays();
  const weeks = groupByWeeks(days);

  const totalActivity = activities.reduce((sum, a) => sum + a.count, 0);
  const activeDays = activities.filter((a) => a.count > 0).length;
  const maxStreak = calculateMaxStreak(activities);
  const currentStreak = calculateCurrentStreak(activities);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <FiCalendar className="w-5 h-5 mr-2 text-blue-500" />
          Activity Heatmap
        </h3>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <FiInfo className="w-4 h-4 mr-1" />
          <span>{year}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalActivity}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Total Activities</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {activeDays}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Active Days</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {maxStreak}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Max Streak</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {currentStreak}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Current Streak</div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month Labels */}
          <div className="flex gap-1 mb-2 pl-8">
            {months.map((month, index) => (
              <div
                key={month}
                className="text-xs text-gray-600 dark:text-gray-400"
                style={{ width: `${(weeks.length / 12) * 16}px` }}
              >
                {index % 2 === 0 ? month : ''}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="flex gap-1">
            {/* Day Labels */}
            <div className="flex flex-col gap-1 pr-2">
              {['Mon', 'Wed', 'Fri'].map((day, index) => (
                <div
                  key={day}
                  className="text-xs text-gray-600 dark:text-gray-400 h-3"
                  style={{ marginTop: index === 0 ? '0' : '12px' }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Heatmap Cells */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => {
                    if (!day) {
                      return (
                        <div
                          key={`empty-${dayIndex}`}
                          className="w-3 h-3 rounded-sm"
                        />
                      );
                    }

                    const count = getActivityCount(day);
                    const dateString = day.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });

                    return (
                      <motion.div
                        key={day.toISOString()}
                        whileHover={{ scale: 1.5 }}
                        className={`w-3 h-3 rounded-sm ${getIntensityColor(count)} border border-gray-200 dark:border-gray-700 cursor-pointer`}
                        onMouseEnter={() => setHoveredDay({ date: dateString, count })}
                        onMouseLeave={() => setHoveredDay(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Tooltip */}
          {hoveredDay && (
            <div className="mt-4 p-3 bg-gray-900 dark:bg-gray-700 text-white rounded-lg shadow-lg text-center">
              <div className="text-sm font-medium">{hoveredDay.date}</div>
              <div className="text-xs text-gray-300 dark:text-gray-400 mt-1">
                {hoveredDay.count} {hoveredDay.count === 1 ? 'activity' : 'activities'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <span className="text-xs text-gray-600 dark:text-gray-400">Less</span>
        {[0, 1, 3, 6, 10].map((threshold) => (
          <div
            key={threshold}
            className={`w-3 h-3 rounded-sm ${getIntensityColor(threshold)} border border-gray-200 dark:border-gray-700`}
          />
        ))}
        <span className="text-xs text-gray-600 dark:text-gray-400">More</span>
      </div>
    </div>
  );
};

// Helper functions
function calculateMaxStreak(activities) {
  if (activities.length === 0) return 0;

  const sortedActivities = activities
    .filter((a) => a.count > 0)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  let maxStreak = 0;
  let currentStreak = 0;
  let lastDate = null;

  sortedActivities.forEach((activity) => {
    const currentDate = new Date(activity.date);

    if (!lastDate) {
      currentStreak = 1;
    } else {
      const dayDiff = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));
      if (dayDiff === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    }

    maxStreak = Math.max(maxStreak, currentStreak);
    lastDate = currentDate;
  });

  return maxStreak;
}

function calculateCurrentStreak(activities) {
  if (activities.length === 0) return 0;

  const sortedActivities = activities
    .filter((a) => a.count > 0)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const activity of sortedActivities) {
    const activityDate = new Date(activity.date);
    const dayDiff = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24));

    if (dayDiff === streak) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

ActivityHeatmap.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired, // Format: 'YYYY-MM-DD'
      count: PropTypes.number.isRequired,
    })
  ),
  year: PropTypes.number,
  isLoading: PropTypes.bool,
};

export default ActivityHeatmap;