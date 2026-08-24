import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiBook,
  FiFileText,
  FiAward,
  FiTrendingUp,
  FiActivity,
  FiCalendar,
  FiAlertCircle,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import StatsCard from '@components/dashboard/StatsCard';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import { formatDate, formatTimeAgo } from '@utils/formatters';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalAssignments: 0,
    pendingSubmissions: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    // Mock data - replace with actual API calls
    setStats({
      totalUsers: 1245,
      totalCourses: 48,
      totalAssignments: 286,
      pendingSubmissions: 52,
      activeUsers: 892,
      newUsersThisMonth: 127,
    });

    setRecentActivities([
      {
        id: 1,
        type: 'user_registration',
        message: 'New user registered: John Doe',
        timestamp: new Date(Date.now() - 5 * 60000),
      },
      {
        id: 2,
        type: 'course_created',
        message: 'New course created: Advanced React Patterns',
        timestamp: new Date(Date.now() - 15 * 60000),
      },
      {
        id: 3,
        type: 'assignment_submitted',
        message: '15 new assignment submissions',
        timestamp: new Date(Date.now() - 30 * 60000),
      },
    ]);

    setSystemAlerts([
      {
        id: 1,
        severity: 'warning',
        message: 'Database backup scheduled for tonight at 2 AM',
        timestamp: new Date(),
      },
      {
        id: 2,
        severity: 'info',
        message: '52 assignments pending review',
        timestamp: new Date(Date.now() - 60 * 60000),
      },
    ]);
  };

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'View and manage user accounts',
      icon: FiUsers,
      path: '/admin/users',
      color: 'blue',
    },
    {
      title: 'Manage Courses',
      description: 'Create and edit courses',
      icon: FiBook,
      path: '/admin/courses',
      color: 'purple',
    },
    {
      title: 'Review Assignments',
      description: 'Grade pending submissions',
      icon: FiFileText,
      path: '/admin/assignments',
      color: 'orange',
    },
    {
      title: 'Certificates',
      description: 'Manage certificates',
      icon: FiAward,
      path: '/admin/certificates',
      color: 'green',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Overview of platform statistics and recent activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={FiUsers}
          trend="up"
          trendValue={`+${stats.newUsersThisMonth} this month`}
          color="blue"
        />
        <StatsCard
          title="Active Users"
          value={stats.activeUsers.toLocaleString()}
          icon={FiActivity}
          description="Last 30 days"
          color="green"
        />
        <StatsCard
          title="Total Courses"
          value={stats.totalCourses}
          icon={FiBook}
          color="purple"
        />
        <StatsCard
          title="Total Assignments"
          value={stats.totalAssignments}
          icon={FiFileText}
          color="orange"
        />
        <StatsCard
          title="Pending Reviews"
          value={stats.pendingSubmissions}
          icon={FiAlertCircle}
          trend="neutral"
          color="pink"
          onClick={() => navigate('/admin/assignments')}
        />
        <StatsCard
          title="New Users"
          value={stats.newUsersThisMonth}
          icon={FiTrendingUp}
          description="This month"
          color="indigo"
        />
      </div>

      {/* System Alerts */}
      {systemAlerts.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FiAlertCircle className="w-5 h-5 mr-2 text-orange-500" />
            System Alerts
          </h2>
          <div className="space-y-3">
            {systemAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${
                  alert.severity === 'warning'
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <FiAlertCircle
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      alert.severity === 'warning'
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-blue-600 dark:text-blue-400'
                    }`}
                  />
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        alert.severity === 'warning'
                          ? 'text-yellow-900 dark:text-yellow-100'
                          : 'text-blue-900 dark:text-blue-100'
                      }`}
                    >
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {formatTimeAgo(alert.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate(action.path)}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-left"
                >
                  <div className={`inline-flex p-2 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/30 mb-3`}>
                    <Icon className={`w-5 h-5 text-${action.color}-600 dark:text-${action.color}-400`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <Button variant="ghost" size="small">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;