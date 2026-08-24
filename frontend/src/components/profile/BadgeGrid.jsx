import { motion } from 'framer-motion';
import { FiAward, FiLock, FiInfo } from 'react-icons/fi';
import PropTypes from 'prop-types';
import { formatDate } from '@utils/formatters';
import EmptyState from '@components/common/Empty State';

const BadgeGrid = ({ badges = [], isLoading = false, showLocked = true }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const earnedBadges = badges.filter((b) => b.earned);
  const lockedBadges = badges.filter((b) => !b.earned);

  if (!showLocked && earnedBadges.length === 0) {
    return (
      <EmptyState
        icon={FiAward}
        title="No badges earned yet"
        description="Complete courses and achieve milestones to earn badges!"
      />
    );
  }

  const allBadgesToShow = showLocked ? [...earnedBadges, ...lockedBadges] : earnedBadges;

  return (
    <div className="space-y-6">
      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Earned Badges ({earnedBadges.length})
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {earnedBadges.map((badge, index) => (
              <BadgeCard key={badge._id || index} badge={badge} earned />
            ))}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {showLocked && lockedBadges.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Locked Badges ({lockedBadges.length})
            </h3>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <FiInfo className="w-4 h-4 mr-1" />
              Complete requirements to unlock
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {lockedBadges.map((badge, index) => (
              <BadgeCard key={badge._id || index} badge={badge} earned={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const BadgeCard = ({ badge, earned }) => {
  const { name, description, icon, earnedDate, type, rarity } = badge;

  const rarityColors = {
    common: 'from-gray-400 to-gray-500',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-500',
  };

  const gradientClass = rarityColors[rarity] || rarityColors.common;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: earned ? 1.05 : 1 }}
      transition={{ duration: 0.2 }}
      className={`relative bg-white dark:bg-gray-800 rounded-lg border-2 p-4 text-center ${
        earned
          ? 'border-transparent shadow-lg cursor-pointer'
          : 'border-gray-300 dark:border-gray-600 opacity-60'
      }`}
      style={
        earned
          ? {
              background: `linear-gradient(135deg, ${
                rarity === 'legendary'
                  ? '#fbbf24, #f59e0b'
                  : rarity === 'epic'
                  ? '#a78bfa, #8b5cf6'
                  : rarity === 'rare'
                  ? '#60a5fa, #2563eb'
                  : '#9ca3af, #6b7280'
              })`,
            }
          : {}
      }
    >
      {/* Locked Overlay */}
      {!earned && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg backdrop-blur-sm">
          <FiLock className="w-8 h-8 text-white" />
        </div>
      )}

      {/* Badge Icon */}
      <div
        className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
          earned
            ? 'bg-white/20 backdrop-blur-sm'
            : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        {icon ? (
          <span className="text-3xl">{icon}</span>
        ) : (
          <FiAward
            className={`w-8 h-8 ${
              earned ? 'text-white' : 'text-gray-400 dark:text-gray-500'
            }`}
          />
        )}
      </div>

      {/* Badge Name */}
      <h4
        className={`font-semibold mb-1 ${
          earned ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}
      >
        {name}
      </h4>

      {/* Badge Description */}
      <p
        className={`text-xs mb-2 line-clamp-2 ${
          earned ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'
        }`}
      >
        {description}
      </p>

      {/* Earned Date */}
      {earned && earnedDate && (
        <div className="text-xs text-white/75 mt-2">
          Earned {formatDate(earnedDate)}
        </div>
      )}

      {/* Rarity Badge */}
      {earned && rarity && (
        <div className="absolute top-2 right-2">
          <div className="bg-black/30 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
            {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
          </div>
        </div>
      )}

      {/* Type Badge */}
      {type && !earned && (
        <div className="mt-2">
          <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
            {type}
          </span>
        </div>
      )}
    </motion.div>
  );
};

BadgeCard.propTypes = {
  badge: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.string,
    earnedDate: PropTypes.string,
    type: PropTypes.string,
    rarity: PropTypes.oneOf(['common', 'rare', 'epic', 'legendary']),
  }).isRequired,
  earned: PropTypes.bool.isRequired,
};

BadgeGrid.propTypes = {
  badges: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      icon: PropTypes.string,
      earned: PropTypes.bool,
      earnedDate: PropTypes.string,
      type: PropTypes.string,
      rarity: PropTypes.string,
    })
  ),
  isLoading: PropTypes.bool,
  showLocked: PropTypes.bool,
};

export default BadgeGrid;