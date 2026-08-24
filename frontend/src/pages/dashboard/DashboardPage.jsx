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
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-700 text-white p-6 sm:p-8 shadow-xl shadow-primary-500/15">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active Placement Level: {user?.assignedLevel || 'Intermediate'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p className="text-primary-100 text-sm max-w-xl">
              You are on a <strong>{user?.currentStreak || 7}-day streak</strong>! Explore new Computer Science terminologies and complete today's jargon challenge.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/jargon"
              className="px-5 py-2.5 rounded-xl bg-white text-primary-700 font-bold text-sm shadow-md hover:bg-primary-50 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <FiBook className="w-4 h-4" />
              Explore Jargon Vault
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={index} to={stat.link} className="group">
              <div className="glass-card rounded-2xl p-5 hover-scale relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="mt-2 text-2xl font-extrabold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Courses */}
        <div className="lg:col-span-2">
          <Card title="Continue Learning Paths">
            <div className="space-y-4">
              {recentCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-4 bg-gray-50/80 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/50 rounded-xl hover:border-primary-500/40 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-base">
                        {course.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Instructor: {course.instructor}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-bold">
                      {course.progress}% Complete
                    </span>
                  </div>
                  
                  <ProgressBar value={course.progress} size="small" className="mb-3" />
                  
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">
                      Next Module: <strong className="text-gray-800 dark:text-gray-200">{course.nextLesson}</strong>
                    </span>
                    <Link
                      to={`/courses/${course.id}`}
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-bold inline-flex items-center gap-1 group"
                    >
                      <span>Resume</span>
                      <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Upcoming Assignments */}
        <div>
          <Card title="Deadlines & Quizzes">
            <div className="space-y-3">
              {upcomingAssignments.map((assignment) => (
                <Link
                  key={assignment.id}
                  to={`/assignments/${assignment.id}`}
                  className="block p-3.5 bg-gray-50/80 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/50 rounded-xl hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-2.5 mb-2">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                      <FiClock className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {assignment.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {assignment.course}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
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
              className="mt-4 text-xs font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 inline-flex items-center gap-1 group"
            >
              <span>View All Assignments</span>
              <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card title="Activity Timeline">
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-full mt-1.5 shadow-sm" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {activity.text}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
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