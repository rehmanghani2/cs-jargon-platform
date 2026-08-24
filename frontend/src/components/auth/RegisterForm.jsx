import { useState } from 'react';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import { validateForm } from '@utils/validators';
import { eventNames } from '../../../../backend/models/User';

const RegisterForm = ({ onSubmit, isLoading = false, onOAuthRegister }) => {
  const [formData, setFormData] = useState({
    // name: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRequirements = [
    { label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
    { label: 'One uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
    { label: 'One lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
    { label: 'One number', test: (pwd) => /[0-9]/.test(pwd) },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [eventNames]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationRules = {
      fullName: { required: true, minLength: 2 },
      email: { required: true, email: true },
      password: { required: true, minLength: 8, password: true },
      confirmPassword: { required: true },
    };

    console.log("formData : ",formData)

    const validationErrors = validateForm(formData, validationRules);

    console.log("Validation Errors: ", validationErrors)

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    // Check if terms are agreed
    if (!formData.agreeToTerms) {
      validationErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);
  };

  const handleOAuthClick = (provider) => {
    if (onOAuthRegister) {
      onOAuthRegister(provider);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create Account
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Start your learning journey today
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Input */}
        <Input
          label="Full Name"
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.name}
          leftIcon={<FiUser />}
          placeholder="John Doe"
          autoComplete="name"
          required
        />

        {/* Email Input */}
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          leftIcon={<FiMail />}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        {/* Password Input */}
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          leftIcon={<FiLock />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          }
          placeholder="Create a strong password"
          autoComplete="new-password"
          required
        />

        {/* Password Requirements */}
        {formData.password && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-1">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password must have:
            </p>
            {passwordRequirements.map((req, index) => {
              const isPassed = req.test(formData.password);
              return (
                <div
                  key={index}
                  className={`flex items-center text-xs ${
                    isPassed
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <FiCheck
                    className={`w-3 h-3 mr-2 ${
                      isPassed ? 'opacity-100' : 'opacity-30'
                    }`}
                  />
                  {req.label}
                </div>
              );
            })}
          </div>
        )}

        {/* Confirm Password Input */}
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          leftIcon={<FiLock />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          }
          placeholder="Confirm your password"
          autoComplete="new-password"
          required
        />

        {/* Terms and Conditions */}
        <div>
          <label className="flex items-start">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              I agree to the{' '}
              <Link
                to="/terms"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                target="_blank"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                to="/privacy"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                target="_blank"
              >
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.agreeToTerms && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.agreeToTerms}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="large"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
              Or sign up with
            </span>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOAuthClick('google')}
            disabled={isLoading}
            leftIcon={<FaGoogle />}
          >
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOAuthClick('github')}
            disabled={isLoading}
            leftIcon={<FaGithub />}
          >
            GitHub
          </Button>
        </div>

        {/* Sign In Link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

RegisterForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  onOAuthRegister: PropTypes.func,
};

export default RegisterForm;