import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import SearchInput from '@components/common/SearchInput';
import Select from '@components/common/Select';
import Badge from '@components/common/Badge';
import ProgressBar from '@components/common/ProgressBar';
import EmptyState from '@components/common/EmptyState';
import Tabs from '@components/common/Tabs';
import { FiBook, FiClock, FiUsers, FiStar, FiFilter } from 'react-icons/fi';

function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Mock data
  const allCourses = [
    {
      id: 1,
      title: 'Data Structures & Algorithms',
      description: 'Master fundamental data structures and algorithms essential for software development.',
      instructor: 'Dr. Sarah Johnson',
      difficulty: 'intermediate',
      duration: '12 weeks',
      students: 1234,
      rating: 4.8,
      thumbnail: '/images/course-1.jpg',
      category: 'Programming',
      enrolled: true,
      progress: 75,
    },
    {
      id: 2,
      title: 'Web Development Fundamentals',
      description: 'Learn HTML, CSS, and JavaScript to build modern web applications.',
      instructor: 'Prof. Michael Chen',
      difficulty: 'beginner',
      duration: '8 weeks',
      students: 2341,
      rating: 4.9,
      thumbnail: '/images/course-2.jpg',
      category: 'Web Development',
      enrolled: true,
      progress: 45,
    },
    {
      id: 3,
      title: 'Database Management Systems',
      description: 'Comprehensive guide to relational databases and SQL.',
      instructor: 'Dr. Emily Davis',
      difficulty: 'intermediate',
      duration: '10 weeks',
      students: 987,
      rating: 4.7,
      thumbnail: '/images/course-3.jpg',
      category: 'Database',
      enrolled: true,
      progress: 60,
    },
    {
      id: 4,
      title: 'Machine Learning Basics',
      description: 'Introduction to machine learning concepts and applications.',
      instructor: 'Dr. James Wilson',
      difficulty: 'advanced',
      duration: '14 weeks',
      students: 756,
      rating: 4.6,
      thumbnail: '/images/course-4.jpg',
      category: 'AI/ML',
      enrolled: false,
      progress: 0,
    },
    {
      id: 5,
      title: 'Cloud Computing Essentials',
      description: 'Learn AWS, Azure, and cloud architecture fundamentals.',
      instructor: 'Prof. Lisa Brown',
      difficulty: 'intermediate',
      duration: '10 weeks',
      students: 1567,
      rating: 4.8,
      thumbnail: '/images/course-5.jpg',
      category: 'Cloud',
      enrolled: false,
      progress: 0,
    },
  ];

  const enrolledCourses = allCourses.filter(course => course.enrolled);
  const availableCourses = allCourses.filter(course => !course.enrolled);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'programming', label: 'Programming' },
    { value: 'web', label: 'Web Development' },
    { value: 'database', label: 'Database' },
    { value: 'ai', label: 'AI/ML' },
    { value: 'cloud', label: 'Cloud' },
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'success',
      intermediate: 'warning',
      advanced: 'danger',
    };
    return colors[difficulty] || 'gray';
  };

  const CourseCard = ({ course }) => (
    <Card hover className="h-full">
      <div className="aspect-video bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
        <FiBook className="w-16 h-16 text-white opacity-50" />
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
              {course.title}
            </h3>
            <Badge variant={getDifficultyColor(course.difficulty)} size="small">
              {course.difficulty}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {course.description}
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <FiClock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiUsers className="w-4 h-4" />
            <span>{course.students.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiStar className="w-4 h-4 text-warning-500" />
            <span>{course.rating}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          By {course.instructor}
        </p>

        {course.enrolled && course.progress > 0 && (
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Progress</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {course.progress}%
              </span>
            </div>
            <ProgressBar value={course.progress} size="small" />
          </div>
        )}

        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          {course.enrolled ? (
            <Link to={`/courses/${course.id}`}>
              <Button variant="primary" fullWidth>
                Continue Learning
              </Button>
            </Link>
          ) : (
            <Link to={`/courses/${course.id}`}>
              <Button variant="outline" fullWidth>
                View Course
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );

  const enrolledTab = (
    <div>
      {enrolledCourses.length === 0 ? (
        <EmptyState
          icon={FiBook}
          title="No enrolled courses"
          description="You haven't enrolled in any courses yet. Browse available courses to get started."
          actionLabel="Browse Courses"
          onAction={() => {}}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );

  const allCoursesTab = (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
            Courses
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Explore and manage your learning journey
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid md:grid-cols-3 gap-4">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
            placeholder="Search courses..."
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

      {/* Tabs */}
      <Tabs
        tabs={[
          {
            label: 'My Courses',
            content: enrolledTab,
            badge: enrolledCourses.length,
          },
          {
            label: 'All Courses',
            content: allCoursesTab,
            badge: availableCourses.length,
          },
        ]}
      />
    </div>
  );
}

export default CoursesPage;