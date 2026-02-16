import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Select from '@components/common/Select';
import Badge from '@components/common/Badge';
import ProgressBar from '@components/common/ProgressBar';
import Modal from '@components/common/Modal';
import {
  FiArrowLeft,
  FiRotateCw,
  FiCheck,
  FiX,
  FiShuffle,
  FiSkipForward,
} from 'react-icons/fi';

function FlashcardsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState([]);
  const [skippedCards, setSkippedCards] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showResults, setShowResults] = useState(false);

  // Mock flashcards
  const allCards = [
    {
      id: 1,
      term: 'Algorithm',
      definition: 'A step-by-step procedure or formula for solving a problem or completing a task.',
      category: 'Programming',
      difficulty: 'easy',
    },
    {
      id: 2,
      term: 'API',
      definition: 'Application Programming Interface - a set of protocols and tools for building software applications.',
      category: 'Software Engineering',
      difficulty: 'medium',
    },
    {
      id: 3,
      term: 'Big O Notation',
      definition: 'A mathematical notation describing the limiting behavior of a function, used to classify algorithms.',
      category: 'Algorithms',
      difficulty: 'medium',
    },
    {
      id: 4,
      term: 'Closure',
      definition: 'A function that has access to variables in its outer scope, even after the outer function has returned.',
      category: 'Programming',
      difficulty: 'hard',
    },
    {
      id: 5,
      term: 'Recursion',
      definition: 'A programming technique where a function calls itself to solve a problem.',
      category: 'Programming',
      difficulty: 'medium',
    },
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'programming', label: 'Programming' },
    { value: 'algorithms', label: 'Algorithms' },
    { value: 'software', label: 'Software Engineering' },
  ];

  const currentCard = allCards[currentIndex];
  const progress = ((currentIndex + 1) / allCards.length) * 100;
  const remainingCards = allCards.length - currentIndex - 1;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMastered = () => {
    setMasteredCards([...masteredCards, currentCard.id]);
    nextCard();
  };

  const handleSkip = () => {
    setSkippedCards([...skippedCards, currentCard.id]);
    nextCard();
  };

  const nextCard = () => {
    setIsFlipped(false);
    if (currentIndex < allCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const shuffle = () => {
    // Implement shuffle logic
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredCards([]);
    setSkippedCards([]);
  };

  const restart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredCards([]);
    setSkippedCards([]);
    setShowResults(false);
  };

  const ResultsModal = () => (
    <Modal
      isOpen={showResults}
      onClose={() => setShowResults(false)}
      title="Session Complete!"
      size="medium"
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheck className="w-10 h-10 text-success-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Great Job!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            You've completed this flashcard session
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {allCards.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
          </div>
          <div className="text-center p-4 bg-success-50 dark:bg-success-900/20 rounded-lg">
            <p className="text-2xl font-bold text-success-600">
              {masteredCards.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Mastered</p>
          </div>
          <div className="text-center p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
            <p className="text-2xl font-bold text-warning-600">
              {skippedCards.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Skipped</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={restart} fullWidth>
            Start Over
          </Button>
          <Link to="/jargon" className="flex-1">
            <Button variant="primary" fullWidth>
              Back to Library
            </Button>
          </Link>
        </div>
      </div>
    </Modal>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/jargon"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Library
        </Link>
        <div className="flex items-center gap-3">
          <Select
            options={categories}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          />
          <Button variant="ghost" onClick={shuffle} leftIcon={<FiShuffle />}>
            Shuffle
          </Button>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Card {currentIndex + 1} of {allCards.length}
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {remainingCards} remaining
            </span>
          </div>
          <ProgressBar value={progress} />
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-success-600 dark:text-success-400">
                ✓ {masteredCards.length} mastered
              </span>
              <span className="text-warning-600 dark:text-warning-400">
                ⊘ {skippedCards.length} skipped
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Flashcard */}
      <div className="relative">
        <div
          className={`transition-all duration-500 transform ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <Card
            className={`min-h-[400px] flex flex-col items-center justify-center cursor-pointer ${
              isFlipped ? 'hidden' : ''
            }`}
            onClick={handleFlip}
          >
            <div className="text-center space-y-4">
              <Badge variant="info">{currentCard.category}</Badge>
              <h2 className="text-4xl font-display font-bold text-gray-900 dark:text-white">
                {currentCard.term}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Click to reveal definition
              </p>
              <FiRotateCw className="w-8 h-8 text-gray-400 mx-auto mt-8 animate-pulse" />
            </div>
          </Card>

          {/* Back */}
          <Card
            className={`min-h-[400px] flex flex-col items-center justify-center cursor-pointer ${
              !isFlipped ? 'hidden' : ''
            }`}
            onClick={handleFlip}
          >
            <div className="text-center space-y-6 max-w-2xl">
              <Badge variant="info">{currentCard.category}</Badge>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {currentCard.term}
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {currentCard.definition}
              </p>
              <div className="pt-6">
                <Badge variant={
                  currentCard.difficulty === 'easy' ? 'success' :
                  currentCard.difficulty === 'medium' ? 'warning' : 'danger'
                }>
                  {currentCard.difficulty}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handleSkip}
            leftIcon={<FiSkipForward />}
            className="flex-1"
          >
            Skip
          </Button>
          <Button
            variant="ghost"
            onClick={handleFlip}
            leftIcon={<FiRotateCw />}
            className="flex-1"
          >
            Flip Card
          </Button>
          <Button
            variant="success"
            onClick={handleMastered}
            leftIcon={<FiCheck />}
            className="flex-1"
          >
            Mastered
          </Button>
        </div>
      </Card>

      {/* Tips */}
      <Card>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
            💡
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Study Tips
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Try to recall the definition before flipping</li>
              <li>• Mark cards as "Mastered" only when you're confident</li>
              <li>• Review skipped cards in your next session</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Results Modal */}
      <ResultsModal />
    </div>
  );
}

export default FlashcardsPage;