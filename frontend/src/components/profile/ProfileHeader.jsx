import { motion } from 'framer-motion';
import { FiMail, FiMapPin, FiCalendar, FiEdit2, FiUpload } from 'react-icons/fi';
import PropTypes from 'prop-types';
import Avatar from '@components/common/Avatar';
import Badge from '@components/common/Badge';
import Button from '@components/common/Button';
import { formatDate } from '@utils/formatters';

const ProfileHeader = ({
  user,
  isOwnProfile = false,
  onEdit,
  onAvatarUpload,
  stats = {},
}) => {
  const {
    name,
    email,
    avatar,
    role,
    bio,
    location,
    joinedDate,
    level,
    status = 'online',
  } = user;

  const {
    coursesEnrolled = 0,
    coursesCompleted = 0,
    assignments = 0,
    currentStreak = 0,
  } = stats;

  const roleColors = {
    student: 'info',
    instructor: 'success',
    admin: 'danger',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Cover Image */}
      <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
        {isOwnProfile && (
          <div className="absolute top-4 right-4">
            <Button variant="secondary" size="small" leftIcon={<FiEdit2 />} onClick={onEdit}>
              Edit Profile
            </Button>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-6 pb-6">
        {/* Avatar */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 mb-4">
          <div className="flex items-end gap-4">
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <Avatar
                  src={avatar}
                  name={name}
                  size="xlarge"
                  status={status}
                  className="ring-4 ring-white dark:ring-gray-800"
                />
                {isOwnProfile && onAvatarUpload && (
                  <button
                    onClick={onAvatarUpload}
                    className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors"
                    title="Upload new avatar"
                  >
                    <FiUpload className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            </div>
            <div className="pb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {name}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={roleColors[role] || 'info'}>
                  {role?.charAt(0).toUpperCase() + role?.slice(1)}
                </Badge>
                {level && (
                  <Badge variant="purple">
                    Level {level}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        {bio && (
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {bio}
          </p>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <FiMail className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm truncate">{email}</span>
          </div>
          {location && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <FiMapPin className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{location}</span>
            </div>
          )}
          {joinedDate && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <FiCalendar className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Joined {formatDate(joinedDate)}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {coursesEnrolled}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Courses Enrolled
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              {coursesCompleted}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Completed
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {assignments}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Assignments
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
              {currentStreak}
              <span className="text-base ml-1">🔥</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Day Streak
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ProfileHeader.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    role: PropTypes.string,
    bio: PropTypes.string,
    location: PropTypes.string,
    joinedDate: PropTypes.string,
    level: PropTypes.number,
    status: PropTypes.oneOf(['online', 'offline', 'busy', 'away']),
  }).isRequired,
  isOwnProfile: PropTypes.bool,
  onEdit: PropTypes.func,
  onAvatarUpload: PropTypes.func,
  stats: PropTypes.shape({
    coursesEnrolled: PropTypes.number,
    coursesCompleted: PropTypes.number,
    assignments: PropTypes.number,
    currentStreak: PropTypes.number,
  }),
};

export default ProfileHeader;