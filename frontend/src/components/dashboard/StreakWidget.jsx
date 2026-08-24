import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiFire, FiZap, FiTrendingUp, FiInfo } from 'react-icons/fi';
import PropTypes from 'prop-types';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';

const StreakWidget = ({
  currentStreak = 0,
  longestStreak = 0,
  freezesAvailable = 0,
  lastActivityDate,
  isLoading = false,
}) => {
  const [showInfo, setShowInfo] = useState(false);

  const getStreakStatus = () => {
    if (currentStreak === 0) return 'inactive';
    if (currentStreak >= 30) return 'fire';
    if (currentStreak >= 7) return 'active';
    return 'building';
  };

  const status = getStreakStatus();

  const statusConfig = {
    inactive: {
      color: 'text-gray-400',
      bgColor: 'bg-gray-100 dark:bg-gray-700',
      message: 'Start your streak today!',
    },
    building: {
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      message: 'Keep it going!',
    },
    active: {
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      message: 'You\'re on fire!',
    },
    fire: {
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      message: 'Legendary streak!',
    },
  };

  const config = statusConfig[status];

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
          <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <FiZap className="w-5 h-5 mr-2 text-yellow-500" />
          Learning Streak
        </h3>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <FiInfo className="w-5 h-5" />
        </button>
      </div>

      {/* Info Box */}
      {showInfo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-900 dark:text-blue-200"
        >
          <p>
            Keep learning every day to maintain your streak! Use freeze days when you
            need a break without losing progress.
          </p>
        </motion.div>
      )}

      {/* Main Streak Display */}
      <div className={`${config.bgColor} rounded-lg p-6 text-center mb-4`}>
        <motion.div
          animate={{
            scale: status === 'fire' ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: status === 'fire' ? Infinity : 0,
          }}
          className="inline-block"
        >
          <FiFire className={`w-16 h-16 ${config.color} mx-auto mb-2`} />
        </motion.div>
        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
          {currentStreak}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {currentStreak === 1 ? 'day' : 'days'} streak
        </p>
        <p className={`text-xs font-medium ${config.color} mt-2`}>
          {config.message}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center justify-center text-purple-500 mb-1">
            <FiTrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">Longest</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {longestStreak}
          </div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center justify-center text-blue-500 mb-1">
            <FiZap className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">Freezes</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {freezesAvailable}
          </div>
        </div>
      </div>

      {/* Last Activity */}
      {lastActivityDate && (
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-3">
          Last activity: {new Date(lastActivityDate).toLocaleDateString()}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button variant="primary" size="small" fullWidth>
          Continue Learning
        </Button>
        {freezesAvailable > 0 && (
          <Button variant="outline" size="small">
            <FiZap className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Achievements */}
      {currentStreak >= 7 && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {currentStreak >= 7 && (
            <Badge variant="success" size="small">
              7-Day Warrior
            </Badge>
          )}
          {currentStreak >= 30 && (
            <Badge variant="warning" size="small">
              30-Day Champion
            </Badge>
          )}
          {currentStreak >= 100 && (
            <Badge variant="danger" size="small">
              100-Day Legend
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

StreakWidget.propTypes = {
  currentStreak: PropTypes.number,
  longestStreak: PropTypes.number,
  freezesAvailable: PropTypes.number,
  lastActivityDate: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default StreakWidget;