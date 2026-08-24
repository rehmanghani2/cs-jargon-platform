import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import SearchInput from '@components/common/SearchInput';
import Select from '@components/common/Select';
import EmptyState from '@components/common/EmptyState';
import { 
  FiBook, 
  FiCheckCircle, 
  FiStar,
  FiZap,
  FiVolume2
} from 'react-icons/fi';

function JargonLibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const [jargonTerms, setJargonTerms] = useState([
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
  ]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'programming', label: 'Programming' },
    { value: 'algorithms', label: 'Algorithms' },
    { value: 'data_structures', label: 'Data Structures' },
    { value: 'software engineering', label: 'Software Engineering' },
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

  const handleToggleFavorite = (id, e) => {
    e.stopPropagation();
    setJargonTerms(prev => prev.map(item => {
      if (item.id === id) {
        const nextFav = !item.favorite;
        toast.success(nextFav ? `Added "${item.term}" to Favorites ⭐` : `Removed "${item.term}" from Favorites`);
        return { ...item, favorite: nextFav };
      }
      return item;
    }));
  };

  const handleSpeak = (term, e) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(term);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      toast.success(`Pronouncing: "${term}"`, { id: 'speech-lib' });
    }
  };

  // Real-time filtering
  const filteredJargons = jargonTerms.filter((jargon) => {
    const matchesSearch = jargon.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jargon.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      jargon.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesDifficulty = selectedDifficulty === 'all' || 
      jargon.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const stats = {
    total: jargonTerms.length,
    learned: jargonTerms.filter(j => j.learned).length,
    favorites: jargonTerms.filter(j => j.favorite).length,
  };

  const JargonCard = ({ jargon }) => (
    <Card hover className="flex flex-col justify-between h-full border hover:border-primary-400 transition-all">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 pr-2">
            <Link to={`/jargon/${jargon.id}`}>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {jargon.term}
              </h3>
            </Link>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => handleSpeak(jargon.term, e)}
              className="p-1.5 text-gray-400 hover:text-primary-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Listen to pronunciation"
            >
              <FiVolume2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => handleToggleFavorite(jargon.id, e)}
              className={`p-1.5 rounded-full transition-colors ${
                jargon.favorite
                  ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/30'
                  : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title={jargon.favorite ? 'Unfavorite' : 'Add to Favorites'}
            >
              <FiStar className="w-4 h-4 fill-current" />
            </button>
            <Badge variant={getDifficultyColor(jargon.difficulty)} size="small">
              {jargon.difficulty}
            </Badge>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3 leading-relaxed">
          {jargon.definition}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 mt-4">
        <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md">
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
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Search, listen, and master computer science vocabulary
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
        <Card className="border-l-4 border-l-primary-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Terms</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
              <FiBook className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-success-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Learned</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.learned}
              </p>
            </div>
            <div className="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-xl flex items-center justify-center">
              <FiCheckCircle className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-warning-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Favorites</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.favorites}
              </p>
            </div>
            <div className="w-12 h-12 bg-warning-100 dark:bg-warning-900/30 rounded-xl flex items-center justify-center">
              <FiStar className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid md:grid-cols-3 gap-4">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
            placeholder="Search jargon term or definition..."
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
      {filteredJargons.length === 0 ? (
        <EmptyState
          icon={FiBook}
          title="No matching jargon terms"
          description="Try adjusting your search keywords or filter dropdowns."
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJargons.map((jargon) => (
            <JargonCard key={jargon.id} jargon={jargon} />
          ))}
        </div>
      )}
    </div>
  );
}

export default JargonLibraryPage;