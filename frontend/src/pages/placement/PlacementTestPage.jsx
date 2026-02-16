import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import ProgressBar from '@components/common/ProgressBar';
import Badge from '@components/common/Badge';
import Modal from '@components/common/Modal';
import {
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
} from 'react-icons/fi';

function PlacementTestPage() {
  const navigate = useNavigate();
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Mock questions
  const questions = [
    {
      id: 1,
      question: 'What is the time complexity of binary search?',
      options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
      correctAnswer: 1,
    },
    {
      id: 2,
      question: 'Which data structure uses LIFO (Last In First Out)?',
      options: ['Queue', 'Stack', 'Array', 'Linked List'],
      correctAnswer: 1,
    },
    {
      id: 3,
      question: 'What does API stand for?',
      options: [
        'Application Programming Interface',
        'Advanced Programming Interface',
        'Application Process Integration',
        'Advanced Process Interface',
      ],
      correctAnswer: 0,
    },
    {
      id: 4,
      question: 'Which of the following is NOT a programming paradigm?',
      options: [
        'Object-Oriented',
        'Functional',
        'Procedural',
        'Sequential',
      ],
      correctAnswer: 3,
    },
    {
      id: 5,
      question: 'What is a closure in programming?',
      options: [
        'A function that closes a file',
        'A function with access to outer scope variables',
        'The end of a code block',
        'A method to terminate a program',
      ],
      correctAnswer: 1,
    },
  ];

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  const handleStart = () => {
    setHasStarted(true);
    // Start timer
  };

  const handleAnswer = (questionId, optionIndex) => {
    setAnswers({
      ...answers,
      [questionId]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setShowSubmitModal(true);
  };

  const confirmSubmit = () => {
    // Calculate score and navigate to results
    navigate('/placement-test/result');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!hasStarted) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto">
              <FiCheckCircle className="w-10 h-10 text-primary-600" />
            </div>

            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
                Placement Test
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Evaluate your current knowledge level
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <FiClock className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  30 min
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <FiCheckCircle className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {questions.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Questions</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <FiAlertCircle className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  70%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pass Score</p>
              </div>
            </div>

            <div className="p-4 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg">
              <div className="flex items-start gap-3">
                <FiAlertCircle className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <h3 className="font-semibold text-warning-900 dark:text-warning-200 mb-2">
                    Important Instructions
                  </h3>
                  <ul className="text-sm text-warning-800 dark:text-warning-300 space-y-1">
                    <li>• You have 30 minutes to complete the test</li>
                    <li>• All questions must be answered</li>
                    <li>• You cannot return to previous questions after submitting</li>
                    <li>• Passing score is 70%</li>
                    <li>• Results will determine your recommended starting level</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="primary"
                size="large"
                onClick={handleStart}
                fullWidth
              >
                Start Test
              </Button>
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                Maybe Later
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const selectedAnswer = answers[question.id];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Placement Test
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <FiClock className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                {formatTime(timeRemaining)}
              </span>
            </div>
            <Badge variant={answeredCount === questions.length ? 'success' : 'warning'}>
              {answeredCount}/{questions.length} answered
            </Badge>
          </div>
        </div>
        <ProgressBar value={progress} className="mt-4" />
      </Card>

      {/* Question */}
      <Card>
        <div className="space-y-6">
          <div>
            <Badge variant="info" className="mb-4">
              Question {currentQuestion + 1}
            </Badge>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {question.question}
            </h3>
          </div>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(question.id, index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswer === index
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index
                        ? 'border-primary-600 bg-primary-600'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {selectedAnswer === index && (
                      <FiCheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-gray-900 dark:text-white">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Question Navigator */}
      <Card>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestion(index)}
              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                answers[q.id] !== undefined
                  ? 'bg-success-600 text-white'
                  : index === currentQuestion
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </Card>

      {/* Navigation */}
      <Card>
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>

          <div className="flex gap-3">
            {currentQuestion === questions.length - 1 ? (
              <Button
                variant="success"
                onClick={handleSubmit}
                disabled={unansweredCount > 0}
              >
                Submit Test
              </Button>
            ) : (
              <Button variant="primary" onClick={handleNext}>
                Next Question
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Submit Confirmation Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Test?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowSubmitModal(false)}>
              Continue Test
            </Button>
            <Button variant="primary" onClick={confirmSubmit}>
              Submit
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to submit your test? You won't be able to change your answers after submission.
          </p>
          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Answered Questions
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {answeredCount} / {questions.length}
              </span>
            </div>
            {unansweredCount > 0 && (
              <p className="text-sm text-warning-600 dark:text-warning-400">
                You have {unansweredCount} unanswered question(s)
              </p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default PlacementTestPage;