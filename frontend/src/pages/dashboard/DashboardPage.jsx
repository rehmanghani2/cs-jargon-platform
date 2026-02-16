import { useAuth } from '@hooks/useAuth';
import Card from '@components/common/Card';
import Badge from '@components/common/Badge';
import ProgressBar from '@components/common/ProgressBar';
import { 
  FiBook, 
  FiFileText, 
  FiAward, 
  FiTrendingUp,
  FiClock,
  FiCalendar,
  FiArrowRight
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

function DashboardPage() {
  const { user } = useAuth();

  // Mock data - replace with actual API calls
  const stats = [
    {
      title: 'Enrolled Courses',
      value: '5',
      icon: FiBook,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100 dark:bg-primary-900/30',
      link: '/courses',
    },
    {
      title: 'Assignments',
      value: '12',
      icon: FiFileText,
      color: 'text-success-600',
      bgColor: 'bg-success-100 dark:bg-success-900/30',
      link: '/assignments',
    },
    {
      title: 'Certificates',
      value: '3',
      icon: FiAward,
      color: 'text-warning-600',
      bgColor: 'bg-warning-100 dark:bg-warning-900/30',
      link: '/certificates',
    },
    {
      title: 'Learning Streak',
      value: '7 days',
      icon: FiTrendingUp,
      color: 'text-danger-600',
      bgColor: 'bg-danger-100 dark:bg-danger-900/30',
      link: '/profile',
    },
  ];

  const recentCourses = [
    {
      id: 1,
      title: 'Data Structures & Algorithms',
      progress: 75,
      instructor: 'Dr. Sarah Johnson',
      nextLesson: 'Binary Search Trees',
    },
    {
      id: 2,
      title: 'Web Development Fundamentals',
      progress: 45,
      instructor: 'Prof. Michael Chen',
      nextLesson: 'CSS Grid Layout',
    },
    {
      id: 3,
      title: 'Database Management Systems',
      progress: 60,
      instructor: 'Dr. Emily Davis',
      nextLesson: 'SQL Joins',
    },
  ];

  const upcomingAssignments = [
    {
      id: 1,
      title: 'Binary Tree Implementation',
      course: 'Data Structures',
      dueDate: 'Tomorrow',
      status: 'pending',
    },
    {
      id: 2,
      title: 'Responsive Website Design',
      course: 'Web Development',
      dueDate: 'In 3 days',
      status: 'in_progress',
    },
    {
      id: 3,
      title: 'Database Normalization',
      course: 'DBMS',
      dueDate: 'In 5 days',
      status: 'not_started',
    },
  ];

  const recentActivity = [
    { type: 'completed', text: 'Completed "Arrays and Strings" module', time: '2 hours ago' },
    { type: 'badge', text: 'Earned "5-Day Streak" badge', time: '1 day ago' },
    { type: 'submitted', text: 'Submitted "Linked Lists" assignment', time: '2 days ago' },
    { type: 'enrolled', text: 'Enrolled in "Advanced Algorithms"', time: '3 days ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Here's what's happening with your learning journey today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={index} to={stat.link}>
              <Card hover className="h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Courses */}
        <div className="lg:col-span-2">
          <Card title="Continue Learning">
            <div className="space-y-4">
              {recentCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {course.instructor}
                      </p>
                    </div>
                    <Badge variant="info">{course.progress}%</Badge>
                  </div>
                  
                  <ProgressBar value={course.progress} size="small" className="mb-3" />
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Next: {course.nextLesson}
                    </span>
                    <Link
                      to={`/courses/${course.id}`}
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium inline-flex items-center gap-1"
                    >
                      Continue
                      <FiArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Upcoming Assignments */}
        <div>
          <Card title="Upcoming Assignments">
            <div className="space-y-3">
              {upcomingAssignments.map((assignment) => (
                <Link
                  key={assignment.id}
                  to={`/assignments/${assignment.id}`}
                  className="block p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <FiClock className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {assignment.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {assignment.course}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Due {assignment.dueDate}
                    </span>
                    {assignment.status === 'in_progress' && (
                      <Badge variant="warning" size="small">In Progress</Badge>
                    )}
                    {assignment.status === 'not_started' && (
                      <Badge variant="gray" size="small">Not Started</Badge>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            
            <Link
              to="/assignments"
              className="mt-4 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium inline-flex items-center gap-1"
            >
              View all assignments
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card title="Recent Activity">
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">
                  {activity.text}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default DashboardPage;