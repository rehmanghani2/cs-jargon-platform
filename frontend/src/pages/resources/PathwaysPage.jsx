import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiTrendingUp,
  FiTarget,
  FiBookOpen,
  FiClock,
  FiUsers,
  FiCheckCircle,
  FiPlay,
} from 'react-icons/fi';
import { useApi } from '@hooks/useApi';
import  resourceApi  from '@api/resourceApi';
import { useNavigate } from 'react-router-dom';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import SearchInput from '@components/common/SearchInput';
import Select from '@components/common/Select';
import Loader from '@components/common/Loader';
import EmptyState from '@components/common/EmptyState';
import { useSearch } from '@hooks/useSearch';

const PathwaysPage = () => {
  const navigate = useNavigate();
  const [pathways, setPathways] = useState([]);
  const [filter, setFilter] = useState('all');

  const { loading, execute } = useApi(resourceApi.getLearningPathways);

  const {
    searchTerm,
    setSearchTerm,
    filteredItems,
    clearSearch,
  } = useSearch(pathways, ['title', 'description', 'level']);

  useEffect(() => {
    loadPathways();
  }, []);

  const loadPathways = async () => {
    try {
      const data = await execute();
      setPathways(data || []);
    } catch (error) {
      console.error('Failed to load pathways:', error);
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Pathways' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const filteredPathways = filteredItems.filter((pathway) => {
    if (filter === 'all') return true;
    if (filter === 'in-progress') return pathway.isInProgress && !pathway.isCompleted;
    if (filter === 'completed') return pathway.isCompleted;
    return pathway.level.toLowerCase() === filter;
  });

  const levelColors = {
    Beginner: 'success',
    Intermediate: 'warning',
    Advanced: 'danger',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Learning Pathways
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Curated learning paths to guide your educational journey
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={clearSearch}
            placeholder="Search pathways..."
          />
        </div>
        <div className="w-full sm:w-64">
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={filterOptions}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <FiBookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {pathways.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Pathways</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <FiPlay className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {pathways.filter((p) => p.isInProgress && !p.isCompleted).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {pathways.filter((p) => p.isCompleted).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pathways Grid */}
      {filteredPathways.length === 0 ? (
        <EmptyState
          icon={FiTarget}
          title="No pathways found"
          description={
            searchTerm
              ? 'Try adjusting your search or filters'
              : 'Start exploring our learning pathways to begin your journey'
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPathways.map((pathway, index) => (
            <motion.div
              key={pathway._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Progress Bar */}
              {pathway.isInProgress && (
                <div className="h-1 bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full bg-blue-600"
                    style={{ width: `${pathway.progress || 0}%` }}
                  />
                </div>
              )}

              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={levelColors[pathway.level] || 'info'}>
                        {pathway.level}
                      </Badge>
                      {pathway.isCompleted && (
                        <Badge variant="success" leftIcon={<FiCheckCircle />}>
                          Completed
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {pathway.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                      {pathway.description}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <FiBookOpen className="w-4 h-4" />
                    <span>{pathway.resourcesCount || 0} resources</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiClock className="w-4 h-4" />
                    <span>{pathway.estimatedDuration || 'N/A'}</span>
                  </div>
                  {pathway.studentsEnrolled && (
                    <div className="flex items-center gap-1">
                      <FiUsers className="w-4 h-4" />
                      <span>{pathway.studentsEnrolled.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Resources Preview */}
                {pathway.resources && pathway.resources.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Resources in this pathway:
                    </p>
                    <div className="space-y-2">
                      {pathway.resources.slice(0, 3).map((resource, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                          <FiCheckCircle
                            className={`w-4 h-4 flex-shrink-0 ${
                              resource.isCompleted
                                ? 'text-green-500'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                          <span className="truncate">{resource.title}</span>
                        </div>
                      ))}
                      {pathway.resources.length > 3 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          +{pathway.resources.length - 3} more resources
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button
                  variant={pathway.isInProgress ? 'primary' : 'outline'}
                  fullWidth
                  onClick={() => navigate(`/pathways/${pathway._id}`)}
                  leftIcon={
                    pathway.isInProgress ? <FiPlay /> : <FiTrendingUp />
                  }
                >
                  {pathway.isCompleted
                    ? 'Review Pathway'
                    : pathway.isInProgress
                    ? `Continue (${pathway.progress}%)`
                    : 'Start Pathway'}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PathwaysPage;