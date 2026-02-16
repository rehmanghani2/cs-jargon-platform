import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import {
  FiArrowLeft,
  FiStar,
  FiCheckCircle,
  FiBookmark,
  FiShare2,
  FiCode,
} from 'react-icons/fi';
import { useCopyToClipboard } from '@hooks/useCopyToClipboard';

function JargonDetailPage() {
  const { jargonId } = useParams();
  const [isLearned, setIsLearned] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [, copy] = useCopyToClipboard();

  // Mock data
  const jargon = {
    id: jargonId,
    term: 'Algorithm',
    definition:
      'A step-by-step procedure or formula for solving a problem or completing a task. Algorithms are fundamental to computer science and programming.',
    category: 'Programming',
    difficulty: 'easy',
    pronunciation: 'AL-guh-rith-uhm',
    etymology: 'From Arabic mathematician Al-Khwarizmi (9th century)',
    examples: [
      {
        title: 'Sorting Algorithm',
        description: 'Bubble sort is a simple sorting algorithm that repeatedly steps through the list.',
        code: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
      },
      {
        title: 'Search Algorithm',
        description: 'Binary search efficiently finds an item in a sorted array.',
        code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
      },
    ],
    relatedTerms: [
      { id: 2, term: 'Data Structure', difficulty: 'easy' },
      { id: 3, term: 'Big O Notation', difficulty: 'medium' },
      { id: 4, term: 'Recursion', difficulty: 'medium' },
    ],
    resources: [
      { title: 'Introduction to Algorithms (Book)', url: '#' },
      { title: 'Algorithm Visualizations', url: '#' },
      { title: 'LeetCode Practice', url: '#' },
    ],
  };

  const handleShare = () => {
    copy(window.location.href);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'success',
      medium: 'warning',
      hard: 'danger',
    };
    return colors[difficulty] || 'gray';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        to="/jargon"
        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Library
      </Link>

      {/* Header */}
      <Card>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                {jargon.term}
              </h1>
              <Badge variant={getDifficultyColor(jargon.difficulty)}>
                {jargon.difficulty}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {jargon.pronunciation}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="small"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <FiStar
                className={`w-5 h-5 ${
                  isFavorite ? 'fill-warning-500 text-warning-500' : ''
                }`}
              />
            </Button>
            <Button
              variant={isLearned ? 'success' : 'outline'}
              size="small"
              onClick={() => setIsLearned(!isLearned)}
              leftIcon={<FiCheckCircle />}
            >
              {isLearned ? 'Learned' : 'Mark as Learned'}
            </Button>
            <Button variant="ghost" size="small" onClick={handleShare}>
              <FiShare2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Definition
            </h2>
            <p className="text-gray-900 dark:text-white leading-relaxed">
              {jargon.definition}
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Category: </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {jargon.category}
              </span>
            </div>
            {jargon.etymology && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Etymology: </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {jargon.etymology}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Examples */}
      <Card title="Examples & Usage">
        <div className="space-y-6">
          {jargon.examples.map((example, index) => (
            <div key={index}>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {example.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {example.description}
              </p>
              {example.code && (
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{example.code}</code>
                  </pre>
                  <button
                    onClick={() => copy(example.code)}
                    className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
                  >
                    <FiCode className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Related Terms */}
      {jargon.relatedTerms && jargon.relatedTerms.length > 0 && (
        <Card title="Related Terms">
          <div className="grid md:grid-cols-2 gap-3">
            {jargon.relatedTerms.map((term) => (
              <Link
                key={term.id}
                to={`/jargon/${term.id}`}
                className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-between"
              >
                <span className="font-medium text-gray-900 dark:text-white">
                  {term.term}
                </span>
                <Badge variant={getDifficultyColor(term.difficulty)} size="small">
                  {term.difficulty}
                </Badge>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Resources */}
      {jargon.resources && jargon.resources.length > 0 && (
        <Card title="Additional Resources">
          <div className="space-y-2">
            {jargon.resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FiBookmark className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {resource.title}
                  </span>
                </div>
                <FiArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
              </a>
            ))}
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4">
        <Link to="/jargon/flashcards">
          <Button variant="outline">Practice with Flashcards</Button>
        </Link>
        <Link to="/jargon">
          <Button variant="primary">Explore More Terms</Button>
        </Link>
      </div>
    </div>
  );
}

export default JargonDetailPage;