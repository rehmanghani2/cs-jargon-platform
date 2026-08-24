import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiUser,
  FiCalendar,
  FiClock,
//   FiPin,
  FiMapPin, // Changed from FiPin
  FiShare2,
} from 'react-icons/fi';
import { useApi } from '@hooks/useApi';
import  noticeBoardApi  from '@api/noticeBoardApi';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import Avatar from '@components/common/Avatar';
import Loader from '@components/common/Loader';
import { formatDate, formatTimeAgo } from '@utils/formatters';
import toast from 'react-hot-toast';

const AnnouncementPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);

  const { loading, execute } = useApi(noticeBoardApi.getAnnouncementById);

  useEffect(() => {
    loadAnnouncement();
  }, [id]);

  const loadAnnouncement = async () => {
    try {
      const data = await execute(id);
      setAnnouncement(data);
    } catch (error) {
      toast.error('Failed to load announcement');
      navigate('/notice-board');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: announcement.title,
        text: announcement.content,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const priorityColors = {
    high: 'danger',
    medium: 'warning',
    low: 'info',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Announcement Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The announcement you're looking for doesn't exist or has been removed.
          </p>
          <Button variant="primary" onClick={() => navigate('/notice-board')}>
            Back to Notice Board
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <button
        onClick={() => navigate('/notice-board')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <FiArrowLeft className="w-5 h-5" />
        <span>Back to Notice Board</span>
      </button>

      {/* Announcement Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                {announcement.isPinned && ( //         FiPin
                  <Badge variant="warning" leftIcon={<FiMapPin />}>
                    Pinned
                  </Badge>
                )}
                {announcement.priority && (
                  <Badge variant={priorityColors[announcement.priority]}>
                    {announcement.priority.charAt(0).toUpperCase() +
                      announcement.priority.slice(1)} Priority
                  </Badge>
                )}
                <Badge variant="gray">{announcement.category}</Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {announcement.title}
              </h1>
            </div>
            <Button
              variant="ghost"
              size="small"
              onClick={handleShare}
              leftIcon={<FiShare2 />}
            >
              Share
            </Button>
          </div>

          {/* Author & Date */}
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Avatar
                src={announcement.author?.avatar}
                name={announcement.author?.name}
                size="small"
              />
              <div>
                <p className="text-gray-900 dark:text-white font-medium">
                  {announcement.author?.name}
                </p>
                <p className="text-xs">{announcement.author?.role}</p>
              </div>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <FiCalendar className="w-4 h-4" />
              <span>{formatDate(announcement.createdAt)}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <FiClock className="w-4 h-4" />
              <span>{formatTimeAgo(announcement.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: announcement.content }}
          />

          {/* Attachments */}
          {announcement.attachments && announcement.attachments.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Attachments ({announcement.attachments.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {announcement.attachments.map((file, index) => (
                  <a
                    key={index}
                    href={file.url}
                    download
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <FiUser className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {file.size}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {announcement.tags && announcement.tags.length > 0 && (
            <div className="mt-6">
              <div className="flex flex-wrap gap-2">
                {announcement.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              Last updated: {formatTimeAgo(announcement.updatedAt)}
            </span>
            {announcement.views !== undefined && (
              <span>{announcement.views} views</span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Related Announcements */}
      {announcement.relatedAnnouncements &&
        announcement.relatedAnnouncements.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Related Announcements
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {announcement.relatedAnnouncements.map((related) => (
                <button
                  key={related._id}
                  onClick={() => navigate(`/notice-board/announcements/${related._id}`)}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-left"
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {related.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(related.createdAt)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default AnnouncementPage;