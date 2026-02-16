import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import SearchInput from '@components/common/SearchInput';
import Select from '@components/common/Select';
import Tabs from '@components/common/Tabs';
import EmptyState from '@components/common/EmptyState';
import {
  FiFolder,
  FiFileText,
  FiVideo,
  FiLink,
  FiBook,
  FiDownload,
  FiExternalLink,
  FiBookmark,
  FiStar,
} from 'react-icons/fi';

function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data
  const resources = [
    {
      id: 1,
      title: 'Introduction to Algorithms - PDF',
      description: 'Comprehensive guide to algorithms and data structures.',
      type: 'document',
      category: 'Algorithms',
      size: '5.2 MB',
      downloads: 1234,
      rating: 4.8,
      bookmarked: true,
    },
    {
      id: 2,
      title: 'Web Development Crash Course',
      description: 'Video series covering HTML, CSS, and JavaScript fundamentals.',
      type: 'video',
      category: 'Web Development',
      duration: '3h 45m',
      views: 5678,
      rating: 4.9,
      bookmarked: false,
    },
    {
      id: 3,
      title: 'LeetCode Practice Problems',
      description: 'Curated list of coding interview questions.',
      type: 'link',
      category: 'Programming',
      url: 'https://leetcode.com',
      rating: 4.7,
      bookmarked: true,
    },
    {
      id: 4,
      title: 'Database Design Best Practices',
      description: 'Guidelines for designing efficient database schemas.',
      type: 'document',
      category: 'Database',
      size: '2.8 MB',
      downloads: 890,
      rating: 4.6,
      bookmarked: false,
    },
  ];

  const learningPaths = [
    {
      id: 1,
      title: 'Full Stack Developer',
      description: 'Complete path from beginner to full-stack developer',
      resources: 12,
      duration: '6 months',
      difficulty: 'intermediate',
    },
    {
      id: 2,
      title: 'Data Scientist',
      description: 'Master data science and machine learning',
      resources: 15,
      duration: '8 months',
      difficulty: 'advanced',
    },
    {
      id: 3,
      title: 'Frontend Specialist',
      description: 'Become an expert in modern frontend development',
      resources: 10,
      duration: '4 months',
      difficulty: 'beginner',
    },
  ];

  const types = [
    { value: 'all', label: 'All Types' },
    { value: 'document', label: 'Documents' },
    { value: 'video', label: 'Videos' },
    { value: 'link', label: 'Links' },
    { value: 'book', label: 'Books' },
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'programming', label: 'Programming' },
    { value: 'algorithms', label: 'Algorithms' },
    { value: 'web', label: 'Web Development' },
    { value: 'database', label: 'Database' },
  ];

  const getTypeIcon = (type) => {
    const icons = {
      document: FiFileText,
      video: FiVideo,
      link: FiLink,
      book: FiBook,
    };
    return icons[type] || FiFolder;
  };

  const ResourceCard = ({ resource }) => {
    const Icon = getTypeIcon(resource.type);

    return (
      <Card hover>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {resource.description}
                </p>
              </div>
            </div>
            {resource.bookmarked && (
              <FiBookmark className="w-5 h-5 text-warning-600 fill-warning-600" />
            )}
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <Badge variant="info" size="small">
              {resource.category}
            </Badge>
            {resource.size && <span>{resource.size}</span>}
            {resource.duration && <span>{resource.duration}</span>}
            {resource.downloads && <span>{resource.downloads} downloads</span>}
            {resource.views && <span>{resource.views} views</span>}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1">
              <FiStar className="w-4 h-4 text-warning-500 fill-warning-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {resource.rating}
              </span>
            </div>
            <div className="flex gap-2">
              {resource.type === 'link' ? (
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="small">
                    <FiExternalLink className="w-4 h-4" />
                  </Button>
                </a>
              ) : (
                <Button variant="outline" size="small">
                  <FiDownload className="w-4 h-4" />
                </Button>
              )}
              <Link to={`/resources/${resource.id}`}>
                <Button variant="primary" size="small">
                  View
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const PathwayCard = ({ pathway }) => (
    <Card hover>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {pathway.title}
            </h3>
            <Badge
              variant={
                pathway.difficulty === 'beginner'
                  ? 'success'
                  : pathway.difficulty === 'intermediate'
                  ? 'warning'
                  : 'danger'
              }
            >
              {pathway.difficulty}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {pathway.description}
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>{pathway.resources} resources</span>
          <span>•</span>
          <span>{pathway.duration}</span>
        </div>

        <Link to="/resources/pathways">
          <Button variant="primary" fullWidth>
            Explore Path
          </Button>
        </Link>
      </div>
    </Card>
  );

  const allResourcesTab = (
    <div>
      {resources.length === 0 ? (
        <EmptyState
          icon={FiFolder}
          title="No resources found"
          description="Try adjusting your filters or search term."
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );

  const bookmarksTab = (
    <div>
      {resources.filter(r => r.bookmarked).length === 0 ? (
        <EmptyState
          icon={FiBookmark}
          title="No bookmarks"
          description="Bookmark resources to save them for later."
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.filter(r => r.bookmarked).map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );

  const pathwaysTab = (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {learningPaths.map((pathway) => (
        <PathwayCard key={pathway.id} pathway={pathway} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
          Resources
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Access learning materials, guides, and curated content
        </p>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid md:grid-cols-3 gap-4">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
            placeholder="Search resources..."
          />
          <Select
            options={types}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          />
          <Select
            options={categories}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          />
        </div>
      </Card>

      {/* Tabs */}
      <Tabs
        tabs={[
          {
            label: 'All Resources',
            content: allResourcesTab,
            badge: resources.length,
          },
          {
            label: 'Bookmarks',
            content: bookmarksTab,
            icon: <FiBookmark className="w-4 h-4" />,
            badge: resources.filter(r => r.bookmarked).length,
          },
          {
            label: 'Learning Paths',
            content: pathwaysTab,
            badge: learningPaths.length,
          },
        ]}
      />
    </div>
  );
}

export default ResourcesPage;