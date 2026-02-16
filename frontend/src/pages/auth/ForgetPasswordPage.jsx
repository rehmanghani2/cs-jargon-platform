import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Email is required');
      return;
    }

    setIsLoading(true);
    const result = await forgotPassword(email);
    setIsLoading(false);

    if (result.success) {
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiCheckCircle className="w-8 h-8 text-success-600 dark:text-success-400" />
        </div>
        
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
          Check your email
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          We've sent a password reset link to <strong>{email}</strong>
        </p>

        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Didn't receive the email?{' '}
            <button
              onClick={() => setIsSuccess(false)}
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
            >
              Try again
            </button>
          </p>
          
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
          Reset your password
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<FiMail className="w-5 h-5" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          fullWidth
        />

        <Button
          type="submit"
          variant="primary"
          size="large"
          fullWidth
          loading={isLoading}
        >
          Send reset link
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;