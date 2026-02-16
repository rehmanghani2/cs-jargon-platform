import { Link } from 'react-router-dom';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import ProgressBar from '@components/common/ProgressBar';
import {
  FiCheckCircle,
  FiXCircle,
  FiAward,
  FiTrendingUp,
  FiBook,
} from 'react-icons/fi';

function PlacementResultPage() {
  // Mock results data
  const results = {
    score: 85,
    totalQuestions: 5,
    correctAnswers: 4,
    incorrectAnswers: 1,
    timeTaken: '18:35',
    passed: true,
    level: 'Intermediate',
    percentage: 80,
  };

  const recommendations = [
    {
      id: 1,
      title: 'Data Structures & Algorithms',
      difficulty: 'intermediate',
      reason: 'Based on your strong foundation',
    },
    {
      id: 2,
      title: 'Advanced Programming Concepts',
      difficulty: 'intermediate',
      reason: 'Perfect for your current level',
    },
    {
      id: 3,
      title: 'System Design Fundamentals',
      difficulty: 'intermediate',
      reason: 'Next step in your learning journey',
    },
  ];

  const strengths = [
    'Data Structures',
    'Algorithm Complexity',
    'Programming Fundamentals',
  ];

  const improvements = [
    'Advanced Algorithms',
    'System Design Patterns',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Results Header */}
      <Card className="text-center">
        <div className="space-y-6">
          <div className="w-24 h-24 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center mx-auto">
            {results.passed ? (
              <FiCheckCircle className="w-12 h-12 text-success-600" />
            ) : (
              <FiXCircle className="w-12 h-12 text-danger-600" />
            )}
          </div>

          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
              {results.passed ? 'Congratulations!' : 'Test Complete'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {results.passed
                ? 'You passed the placement test'
                : 'Keep learning and try again'}
            </p>
          </div>

          <div>
            <div className="text-6xl font-bold text-gray-900 dark:text-white mb-2">
              {results.percentage}%
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Your Score
            </p>
          </div>

          <Badge
            variant={results.passed ? 'success' : 'danger'}
            className="text-lg py-2 px-6"
          >
            {results.level} Level
          </Badge>
        </div>
      </Card>

      {/* Detailed Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiCheckCircle className="w-6 h-6 text-success-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {results.correctAnswers}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Correct Answers
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-danger-100 dark:bg-danger-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiXCircle className="w-6 h-6 text-danger-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {results.incorrectAnswers}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Incorrect Answers
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiTrendingUp className="w-6 h-6 text-primary-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {results.timeTaken}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Time Taken
            </p>
          </div>
        </Card>
      </div>

      {/* Performance Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Strengths">
          <div className="space-y-3">
            {strengths.map((strength, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-success-50 dark:bg-success-900/20 rounded-lg"
              >
                <FiCheckCircle className="w-5 h-5 text-success-600" />
                <span className="text-gray-900 dark:text-white">{strength}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Areas for Improvement">
          <div className="space-y-3">
            {improvements.map((area, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-warning-50 dark:bg-warning-900/20 rounded-lg"
              >
                <FiTrendingUp className="w-5 h-5 text-warning-600" />
                <span className="text-gray-900 dark:text-white">{area}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recommended Courses */}
      <Card title="Recommended Courses">
        <div className="space-y-4">
          {recommendations.map((course) => (
            <div
              key={course.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                  <FiBook className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {course.reason}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    course.difficulty === 'beginner'
                      ? 'success'
                      : course.difficulty === 'intermediate'
                      ? 'warning'
                      : 'danger'
                  }
                >
                  {course.difficulty}
                </Badge>
                <Link to={`/courses/${course.id}`}>
                  <Button variant="outline" size="small">
                    Enroll
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Next Steps */}
      <Card className="bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border-2 border-primary-200 dark:border-primary-800">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <FiAward className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Your Learning Path
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Based on your {results.level} level, we've created a personalized learning path to help you master CS concepts effectively.
            </p>
            <div className="flex gap-3">
              <Link to="/courses">
                <Button variant="primary">
                  Start Learning
                </Button>
              </Link>
              <Link to="/jargon">
                <Button variant="outline">
                  Explore Jargon Library
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4">
        <Link to="/placement-test">
          <Button variant="outline">
            Retake Test
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="ghost">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default PlacementResultPage;