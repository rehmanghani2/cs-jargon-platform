import { Outlet, Link } from 'react-router-dom';
import { useTheme } from '@hooks/useTheme';
import { FiCode, FiSun, FiMoon } from 'react-icons/fi';

function AuthLayout() {
  const { toggleTheme, isDark } = useTheme();

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Left side - Auth form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <FiCode className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-display font-bold text-gray-900 dark:text-white">
              CS Jargon
            </span>
          </div>

          {/* Theme toggle */}
          <div className="absolute top-4 right-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              title="Toggle theme"
            >
              {isDark ? (
                <FiSun className="w-5 h-5" />
              ) : (
                <FiMoon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Auth content */}
          <Outlet />

          {/* Back to home */}
          <div className="mt-8 text-center">
            <Link
              to="/"
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Hero image/content */}
      <div className="hidden lg:block relative flex-1 bg-gradient-to-br from-primary-600 to-purple-600">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-md text-white">
            <h2 className="text-4xl font-display font-bold mb-6">
              Master CS Terminology
            </h2>
            <p className="text-lg text-primary-100 mb-8">
              Learn essential computer science jargon with interactive flashcards, 
              quizzes, and gamified learning experience.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Structured Learning</h3>
                  <p className="text-sm text-primary-100">
                    Follow curated learning paths designed by experts
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Track Progress</h3>
                  <p className="text-sm text-primary-100">
                    Monitor your learning journey with detailed analytics
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Earn Certificates</h3>
                  <p className="text-sm text-primary-100">
                    Get recognized for your achievements
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}

export default AuthLayout;