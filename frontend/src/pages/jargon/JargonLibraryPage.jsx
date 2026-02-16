import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import SearchInput from '@components/common/SearchInput';
import Select from '@components/common/Select';
import EmptyState from '@components/common/EmptyState';
import { 
  FiBook, 
  FiBookmark, 
  FiCheckCircle, 
  FiStar,
  FiZap
} from 'react-icons/fi';

function JargonLibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Mock data
  const jargonTerms = [
    {
      id: 1,
      term: 'Algorithm',
      definition: 'A step-by-step procedure or formula for solving a problem or completing a task.',
      category: 'Programming',
      difficulty: 'easy',
      example: 'Bubble sort is a simple sorting algorithm that repeatedly steps through the list.',
      learned: true,
      favorite: false,
    },
    {
      id: 2,
      term: 'API (Application Programming Interface)',
      definition: 'A set of protocols and tools for building software applications, specifying how components should interact.',
      category: 'Software Engineering',
      difficulty: 'medium',
      example: 'REST APIs allow different applications to communicate over HTTP.',
      learned: true,
      favorite: true,
    },
    {
      id: 3,
      term: 'Big O Notation',
      definition: 'A mathematical notation describing the limiting behavior of a function, used to classify algorithms by time or space complexity.',
      category: 'Algorithms',
      difficulty: 'medium',
      example: 'Binary search has O(log n) time complexity.',
      learned: false,
      favorite: false,
    },
    {
      id: 4,
      term: 'Closure',
      definition: 'A function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.',
      category: 'Programming',
      difficulty: 'hard',
      example: 'JavaScript closures allow private variables and methods.',
      learned: false,
      favorite: true,
    },
    {
      id: 5,
      term: 'Docker',
      definition: 'A platform for developing, shipping, and running applications in containers.',
      category: 'DevOps',
      difficulty: 'medium',
      example: 'Docker containers package applications with their dependencies.',
      learned: true,
      favorite: false,
    },
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'programming', label: 'Programming' },
    { value: 'algorithms', label: 'Algorithms' },
    { value: 'data_structures', label: 'Data Structures' },
    { value: 'web', label: 'Web Development' },
    { value: 'database', label: 'Database' },
    { value: 'devops', label: 'DevOps' },
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ];

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'success',
      medium: 'warning',
      hard: 'danger',
    };
    return colors[difficulty] || 'gray';
  };

  const stats = {
    total: jargonTerms.length,
    learned: jargonTerms.filter(j => j.learned).length,
    favorites: jargonTerms.filter(j => j.favorite).length,
  };

  const JargonCard = ({ jargon }) => (
    <Card hover>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Link to={`/jargon/${jargon.id}`}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              {jargon.term}
            </h3>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getDifficultyColor(jargon.difficulty)} size="small">
            {jargon.difficulty}
          </Badge>
          {jargon.learned && (
            <div className="w-6 h-6 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center">
              <FiCheckCircle className="w-4 h-4 text-success-600" />
            </div>
          )}
          {jargon.favorite && (
            <div className="w-6 h-6 bg-warning-100 dark:bg-warning-900/30 rounded-full flex items-center justify-center">
              <FiStar className="w-4 h-4 text-warning-600" />
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
        {jargon.definition}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {jargon.category}
        </span>
        <Link to={`/jargon/${jargon.id}`}>
          <Button variant="ghost" size="small">
            Learn More
          </Button>
        </Link>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
            Jargon Library
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Master computer science terminology
          </p>
        </div>
        <Link to="/jargon/flashcards">
          <Button variant="primary" leftIcon={<FiZap />}>
            Practice Flashcards
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Terms</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <FiBook className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Learned</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.learned}
              </p>
            </div>
            <div className="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-lg flex items-center justify-center">
              <FiCheckCircle className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Favorites</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.favorites}
              </p>
            </div>
            <div className="w-12 h-12 bg-warning-100 dark:bg-warning-900/30 rounded-lg flex items-center justify-center">
              <FiStar className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Jargon of the Week */}
      <Card
        title="🔥 Jargon of the Week"
        className="bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border-2 border-primary-200 dark:border-primary-800"
      >
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Microservices
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            An architectural style that structures an application as a collection of loosely coupled, independently deployable services.
          </p>
          <Link to="/jargon/microservices">
            <Button variant="primary">Learn More</Button>
          </Link>
        </div>
      </Card>

      {/* Filters */}
      <Card>
        <div className="grid md:grid-cols-3 gap-4">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
            placeholder="Search jargon..."
          />
          <Select
            options={categories}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          />
          <Select
            options={difficulties}
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          />
        </div>
      </Card>

      {/* Jargon Grid */}
      {jargonTerms.length === 0 ? (
        <EmptyState
          icon={FiBook}
          title="No jargon terms found"
          description="Try adjusting your filters or search term."
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jargonTerms.map((jargon) => (
            <JargonCard key={jargon.id} jargon={jargon} />
          ))}
        </div>
      )}
    </div>
  );
}

export default JargonLibraryPage;