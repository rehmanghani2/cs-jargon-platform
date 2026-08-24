import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiMail, FiLoader } from 'react-icons/fi';
import { useAuth } from '@hooks/useAuth';
import Button from '@components/common/Button';
import Loader from '@components/common/Loader';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail, resendVerification } = useAuth();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      handleVerification();
    } else {
      setStatus('error');
      setMessage('Invalid verification link. Please check your email for the correct link.');
    }
  }, [token]);

  const handleVerification = async () => {
    try {
      setStatus('verifying');
      await verifyEmail(token);
      setStatus('success');
      setMessage('Your email has been successfully verified! You can now access all features.');
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setMessage(
        error.response?.data?.message ||
        'Failed to verify email. The link may have expired or is invalid.'
      );
    }
  };

  const handleResendVerification = async () => {
    try {
      setIsResending(true);
      await resendVerification();
      setMessage('A new verification email has been sent. Please check your inbox.');
      setStatus('success');
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        'Failed to resend verification email. Please try again later.'
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          {/* Verifying State */}
          {status === 'verifying' && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
                <FiLoader className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Verifying Your Email
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we verify your email address...
              </p>
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
                Email Verified!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {message}
              </p>
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
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
                Verification Failed
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleResendVerification}
                  loading={isResending}
                  leftIcon={<FiMail />}
                >
                  Resend Verification Email
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => navigate('/login')}
                >
                  Back to Login
                </Button>
              </div>
            </motion.div>
          )}

          {/* Help Text */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Having trouble?{' '}
              <a
                href="/support"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;