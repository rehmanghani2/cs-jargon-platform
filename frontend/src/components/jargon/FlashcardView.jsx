import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiShuffle, FiCheck, FiX, FiVolume2, FiRotateCw } from 'react-icons/fi';
import PropTypes from 'prop-types';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import toast from 'react-hot-toast';

const FlashcardView = ({
  flashcards = [],
  onMastered,
  onSkipped,
  onComplete,
  autoAdvance = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState([]);
  const [skippedCards, setSkippedCards] = useState([]);
  const [shuffledCards, setShuffledCards] = useState(flashcards);

  useEffect(() => {
    setShuffledCards(flashcards);
  }, [flashcards]);

  const currentCard = shuffledCards[currentIndex];
  const progress = shuffledCards.length > 0 ? ((currentIndex + 1) / shuffledCards.length) * 100 : 0;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSpeak = (e) => {
    if (e) e.stopPropagation();
    if (!currentCard) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentCard.term);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      toast.success(`Pronouncing: "${currentCard.term}"`, { id: 'speech-toast' });
    } else {
      toast.error('Text-to-speech not supported in this browser.');
    }
  };

  const handleNext = () => {
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else if (onComplete) {
      onComplete({
        total: shuffledCards.length,
        mastered: masteredCards.length,
        skipped: skippedCards.length,
      });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleMastered = () => {
    if (!currentCard) return;
    if (!masteredCards.includes(currentCard._id || currentCard.id)) {
      const cardId = currentCard._id || currentCard.id;
      setMasteredCards(prev => [...prev, cardId]);
      if (onMastered) onMastered(currentCard);
      toast.success(`Mastered "${currentCard.term}"! 🎉`);
    }
    if (autoAdvance) {
      setTimeout(handleNext, 400);
    }
  };

  const handleSkipped = () => {
    if (!currentCard) return;
    if (!skippedCards.includes(currentCard._id || currentCard.id)) {
      const cardId = currentCard._id || currentCard.id;
      setSkippedCards(prev => [...prev, cardId]);
      if (onSkipped) onSkipped(currentCard);
      toast.custom((t) => (
        <div className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-md text-sm">
          Skipped "{currentCard.term}". Needs review.
        </div>
      ));
    }
    if (autoAdvance) {
      setTimeout(handleNext, 400);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...shuffledCards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    toast.success('Deck reshuffled! 🔀');
  };

  // Keyboard Navigation Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing inside input/textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight' || e.code === 'KeyN') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyP') {
        e.preventDefault();
        handlePrevious();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        handleMastered();
      } else if (e.code === 'KeyS') {
        e.preventDefault();
        handleSkipped();
      } else if (e.code === 'KeyV') {
        e.preventDefault();
        handleSpeak();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isFlipped, shuffledCards, masteredCards, skippedCards]);

  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
        <FiShuffle className="w-12 h-12 text-primary-500 mb-4 animate-spin" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">No flashcards available</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Select a category or refresh to load jargon cards.</p>
      </div>
    );
  }

  const cardId = currentCard._id || currentCard.id;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Card {currentIndex + 1} of {shuffledCards.length}
          </span>
          <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-primary-500 to-purple-600 h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {shuffledCards.length}
          </div>
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Cards</div>
        </div>
        <div className="text-center p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {masteredCards.length}
          </div>
          <div className="text-xs font-medium text-green-700 dark:text-green-300">Mastered</div>
        </div>
        <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-xl">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {skippedCards.length}
          </div>
          <div className="text-xs font-medium text-orange-700 dark:text-orange-300">Needs Review</div>
        </div>
      </div>

      {/* Interactive 3D Card */}
      <div
        className="relative h-96 cursor-pointer select-none"
        onClick={handleFlip}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex + (isFlipped ? '-flipped' : '-front')}
            initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`absolute inset-0 rounded-2xl shadow-xl border-2 p-8 flex flex-col items-center justify-between transition-colors ${
              isFlipped
                ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white border-purple-500/30'
                : 'bg-white dark:bg-gray-800 border-primary-200 dark:border-gray-700'
            }`}
          >
            {/* Top Bar */}
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="info">{currentCard.category || 'CS Jargon'}</Badge>
                {currentCard.difficulty && (
                  <Badge variant={
                    currentCard.difficulty.toLowerCase() === 'easy' || currentCard.difficulty === 'Beginner' ? 'success' :
                    currentCard.difficulty.toLowerCase() === 'medium' || currentCard.difficulty === 'Intermediate' ? 'warning' : 'danger'
                  }>
                    {currentCard.difficulty}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSpeak}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors"
                  title="Listen to pronunciation (V)"
                >
                  <FiVolume2 className="w-5 h-5" />
                </button>
                <div className="text-xs font-semibold px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-md">
                  {isFlipped ? 'Answer' : 'Question'}
                </div>
              </div>
            </div>

            {/* Card Content */}
            {!isFlipped ? (
              <div className="text-center my-auto space-y-4">
                <h3 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {currentCard.term}
                </h3>
                {currentCard.pronunciation && (
                  <p className="text-lg text-primary-600 dark:text-primary-400 font-mono">
                    /{currentCard.pronunciation}/
                  </p>
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500 tracking-wider uppercase font-semibold mt-4">
                  Click or Press [Space] to reveal definition
                </p>
              </div>
            ) : (
              <div className="text-center my-auto space-y-4 max-h-64 overflow-y-auto px-2">
                <p className="text-lg md:text-xl text-gray-100 font-medium leading-relaxed">
                  {currentCard.definition}
                </p>
                {(currentCard.examples?.length > 0 || currentCard.example) && (
                  <div className="mt-4 text-left bg-gray-800/80 border border-gray-700 rounded-xl p-4">
                    <p className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
                      Real-world Example:
                    </p>
                    <p className="text-sm text-gray-300 italic">
                      "{currentCard.example || currentCard.examples[0]}"
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Card Status Badges */}
            <div className="w-full flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
              <span className="flex items-center gap-1">
                <FiRotateCw className="w-3.5 h-3.5" /> Tap to Flip
              </span>

              <div className="flex gap-2">
                {masteredCards.includes(cardId) && (
                  <span className="inline-flex items-center gap-1 text-green-500 font-semibold">
                    <FiCheck /> Mastered
                  </span>
                )}
                {skippedCards.includes(cardId) && (
                  <span className="inline-flex items-center gap-1 text-orange-500 font-semibold">
                    <FiX /> Skipped
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          leftIcon={<FiChevronLeft />}
        >
          Previous
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={handleShuffle}
            leftIcon={<FiShuffle />}
            title="Shuffle deck (R)"
          >
            Shuffle
          </Button>
          <Button
            variant="danger"
            onClick={handleSkipped}
            leftIcon={<FiX />}
            disabled={skippedCards.includes(cardId)}
          >
            Skip (S)
          </Button>
          <Button
            variant="success"
            onClick={handleMastered}
            leftIcon={<FiCheck />}
            disabled={masteredCards.includes(cardId)}
          >
            Mastered (M)
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex === shuffledCards.length - 1}
          rightIcon={<FiChevronRight />}
        >
          Next
        </Button>
      </div>

      {/* Interactive Helper Hints */}
      <div className="flex items-center justify-center gap-4 text-xs font-mono text-gray-500 dark:text-gray-400">
        <span><kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200">Space</kbd> Flip</span>
        <span><kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200">← / →</kbd> Navigate</span>
        <span><kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200">M</kbd> Master</span>
        <span><kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200">V</kbd> Speak</span>
      </div>
    </div>
  );
};

FlashcardView.propTypes = {
  flashcards: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      term: PropTypes.string.isRequired,
      definition: PropTypes.string.isRequired,
      category: PropTypes.string,
      difficulty: PropTypes.string,
      pronunciation: PropTypes.string,
      examples: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  onMastered: PropTypes.func,
  onSkipped: PropTypes.func,
  onComplete: PropTypes.func,
  autoAdvance: PropTypes.bool,
};

export default FlashcardView;