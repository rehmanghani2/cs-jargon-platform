import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '@api/authApi';
import { tokenManager, userManager } from '@utils/helpers';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = tokenManager.getToken();
        const savedUser = userManager.getUser();

        if (token && savedUser) {
          // Verify token is still valid by fetching current user
          const response = await authApi.getCurrentUser();
          setUser(response.user);
          setIsAuthenticated(true);
          
          // Update saved user data
          userManager.setUser(response.user);
        } else {
          // No valid auth state
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Invalid token, clear everything
        logout(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Register new user
  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await authApi.register(userData);
      
      const { token, user: newUser } = response;
      
      // Save token and user
      tokenManager.setToken(token);
      userManager.setUser(newUser);
      
      setUser(newUser);
      setIsAuthenticated(true);
      
      toast.success('Registration successful! Welcome aboard!');
      navigate('/introduction');
      
      return { success: true, user: newUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(credentials);
      
      const { token, refreshToken, user: loggedInUser } = response;
      
      // Save tokens and user
      tokenManager.setToken(token);
      if (refreshToken) {
        tokenManager.setRefreshToken(refreshToken);
      }
      userManager.setUser(loggedInUser);
      
      setUser(loggedInUser);
      setIsAuthenticated(true);
      
      toast.success(`Welcome back, ${loggedInUser.name}! 👋`);
      
      // Redirect based on user state
      if (!loggedInUser.hasCompletedIntroduction) {
        navigate('/introduction');
      } else {
        navigate('/dashboard');
      }
      
      return { success: true, user: loggedInUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logout = async (showToast = true) => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all auth data
      tokenManager.clearTokens();
      userManager.removeUser();
      
      setUser(null);
      setIsAuthenticated(false);
      
      if (showToast) {
        toast.success('Logged out successfully');
      }
      
      navigate('/login');
    }
  };

  // Update user profile
  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    userManager.setUser(updatedUser);
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const response = await authApi.getCurrentUser();
      setUser(response.user);
      userManager.setUser(response.user);
      return response.user;
    } catch (error) {
      console.error('Error refreshing user:', error);
      return null;
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      await authApi.changePassword(passwordData);
      toast.success('Password changed successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      await authApi.forgotPassword(email);
      toast.success('Password reset link sent to your email');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset link';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    try {
      await authApi.resetPassword(token, password);
      toast.success('Password reset successfully');
      navigate('/login');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Verify email
  const verifyEmail = async (token) => {
    try {
      const response = await authApi.verifyEmail(token);
      toast.success('Email verified successfully! 🎉');
      
      if (isAuthenticated) {
        // Update current user
        updateUser({ emailVerified: true });
      }
      
      return { success: true, data: response };
    } catch (error) {
      const message = error.response?.data?.message || 'Email verification failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Resend verification email
  const resendVerification = async (email) => {
    try {
      await authApi.resendVerification(email);
      toast.success('Verification email sent');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send verification email';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // OAuth login
  const oauthLogin = async (provider, code) => {
    try {
      setIsLoading(true);
      let response;
      
      if (provider === 'google') {
        response = await authApi.googleAuth(code);
      } else if (provider === 'github') {
        response = await authApi.githubAuth(code);
      }
      
      const { token, refreshToken, user: oauthUser } = response;
      
      // Save tokens and user
      tokenManager.setToken(token);
      if (refreshToken) {
        tokenManager.setRefreshToken(refreshToken);
      }
      userManager.setUser(oauthUser);
      
      setUser(oauthUser);
      setIsAuthenticated(true);
      
      toast.success(`Welcome, ${oauthUser.name}! 👋`);
      navigate('/dashboard');
      
      return { success: true, user: oauthUser };
    } catch (error) {
      const message = error.response?.data?.message || 'OAuth login failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    register,
    login,
    logout,
    updateUser,
    refreshUser,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    oauthLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;