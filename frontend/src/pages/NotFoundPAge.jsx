import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-400">
            404
          </h1>
          <div className="mt-4">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="btn btn-primary flex items-center gap-2"
          >
            <FiHome className="w-4 h-4" />
            Go Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn btn-secondary flex items-center gap-2"
          >
            <FiArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        <div className="mt-12">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Quick Links:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link
              to="/dashboard"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              Dashboard
            </Link>
            <Link
              to="/courses"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              Courses
            </Link>
            <Link
              to="/jargon"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              Jargon Library
            </Link>
            <Link
              to="/assignments"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              Assignments
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;