import axios from './axios';

const userApi = {
  // Get current user profile
  getProfile: async () => {
    const response = await axios.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await axios.put('/users/profile', userData);
    return response.data;
  },

  // Complete profile (introduction page)
  completeProfile: async (profileData) => {
    const response = await axios.put('/users/complete-profile', profileData);
    return response.data;
  },

  // Upload profile picture
  uploadProfilePicture: async (formData) => {
    const response = await axios.put('/users/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update learning preferences
  updateLearningPreferences: async (preferences) => {
    const response = await axios.put('/users/learning-preferences', preferences);
    return response.data;
  },

  // Get user dashboard data
  getDashboard: async () => {
    const response = await axios.get('/users/dashboard');
    return response.data;
  },

  // Get user stats
  getUserStats: async () => {
    const response = await axios.get('/users/statistics');
    return response.data;
  },

  // Get user activity
  getUserActivity: async () => {
    const response = await axios.get('/users/activity');
    return response.data;
  },

  // Get leaderboard
  getLeaderboard: async () => {
    const response = await axios.get('/users/leaderboard');
    return response.data;
  },

  // Deactivate account
  deactivateAccount: async () => {
    const response = await axios.put('/users/deactivate');
    return response.data;
  },
};

export default userApi;