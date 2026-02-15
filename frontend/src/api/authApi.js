import api from './axios';

export const authApi = {
  // Register
  register: async (formData) => {
    const response = await api.post('/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  // Verify email
  verifyEmail: async (token) => {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },
  
  // Resend verification
  resendVerification: async (email) => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },
  
  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  
  // Reset password
  resetPassword: async (token, passwords) => {
    const response = await api.put(`/auth/reset-password/${token}`, passwords);
    return response.data;
  },
  
  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  // Update password
  updatePassword: async (passwords) => {
    const response = await api.put('/auth/update-password', passwords);
    return response.data;
  },
  
  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  // Check email
  checkEmail: async (email) => {
    const response = await api.post('/auth/check-email', { email });
    return response.data;
  },
  
  // Google OAuth URL
  getGoogleAuthUrl: () => {
    return `${import.meta.env.VITE_API_URL}/auth/google`;
  },
};

export default authApi;