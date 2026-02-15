import api from './axios';

export const userApi = {
  // Complete profile (introduction page)
  completeProfile: async (profileData) => {
    const response = await api.put('/users/complete-profile', profileData);
    return response.data;
  },
  
  // Get profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  
  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
  
  // Update profile picture
  updateProfilePicture: async (formData) => {
    const response = await api.put('/users/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  // Get dashboard data
  getDashboard: async () => {
    const response = await api.get('/users/dashboard');
    return response.data;
  },
  
  // Get statistics
  getStatistics: async () => {
    const response = await api.get('/users/statistics');
    return response.data;
  },
  
  // Get activity feed
  getActivityFeed: async (page = 1, limit = 20) => {
    const response = await api.get(`/users/activity?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  // Get leaderboard
  getLeaderboard: async (type = 'points', limit = 10) => {
    const response = await api.get(`/users/leaderboard?type=${type}&limit=${limit}`);
    return response.data;
  },
  
  // Update learning preferences
  updateLearningPreferences: async (preferences) => {
    const response = await api.put('/users/learning-preferences', preferences);
    return response.data;
  },
  
  // Deactivate account
  deactivateAccount: async (password) => {
    const response = await api.put('/users/deactivate', { password });
    return response.data;
  },
};

export default userApi;