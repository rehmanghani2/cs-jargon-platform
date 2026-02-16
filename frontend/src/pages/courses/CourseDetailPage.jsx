import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import ProgressBar from '@components/common/ProgressBar';
import Tabs from '@components/common/Tabs';
import Avatar from '@components/common/Avatar';
import {
  FiBook,
  FiClock,
  FiUsers,
  FiStar,
  FiPlayCircle,
  FiCheckCircle,
  FiLock,
  FiArrowLeft,
} from 'react-icons/fi';

function CourseDetailPage() {
  const { courseId } = useParams();
  const [isEnrolled, setIsEnrolled] = useState(true);

  // Mock data
  const course = {
    id: courseId,
    title: 'Data Structures & Algorithms',
    description:
      'Master fundamental data structures and algorithms essential for software development. This comprehensive course covers arrays, linked lists, trees, graphs, sorting, searching, and dynamic programming.',
    instructor: {
      name: 'Dr. Sarah Johnson',
      avatar: null,
      bio: 'Professor of Computer Science with 15 years of teaching experience.',
    },
    difficulty: 'intermediate',
    duration: '12 weeks',
    students: 1234,
    rating: 4.8,
    reviews: 342,
    enrolled: isEnrolled,
    progress: 75,
    thumbnail: '/images/course-1.jpg',
    learningOutcomes: [
      'Understand fundamental data structures',
      'Implement common algorithms',
      'Analyze time and space complexity',
      'Solve coding problems efficiently',
    ],
    requirements: [
      'Basic programming knowledge',
      'Understanding of variables and control flow',
      'Familiarity with at least one programming language',
    ],
    modules: [
      {
        id: 1,
        title: 'Introduction to Data Structures',
        lessons: 5,
        duration: '2 hours',
        completed: true,
      },
      {
        id: 2,
        title: 'Arrays and Strings',
        lessons: 8,
        duration: '3 hours',
        completed: true,
      },
      {
        id: 3,
        title: 'Linked Lists',
        lessons: 6,
        duration: '2.5 hours',
        completed: false,
        inProgress: true,
      },
      {
        id: 4,
        title: 'Stacks and Queues',
        lessons: 7,
        duration: '3 hours',
        completed: false,
        locked: true,
      },
      {
        id: 5,
        title: 'Trees and Graphs',
        lessons: 10,
        duration: '4 hours',
        completed: false,
        locked: true,
      },
    ],
  };

  const handleEnroll = () => {
    setIsEnrolled(true);
  };

  const overviewTab = (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          About this course
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {course.description}
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          What you'll learn
        </h3>
        <ul className="grid md:grid-cols-2 gap-3">
          {course.learningOutcomes.map((outcome, index) => (
            <li key={index} className="flex items-start gap-2">
              <FiCheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 dark:text-gray-400">{outcome}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Requirements
        </h3>
        <ul className="space-y-2">
          {course.requirements.map((req, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-gray-600 dark:text-gray-400">{req}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Instructor
        </h3>
        <div className="flex items-center gap-4">
          <Avatar name={course.instructor.name} size="large" />
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {course.instructor.name}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {course.instructor.bio}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const curriculumTab = (
    <div className="space-y-3">
      {course.modules.map((module) => (
        <Card key={module.id} className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex-shrink-0 mt-1">
                {module.completed ? (
                  <div className="w-8 h-8 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center">
                    <FiCheckCircle className="w-5 h-5 text-success-600" />
                  </div>
                ) : module.locked ? (
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <FiLock className="w-5 h-5 text-gray-400" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                    <FiPlayCircle className="w-5 h-5 text-primary-600" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {module.title}
                </h4>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>{module.lessons} lessons</span>
                  <span>•</span>
                  <span>{module.duration}</span>
                </div>
              </div>
            </div>

            {isEnrolled && !module.locked && (
              <Link to={`/courses/${courseId}/modules/${module.id}`}>
                <Button variant="ghost" size="small">
                  {module.completed ? 'Review' : module.inProgress ? 'Continue' : 'Start'}
                </Button>
              </Link>
            )}
          </div>
        </Card>
      ))}
    </div>
  );

  const reviewsTab = (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 dark:text-white">
            {course.rating}
          </div>
          <div className="flex items-center justify-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(course.rating)
                    ? 'text-warning-500 fill-warning-500'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {course.reviews} reviews
          </p>
        </div>

        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                {stars} star
              </span>
              <ProgressBar value={stars === 5 ? 80 : stars === 4 ? 15 : 5} size="small" className="flex-1" />
            </div>
          ))}
        </div>
      </div>

      {/* Mock reviews */}
      <div className="space-y-4 mt-8">
        {[1, 2, 3].map((review) => (
          <Card key={review}>
            <div className="flex items-start gap-4">
              <Avatar name="John Doe" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    John Doe
                  </h4>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className="w-4 h-4 text-warning-500 fill-warning-500"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Great course! The instructor explains everything clearly and the
                  examples are very helpful.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  2 weeks ago
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        to="/courses"
        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Courses
      </Link>

      {/* Course header */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="aspect-video bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg mb-6 flex items-center justify-center">
              <FiBook className="w-24 h-24 text-white opacity-50" />
            </div>

            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                    {course.title}
                  </h1>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {course.description.substring(0, 150)}...
                  </p>
                </div>
                <Badge variant="warning">{course.difficulty}</Badge>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <FiClock className="w-5 h-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiUsers className="w-5 h-5" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiStar className="w-5 h-5 text-warning-500" />
                  <span>{course.rating} ({course.reviews} reviews)</span>
                </div>
              </div>

              {isEnrolled && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Your Progress
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {course.progress}%
                    </span>
                  </div>
                  <ProgressBar value={course.progress} />
                </div>
              )}
            </div>
          </Card>

          {/* Tabs */}
          <Tabs
            tabs={[
              { label: 'Overview', content: overviewTab },
              { label: 'Curriculum', content: curriculumTab },
              { label: 'Reviews', content: reviewsTab, badge: course.reviews },
            ]}
          />
        </div>

        {/* Sidebar */}
        <div>
          <Card className="sticky top-6">
            <div className="space-y-4">
              {isEnrolled ? (
                <>
                  <Button variant="primary" fullWidth size="large">
                    Continue Learning
                  </Button>
                  <Button variant="outline" fullWidth>
                    Download Resources
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="primary" fullWidth size="large" onClick={handleEnroll}>
                    Enroll Now
                  </Button>
                  <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                    30-day money-back guarantee
                  </p>
                </>
              )}

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  This course includes:
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <FiCheckCircle className="w-4 h-4 text-success-600" />
                    <span>12 hours of video content</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheckCircle className="w-4 h-4 text-success-600" />
                    <span>25 coding exercises</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheckCircle className="w-4 h-4 text-success-600" />
                    <span>Downloadable resources</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheckCircle className="w-4 h-4 text-success-600" />
                    <span>Certificate of completion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheckCircle className="w-4 h-4 text-success-600" />
                    <span>Lifetime access</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailPage;