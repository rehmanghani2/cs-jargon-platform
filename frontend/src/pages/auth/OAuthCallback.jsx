import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLoader, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useAuth } from '@hooks/useAuth';
import Loader from '@components/common/Loader';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { oauthLogin, user } = useAuth();
  
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  const [message, setMessage] = useState('');
  
  const code = searchParams.get('code');
  const provider = searchParams.get('provider') || 'google';
  const error = searchParams.get('error');

  useEffect(() => {
    if (error) {
      setStatus('error');
      setMessage(`Authentication failed: ${error}`);
      return;
    }

    if (code) {
      handleOAuthCallback();
    } else {
      setStatus('error');
      setMessage('Invalid authentication response. Please try again.');
    }
  }, [code, error]);

  const handleOAuthCallback = async () => {
    try {
      setStatus('processing');
      await oauthLogin(provider, code);
      setStatus('success');
      setMessage('Authentication successful! Redirecting...');
      
      // Redirect based on user status
      setTimeout(() => {
        if (user?.hasCompletedIntroduction) {
          navigate('/dashboard');
        } else {
          navigate('/introduction');
        }
      }, 2000);
    } catch (error) {
      setStatus('error');
      setMessage(
        error.response?.data?.message ||
        'Failed to authenticate. Please try again.'
      );
    }
  };

  const getProviderIcon = () => {
    switch (provider) {
      case 'google':
        return <FaGoogle className="w-8 h-8" />;
      case 'github':
        return <FaGithub className="w-8 h-8" />;
      default:
        return null;
    }
  };

  const getProviderName = () => {
    return provider.charAt(0).toUpperCase() + provider.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          {/* Processing State */}
          {status === 'processing' && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
                <div className="text-blue-600 dark:text-blue-400">
                  {getProviderIcon()}
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Authenticating with {getProviderName()}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Please wait while we complete your sign in...
              </p>
              <Loader />
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
                <FiCheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Sign In Successful!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {message}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <FiLoader className="w-4 h-4 animate-spin" />
                <span>Redirecting...</span>
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
                <FiAlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Authentication Failed
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Back to Login
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              By signing in, you agree to our{' '}
              <a href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OAuthCallback;