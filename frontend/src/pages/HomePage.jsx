import { Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { 
  FiCode, 
  FiBook, 
  FiAward, 
  FiTrendingUp,
  FiUsers,
  FiZap
} from 'react-icons/fi';

function HomePage() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: FiCode,
      title: 'Master CS Terminology',
      description: 'Learn essential computer science jargon with interactive flashcards and quizzes.',
    },
    {
      icon: FiBook,
      title: 'Structured Courses',
      description: 'Follow curated learning paths designed by industry experts.',
    },
    {
      icon: FiAward,
      title: 'Earn Certificates',
      description: 'Get recognized for your achievements with verified certificates.',
    },
    {
      icon: FiTrendingUp,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed analytics and insights.',
    },
    {
      icon: FiUsers,
      title: 'Community Learning',
      description: 'Connect with peers and instructors in a collaborative environment.',
    },
    {
      icon: FiZap,
      title: 'Daily Streaks',
      description: 'Build consistent learning habits with streak tracking and rewards.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="container-custom py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiCode className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-display font-bold text-gray-900 dark:text-white">
              CS Jargon
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container-custom py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-display font-bold text-gray-900 dark:text-white mb-6">
          Master Computer Science
          <span className="block text-gradient">One Jargon at a Time</span>
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
          Learn essential CS terminology, track your progress, and earn certificates 
          in an engaging, gamified learning platform.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {!isAuthenticated && (
            <>
              <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
                Start Learning Free
              </Link>
              <Link to="/placement-test" className="btn btn-outline text-lg px-8 py-3">
                Take Placement Test
              </Link>
            </>
          )}
          {isAuthenticated && (
            <Link to="/dashboard" className="btn btn-primary text-lg px-8 py-3">
              Continue Learning
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="container-custom py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our platform provides comprehensive tools and resources to help you master computer science.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="card hover-scale transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-600 dark:bg-primary-700 py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-primary-100">CS Terms</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1,000+</div>
              <div className="text-primary-100">Active Learners</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-primary-100">Courses</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="container-custom py-20 text-center">
          <div className="max-w-3xl mx-auto card bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of students mastering computer science terminology.
            </p>
            <Link to="/register" className="btn btn-primary text-lg px-8 py-3 inline-block">
              Create Free Account
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container-custom text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FiCode className="w-6 h-6 text-primary-400" />
            <span className="text-xl font-display font-bold text-white">
              CS Jargon Platform
            </span>
          </div>
          <p className="mb-4">
            Master Computer Science Terminology © {new Date().getFullYear()}
          </p>
          <div className="flex items-center justify-center gap-6">
            <Link to="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;