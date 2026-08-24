import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiDownload,
  FiExternalLink,
  FiStar,
  FiBookmark,
  FiShare2,
  FiClock,
  FiEye,
} from 'react-icons/fi';
import { useApi } from '@hooks/useApi';
import  resourceApi from '@api/resourceApi';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import Avatar from '@components/common/Avatar';
import Loader from '@components/common/Loader';
import { formatDate, formatTimeAgo } from '@utils/formatters';
import toast from 'react-hot-toast';

const ResourceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const { loading, execute } = useApi(resourceApi.getResourceById);

  useEffect(() => {
    loadResource();
  }, [id]);

  const loadResource = async () => {
    try {
      const data = await execute(id);
      setResource(data);
      setIsBookmarked(data.isBookmarked || false);
      setUserRating(data.userRating || 0);
    } catch (error) {
      toast.error('Failed to load resource');
      navigate('/resources');
    }
  };

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await resourceApi.removeBookmark(id);
        toast.success('Removed from bookmarks');
      } else {
        await resourceApi.addBookmark(id);
        toast.success('Added to bookmarks');
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };

  const handleRate = async (rating) => {
    try {
      await resourceApi.rateResource(id, rating);
      setUserRating(rating);
      setResource((prev) => ({
        ...prev,
        averageRating: ((prev.averageRating * prev.ratingsCount) + rating) / (prev.ratingsCount + 1),
        ratingsCount: prev.ratingsCount + 1,
      }));
      toast.success('Rating submitted!');
    } catch (error) {
      toast.error('Failed to submit rating');
    }
  };

  const handleDownload = () => {
    if (resource.downloadUrl) {
      window.open(resource.downloadUrl, '_blank');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: resource.title,
        text: resource.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const resourceTypeIcons = {
    document: FiDownload,
    video: FiEye,
    link: FiExternalLink,
    book: FiBookmark,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Resource Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The resource you're looking for doesn't exist or has been removed.
          </p>
          <Button variant="primary" onClick={() => navigate('/resources')}>
            Back to Resources
          </Button>
        </div>
      </div>
    );
  }

  const ResourceIcon = resourceTypeIcons[resource.type] || FiDownload;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <button
        onClick={() => navigate('/resources')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <FiArrowLeft className="w-5 h-5" />
        <span>Back to Resources</span>
      </button>

      {/* Resource Card */}
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
                <Badge variant="info" leftIcon={<ResourceIcon />}>
                  {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                </Badge>
                <Badge variant="gray">{resource.category}</Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {resource.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {resource.description}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={isBookmarked ? 'primary' : 'outline'}
                size="small"
                onClick={handleBookmark}
                leftIcon={<FiBookmark className={isBookmarked ? 'fill-current' : ''} />}
              >
                {isBookmarked ? 'Saved' : 'Save'}
              </Button>
              <Button variant="ghost" size="small" onClick={handleShare}>
                <FiShare2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            {resource.author && (
              <div className="flex items-center gap-2">
                <Avatar
                  src={resource.author.avatar}
                  name={resource.author.name}
                  size="small"
                />
                <span className="text-gray-900 dark:text-white font-medium">
                  {resource.author.name}
                </span>
              </div>
            )}
            <span>•</span>
            <span>{formatDate(resource.createdAt)}</span>
            {resource.duration && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <FiClock className="w-4 h-4" />
                  <span>{resource.duration}</span>
                </div>
              </>
            )}
            {resource.views && (
              <>
                <span>•</span>
                <span>{resource.views.toLocaleString()} views</span>
              </>
            )}
          </div>

          {/* Rating */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  className={`transition-colors ${
                    star <= (userRating || resource.averageRating)
                      ? 'text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  } hover:text-yellow-400`}
                >
                  <FiStar className="w-5 h-5 fill-current" />
                </button>
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {resource.averageRating?.toFixed(1)} ({resource.ratingsCount} ratings)
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {resource.content && (
            <div
              className="prose dark:prose-invert max-w-none mb-6"
              dangerouslySetInnerHTML={{ __html: resource.content }}
            />
          )}

          {/* Download/Access Button */}
          {resource.type === 'document' && resource.downloadUrl && (
            <Button
              variant="primary"
              size="large"
              fullWidth
              onClick={handleDownload}
              leftIcon={<FiDownload />}
            >
              Download Resource ({resource.fileSize})
            </Button>
          )}

          {resource.type === 'link' && resource.url && (
            <Button
              variant="primary"
              size="large"
              fullWidth
              onClick={() => window.open(resource.url, '_blank')}
              leftIcon={<FiExternalLink />}
            >
              Open Link
            </Button>
          )}

          {resource.type === 'video' && resource.url && (
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <iframe
                src={resource.url}
                className="w-full h-full"
                allowFullScreen
                title={resource.title}
              />
            </div>
          )}
        </div>

        {/* Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="px-6 pb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {resource.tags.map((tag, index) => (
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
      </motion.div>

      {/* Related Resources */}
      {resource.relatedResources && resource.relatedResources.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Related Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resource.relatedResources.map((related) => (
              <button
                key={related._id}
                onClick={() => navigate(`/resources/${related._id}`)}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <ResourceIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                      {related.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {related.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceDetailPage;