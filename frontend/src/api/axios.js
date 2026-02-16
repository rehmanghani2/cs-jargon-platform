import axios from 'axios';
import { API_URL } from '@utils/constants';
import { tokenManager } from '@utils/helpers';
import toast from 'react-hot-toast';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // If the request contains FormData, remove Content-Type to let browser set it
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // Handle 401 Unauthorized
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh token
      const refreshToken = tokenManager.getRefreshToken();
      
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { token } = response.data;
          tokenManager.setToken(token);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Refresh token failed, logout user
          tokenManager.clearTokens();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, logout user
        tokenManager.clearTokens();
        window.location.href = '/login';
      }
    }

    // Handle 403 Forbidden
    if (status === 403) {
      toast.error('You do not have permission to perform this action.');
    }

    // Handle 404 Not Found
    if (status === 404) {
      toast.error(data?.message || 'Resource not found.');
    }

    // Handle 422 Validation Error
    if (status === 422) {
      if (data?.errors) {
        Object.values(data.errors).forEach((errorArray) => {
          if (Array.isArray(errorArray)) {
            errorArray.forEach((err) => toast.error(err));
          }
        });
      } else {
        toast.error(data?.message || 'Validation error occurred.');
      }
    }

    // Handle 500 Server Error
    if (status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;