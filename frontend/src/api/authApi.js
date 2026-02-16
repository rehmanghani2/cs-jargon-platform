import axios from './axios';

const authApi = {
  // Register new user
  register: async (userData) => {
    const response = await axios.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await axios.post('/auth/login', credentials);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await axios.post('/auth/logout');
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await axios.get('/auth/me');
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await axios.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await axios.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await axios.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await axios.post('/auth/change-password', passwordData);
    return response.data;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await axios.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  // Resend verification email
  resendVerification: async (email) => {
    const response = await axios.post('/auth/resend-verification', { email });
    return response.data;
  },

  // OAuth - Google
  googleAuth: async (code) => {
    const response = await axios.post('/auth/google', { code });
    return response.data;
  },

  // OAuth - GitHub
  githubAuth: async (code) => {
    const response = await axios.post('/auth/github', { code });
    return response.data;
  },
};

export default authApi;