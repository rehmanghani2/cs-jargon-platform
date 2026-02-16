import { useState } from 'react';
import { useAuth } from '@hooks/useAuth';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import Avatar from '@components/common/Avatar';
import Badge from '@components/common/Badge';
import Tabs from '@components/common/Tabs';
import ProgressBar from '@components/common/ProgressBar';
import { 
  FiEdit2, 
  FiMail, 
  FiCalendar, 
  FiMapPin,
  FiGithub,
  FiLinkedin,
  FiAward,
  FiTrendingUp,
  FiBook
} from 'react-icons/fi';

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    github: user?.github || '',
    linkedin: user?.linkedin || '',
  });

  const handleSave = async () => {
    await updateUser(formData);
    setIsEditing(false);
  };

  // Mock data
  const stats = {
    courses: 5,
    completed: 3,
    assignments: 12,
    streak: 7,
  };

  const badges = [
    { name: '5-Day Streak', icon: '🔥', earned: '2 days ago' },
    { name: 'First Course', icon: '📚', earned: '1 week ago' },
    { name: 'Quick Learner', icon: '⚡', earned: '2 weeks ago' },
    { name: 'Top Scorer', icon: '🏆', earned: '3 weeks ago' },
  ];

  const skills = [
    { name: 'Data Structures', level: 75 },
    { name: 'Algorithms', level: 60 },
    { name: 'Web Development', level: 85 },
    { name: 'Database', level: 70 },
  ];

  const recentCourses = [
    { name: 'Data Structures & Algorithms', progress: 75, grade: 'A' },
    { name: 'Web Development', progress: 45, grade: 'B+' },
    { name: 'Database Systems', progress: 60, grade: 'A-' },
  ];

  const overviewTab = (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <FiBook className="w-8 h-8 mx-auto mb-2 text-primary-600" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.courses}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Courses</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <FiAward className="w-8 h-8 mx-auto mb-2 text-success-600" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <FiEdit2 className="w-8 h-8 mx-auto mb-2 text-warning-600" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.assignments}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Assignments</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <FiTrendingUp className="w-8 h-8 mx-auto mb-2 text-danger-600" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.streak}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
          </div>
        </Card>
      </div>

      {/* Skills */}
      <Card title="Skills">
        <div className="space-y-4">
          {skills.map((skill, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {skill.name}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {skill.level}%
                </span>
              </div>
              <ProgressBar value={skill.level} size="small" />
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Courses */}
      <Card title="Recent Courses">
        <div className="space-y-3">
          {recentCourses.map((course, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
            >
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {course.name}
                </h4>
                <ProgressBar value={course.progress} size="small" className="mt-2" />
              </div>
              <Badge variant="success">{course.grade}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const badgesTab = (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {badges.map((badge, index) => (
        <Card key={index} hover>
          <div className="text-center">
            <div className="text-4xl mb-3">{badge.icon}</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              {badge.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Earned {badge.earned}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );

  const settingsTab = (
    <div className="space-y-6">
      <Card title="Personal Information">
        {isEditing ? (
          <div className="space-y-4">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              leftIcon={<FiMapPin />}
              fullWidth
            />
            <Input
              label="GitHub"
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              leftIcon={<FiGithub />}
              fullWidth
            />
            <Input
              label="LinkedIn"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              leftIcon={<FiLinkedin />}
              fullWidth
            />
            <div className="flex gap-3">
              <Button onClick={handleSave}>Save Changes</Button>
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                <p className="text-gray-900 dark:text-white">{user?.name}</p>
              </div>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <FiEdit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Bio</p>
              <p className="text-gray-900 dark:text-white">{user?.bio || 'No bio yet'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
              <p className="text-gray-900 dark:text-white">{user?.location || 'Not set'}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar
            src={user?.avatar}
            name={user?.name}
            size="xlarge"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user?.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {user?.email}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <FiCalendar className="w-4 h-4" />
                <span>Joined January 2024</span>
              </div>
              {user?.location && (
                <div className="flex items-center gap-1">
                  <FiMapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs
        tabs={[
          { label: 'Overview', content: overviewTab },
          { label: 'Badges', content: badgesTab, badge: badges.length },
          { label: 'Settings', content: settingsTab },
        ]}
      />
    </div>
  );
}

export default ProfilePage;