import { motion } from 'framer-motion';
import { FiTrophy, FiTrendingUp, FiUser } from 'react-icons/fi';
import PropTypes from 'prop-types';
import Avatar from '@components/common/Avatar';
import Badge from '@components/common/Badge';
import EmptyState from '@components/common/EmptyState';

const LeaderboardWidget = ({
  leaderboard = [],
  currentUser,
  isLoading = false,
  maxItems = 10,
  period = 'weekly', // 'weekly', 'monthly', 'all-time'
}) => {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return null;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'text-yellow-600 dark:text-yellow-400';
      case 2:
        return 'text-gray-600 dark:text-gray-400';
      case 3:
        return 'text-orange-600 dark:text-orange-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const periodLabels = {
    weekly: 'This Week',
    monthly: 'This Month',
    'all-time': 'All Time',
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Leaderboard
        </h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const displayLeaderboard = leaderboard.slice(0, maxItems);
  const currentUserRank = leaderboard.findIndex((u) => u._id === currentUser?._id) + 1;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <FiTrophy className="w-5 h-5 mr-2 text-yellow-500" />
          Leaderboard
        </h3>
        <Badge variant="info" size="small">
          {periodLabels[period]}
        </Badge>
      </div>

      {/* Leaderboard List */}
      {displayLeaderboard.length === 0 ? (
        <EmptyState
          icon={FiTrophy}
          title="No rankings yet"
          description="Start learning to appear on the leaderboard!"
        />
      ) : (
        <div className="space-y-2">
          {displayLeaderboard.map((user, index) => {
            const rank = index + 1;
            const isCurrentUser = user._id === currentUser?._id;
            const rankIcon = getRankIcon(rank);

            return (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  isCurrentUser
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 dark:border-blue-400'
                    : 'bg-gray-50 dark:bg-gray-700/50'
                } ${rank <= 3 ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800' : ''} ${
                  rank === 1 ? 'ring-yellow-400' : rank === 2 ? 'ring-gray-400' : rank === 3 ? 'ring-orange-400' : ''
                }`}
              >
                {/* Rank */}
                <div className={`flex-shrink-0 w-8 text-center font-bold ${getRankColor(rank)}`}>
                  {rankIcon || `#${rank}`}
                </div>

                {/* Avatar */}
                <Avatar
                  src={user.avatar}
                  name={user.name}
                  size="medium"
                  className="flex-shrink-0"
                />

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    {isCurrentUser && (
                      <Badge variant="primary" size="small">
                        You
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Level {user.level || 1}
                  </p>
                </div>

                {/* Points */}
                <div className="flex-shrink-0 text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {user.points?.toLocaleString() || 0}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">points</p>
                </div>

                {/* Trend Indicator (optional) */}
                {user.trend && (
                  <div className="flex-shrink-0">
                    {user.trend === 'up' ? (
                      <FiTrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : user.trend === 'down' ? (
                      <FiTrendingUp className="w-4 h-4 text-red-600 dark:text-red-400 transform rotate-180" />
                    ) : null}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Current User Rank (if not in top display) */}
      {currentUserRank > maxItems && currentUser && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 dark:border-blue-400 rounded-lg">
            <div className="flex-shrink-0 w-8 text-center font-bold text-blue-600 dark:text-blue-400">
              #{currentUserRank}
            </div>
            <Avatar
              src={currentUser.avatar}
              name={currentUser.name}
              size="medium"
              className="flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {currentUser.name}
                </p>
                <Badge variant="primary" size="small">
                  You
                </Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Level {currentUser.level || 1}
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {currentUser.points?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">points</p>
            </div>
          </div>
        </div>
      )}

      {/* View Full Leaderboard Link */}
      {leaderboard.length > maxItems && (
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            View Full Leaderboard ({leaderboard.length} users)
          </button>
        </div>
      )}
    </div>
  );
};

LeaderboardWidget.propTypes = {
  leaderboard: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string,
      level: PropTypes.number,
      points: PropTypes.number,
      trend: PropTypes.oneOf(['up', 'down', 'neutral']),
    })
  ),
  currentUser: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    avatar: PropTypes.string,
    level: PropTypes.number,
    points: PropTypes.number,
  }),
  isLoading: PropTypes.bool,
  maxItems: PropTypes.number,
  period: PropTypes.oneOf(['weekly', 'monthly', 'all-time']),
};

export default LeaderboardWidget;