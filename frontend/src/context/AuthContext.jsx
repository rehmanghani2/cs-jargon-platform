import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { authApi } from '@/api/authApi';
import { userApi } from '@/api/userApi';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = Cookies.get('token') || localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await authApi.getMe();
          setUser(response.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to load user:', error);
          clearAuth();
        }
      }
      
      setIsLoading(false);
    };

    loadUser();
  }, []);

  // Clear auth data
  const clearAuth = useCallback(() => {
    Cookies.remove('token');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Login
  const login = useCallback(async (credentials) => {
    const response = await authApi.login(credentials);
    
    if (response.success) {
      const { token, data } = response;
      
      // Store token
      Cookies.set('token', token, { expires: 30 });
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      setIsAuthenticated(true);
      
      return data.user;
    }
    
    throw new Error(response.message);
  }, []);

  // Register
  const register = useCallback(async (formData) => {
    const response = await authApi.register(formData);
    return response;
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  // Update user data
  const updateUser = useCallback((userData) => {
    setUser(prev => ({ ...prev, ...userData }));
    localStorage.setItem('user', JSON.stringify({ ...user, ...userData }));
  }, [user]);

  // Refresh user data from server
  const refreshUser = useCallback(async () => {
    try {
      const response = await authApi.getMe();
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
    } catch (error) {
      console.error('Failed to refresh user:', error);
      throw error;
    }
  }, []);

  // Check if profile is complete
  const isProfileComplete = user?.isProfileComplete ?? false;

  // Check if placement test is completed
  const hasCompletedPlacement = user?.placementTestCompleted ?? false;

  // Get user's assigned level
  const assignedLevel = user?.assignedLevel ?? null;

  const value = {
    user,
    isLoading,
    isAuthenticated,
    isProfileComplete,
    hasCompletedPlacement,
    assignedLevel,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    clearAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;