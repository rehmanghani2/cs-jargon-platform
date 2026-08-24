import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiChevronRight, FiAward } from 'react-icons/fi';
import PropTypes from 'prop-types';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import ProgressBar from '@components/common/ProgressBar';

const QuizComponent = ({
  quiz,
  onComplete,
  onSubmit,
  passingScore = 70,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

  const { title, description, questions = [], timeLimit } = quiz;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    const results = questions.map((question) => {
      const userAnswer = selectedAnswers[question._id];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctCount++;
      
      return {
        questionId: question._id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
      };
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= passingScore;

    const quizResult = {
      score,
      passed,
      correctCount,
      totalQuestions: questions.length,
      results,
    };

    setQuizResults(quizResult);
    setShowResults(true);

    if (onSubmit) onSubmit(quizResult);
    if (onComplete && passed) onComplete(quizResult);
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setQuizResults(null);
  };

  const allAnswered = questions.every((q) => selectedAnswers[q._id] !== undefined);

  // Results View
  if (showResults && quizResults) {
    return (
      <div className="space-y-6">
        {/* Results Header */}
        <div className={`p-8 rounded-xl ${
          quizResults.passed
            ? 'bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-500 dark:border-green-400'
            : 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-500 dark:border-red-400'
        }`}>
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
              quizResults.passed ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {quizResults.passed ? (
                <FiCheckCircle className="w-10 h-10 text-white" />
              ) : (
                <FiXCircle className="w-10 h-10 text-white" />
              )}
            </div>
            <h3 className={`text-3xl font-bold mb-2 ${
              quizResults.passed
                ? 'text-green-900 dark:text-green-100'
                : 'text-red-900 dark:text-red-100'
            }`}>
              {quizResults.passed ? 'Congratulations!' : 'Keep Trying!'}
            </h3>
            <p className={`text-lg ${
              quizResults.passed
                ? 'text-green-700 dark:text-green-300'
                : 'text-red-700 dark:text-red-300'
            }`}>
              You scored {quizResults.score}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {quizResults.correctCount} out of {quizResults.totalQuestions} questions correct
            </p>
            {quizResults.passed && (
              <Badge variant="success" className="mt-4" leftIcon={<FiAward />}>
                Quiz Passed
              </Badge>
            )}
          </div>
        </div>

        {/* Question Review */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Review Answers
          </h4>
          <div className="space-y-4">
            {questions.map((question, index) => {
              const result = quizResults.results[index];
              const isCorrect = result.isCorrect;
              
              return (
                <div
                  key={question._id}
                  className={`p-4 rounded-lg border-2 ${
                    isCorrect
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-2">
                    {isCorrect ? (
                      <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                    ) : (
                      <FiXCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white mb-2">
                        {index + 1}. {question.text}
                      </p>
                      <p className={`text-sm ${
                        isCorrect
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-red-700 dark:text-red-300'
                      }`}>
                        Your answer: {question.options[result.userAnswer]}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                          Correct answer: {question.options[result.correctAnswer]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {!quizResults.passed && (
            <Button variant="primary" onClick={handleRetry} fullWidth>
              Retry Quiz
            </Button>
          )}
          {quizResults.passed && onComplete && (
            <Button variant="primary" onClick={() => onComplete(quizResults)} fullWidth>
              Continue to Next Lesson
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Quiz View
  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h2>
        {description && (
          <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
        )}
        <div className="flex items-center gap-4 text-sm">
          <Badge variant="info">{questions.length} Questions</Badge>
          {timeLimit && <Badge variant="warning">{timeLimit} minutes</Badge>}
          <Badge variant="gray">Passing Score: {passingScore}%</Badge>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <ProgressBar value={progress} max={100} variant="primary" />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {currentQuestion.text}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion._id, index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAnswers[currentQuestion._id] === index
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswers[currentQuestion._id] === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {selectedAnswers[currentQuestion._id] === index && (
                      <div className="w-3 h-3 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="flex-1 text-gray-900 dark:text-white">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                index === currentQuestionIndex
                  ? 'bg-blue-500 text-white'
                  : selectedAnswers[questions[index]._id] !== undefined
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestionIndex === questions.length - 1 ? (
          <Button
            variant="primary"
            onClick={handleSubmitQuiz}
            disabled={!allAnswered}
            rightIcon={<FiCheckCircle />}
          >
            Submit Quiz
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleNext}
            rightIcon={<FiChevronRight />}
          >
            Next
          </Button>
        )}
      </div>

      {/* Unanswered Warning */}
      {currentQuestionIndex === questions.length - 1 && !allAnswered && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            ⚠️ Please answer all questions before submitting the quiz.
          </p>
        </div>
      )}
    </div>
  );
};

QuizComponent.propTypes = {
  quiz: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(PropTypes.string).isRequired,
        correctAnswer: PropTypes.number.isRequired,
      })
    ).isRequired,
    timeLimit: PropTypes.number,
  }).isRequired,
  onComplete: PropTypes.func,
  onSubmit: PropTypes.func,
  passingScore: PropTypes.number,
};

export default QuizComponent;