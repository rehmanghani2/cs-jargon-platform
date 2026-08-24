import { motion } from 'framer-motion';
import { FiTarget, FiHeart, FiUsers, FiTrendingUp, FiAward, FiBook } from 'react-icons/fi';
import Button from '@components/common/Button';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: FiTarget,
      title: 'Quality Education',
      description: 'We believe in providing high-quality, accessible education for everyone.',
    },
    {
      icon: FiHeart,
      title: 'Student-Centered',
      description: 'Our platform is designed with students\' success and growth in mind.',
    },
    {
      icon: FiUsers,
      title: 'Community',
      description: 'We foster a supportive learning community where everyone can thrive.',
    },
    {
      icon: FiTrendingUp,
      title: 'Continuous Improvement',
      description: 'We constantly evolve to meet the changing needs of modern learners.',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Active Students' },
    { value: '500+', label: 'Courses' },
    { value: '100+', label: 'Expert Instructors' },
    { value: '95%', label: 'Satisfaction Rate' },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      image: null,
      bio: 'Passionate educator with 15+ years of experience in online learning.',
    },
    {
      name: 'Michael Chen',
      role: 'Head of Technology',
      image: null,
      bio: 'Software architect specializing in educational technology platforms.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Director of Education',
      image: null,
      bio: 'Curriculum designer focused on creating engaging learning experiences.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold mb-4">About CS Jargon Platform</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Empowering learners worldwide with accessible, high-quality computer science
              education
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            At CS Jargon Platform, we're on a mission to democratize computer science education.
            We believe that everyone should have access to quality learning resources, regardless
            of their background or location.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Our platform combines cutting-edge technology with expert instruction to create an
            engaging, effective learning experience that prepares students for success in the
            tech industry.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {member.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 mb-3">{member.role}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Join Our Learning Community</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start your journey to becoming a skilled developer with our comprehensive courses
            and supportive community.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="secondary"
              size="large"
              onClick={() => navigate('/register')}
            >
              Get Started Free
            </Button>
            <Button
              variant="outline"
              size="large"
              onClick={() => navigate('/courses')}
              className="bg-white/10 hover:bg-white/20 border-white text-white"
            >
              Browse Courses
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;