import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import ProgressBar from '@components/common/ProgressBar';
import {
  FiArrowLeft,
  FiPlayCircle,
  FiCheckCircle,
  FiLock,
  FiClock,
  FiFileText,
  FiDownload,
} from 'react-icons/fi';

function ModulePage() {
  const { courseId, moduleId } = useParams();
  const [completedLessons, setCompletedLessons] = useState([1, 2]);

  // Mock data
  const module = {
    id: moduleId,
    title: 'Arrays and Strings',
    description: 'Learn fundamental operations on arrays and strings, including manipulation, searching, and common algorithms.',
    courseTitle: 'Data Structures & Algorithms',
    duration: '3 hours',
    lessons: [
      {
        id: 1,
        title: 'Introduction to Arrays',
        type: 'video',
        duration: '15 min',
        completed: true,
      },
      {
        id: 2,
        title: 'Array Operations',
        type: 'video',
        duration: '20 min',
        completed: true,
      },
      {
        id: 3,
        title: 'Array Algorithms',
        type: 'video',
        duration: '25 min',
        completed: false,
      },
      {
        id: 4,
        title: 'Practice: Array Problems',
        type: 'quiz',
        duration: '30 min',
        completed: false,
      },
      {
        id: 5,
        title: 'String Manipulation',
        type: 'video',
        duration: '20 min',
        completed: false,
        locked: true,
      },
      {
        id: 6,
        title: 'String Algorithms',
        type: 'video',
        duration: '25 min',
        completed: false,
        locked: true,
      },
      {
        id: 7,
        title: 'Practice: String Problems',
        type: 'quiz',
        duration: '30 min',
        completed: false,
        locked: true,
      },
      {
        id: 8,
        title: 'Module Assessment',
        type: 'assignment',
        duration: '1 hour',
        completed: false,
        locked: true,
      },
    ],
    resources: [
      { id: 1, title: 'Module Notes (PDF)', size: '2.5 MB', url: '#' },
      { id: 2, title: 'Code Examples', size: '500 KB', url: '#' },
      { id: 3, title: 'Practice Problems', size: '1 MB', url: '#' },
    ],
    quiz: {
      totalQuestions: 10,
      passingScore: 70,
      attempts: 3,
    },
  };

  const progress = (completedLessons.length / module.lessons.length) * 100;

  const getLessonIcon = (type) => {
    const icons = {
      video: FiPlayCircle,
      quiz: FiFileText,
      assignment: FiFileText,
    };
    const Icon = icons[type] || FiPlayCircle;
    return Icon;
  };

  const handleLessonClick = (lesson) => {
    if (!lesson.locked) {
      // Navigate to lesson
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <Link to="/courses" className="hover:text-primary-600 dark:hover:text-primary-400">
          Courses
        </Link>
        <span>/</span>
        <Link
          to={`/courses/${courseId}`}
          className="hover:text-primary-600 dark:hover:text-primary-400"
        >
          {module.courseTitle}
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">{module.title}</span>
      </div>

      {/* Module Header */}
      <Card>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
              {module.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {module.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <FiClock className="w-4 h-4" />
                <span>{module.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiFileText className="w-4 h-4" />
                <span>{module.lessons.length} lessons</span>
              </div>
              <div className="flex items-center gap-1">
                <FiCheckCircle className="w-4 h-4 text-success-600" />
                <span>{completedLessons.length} completed</span>
              </div>
            </div>
          </div>
          <Link to={`/courses/${courseId}`}>
            <Button variant="ghost" leftIcon={<FiArrowLeft />}>
              Back to Course
            </Button>
          </Link>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Module Progress
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {Math.round(progress)}%
            </span>
          </div>
          <ProgressBar value={progress} />
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lessons List */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Lessons
          </h2>
          {module.lessons.map((lesson, index) => {
            const Icon = getLessonIcon(lesson.type);
            const isCompleted = completedLessons.includes(lesson.id);
            const isLocked = lesson.locked;

            return (
              <Card
                key={lesson.id}
                hover={!isLocked}
                clickable={!isLocked}
                onClick={() => handleLessonClick(lesson)}
                className={isLocked ? 'opacity-60' : ''}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <div className="w-10 h-10 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center">
                        <FiCheckCircle className="w-5 h-5 text-success-600" />
                      </div>
                    ) : isLocked ? (
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <FiLock className="w-5 h-5 text-gray-400" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary-600" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Lesson {index + 1}
                      </span>
                      {lesson.type === 'quiz' && (
                        <Badge variant="warning" size="small">
                          Quiz
                        </Badge>
                      )}
                      {lesson.type === 'assignment' && (
                        <Badge variant="danger" size="small">
                          Assignment
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {lesson.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {lesson.duration}
                    </span>
                    {!isLocked && (
                      <Link
                        to={`/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}`}
                      >
                        <Button variant="ghost" size="small">
                          {isCompleted ? 'Review' : 'Start'}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Module Resources */}
          <Card title="Resources">
            <div className="space-y-3">
              {module.resources.map((resource) => (
                <a
                  key={resource.id}
                  href={resource.url}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <FiFileText className="w-4 h-4 text-gray-400" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {resource.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {resource.size}
                      </p>
                    </div>
                  </div>
                  <FiDownload className="w-4 h-4 text-gray-400" />
                </a>
              ))}
            </div>
          </Card>

          {/* Quiz Info */}
          {module.quiz && (
            <Card title="Module Quiz">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Questions</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {module.quiz.totalQuestions}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Passing Score</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {module.quiz.passingScore}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Attempts Left</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {module.quiz.attempts}
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* Navigation */}
          <Card>
            <div className="space-y-3">
              <Button variant="primary" fullWidth>
                Continue Learning
              </Button>
              <Button variant="outline" fullWidth>
                Mark as Complete
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ModulePage;