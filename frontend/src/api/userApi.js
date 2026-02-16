import axios from './axios';

const userApi = {
  // Get user profile
  getProfile: async (userId) => {
    const response = await axios.get(`/users/${userId}`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (userId, userData) => {
    const response = await axios.put(`/users/${userId}`, userData);
    return response.data;
  },

  // Upload profile picture
  uploadProfilePicture: async (userId, formData) => {
    const response = await axios.post(`/users/${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete profile picture
  deleteProfilePicture: async (userId) => {
    const response = await axios.delete(`/users/${userId}/avatar`);
    return response.data;
  },

  // Get user stats
  getUserStats: async (userId) => {
    const response = await axios.get(`/users/${userId}/stats`);
    return response.data;
  },

  // Get user badges
  getUserBadges: async (userId) => {
    const response = await axios.get(`/users/${userId}/badges`);
    return response.data;
  },

  // Get user certificates
  getUserCertificates: async (userId) => {
    const response = await axios.get(`/users/${userId}/certificates`);
    return response.data;
  },

  // Get user activity
  getUserActivity: async (userId, params) => {
    const response = await axios.get(`/users/${userId}/activity`, { params });
    return response.data;
  },

  // Get user streak
  getUserStreak: async (userId) => {
    const response = await axios.get(`/users/${userId}/streak`);
    return response.data;
  },

  // Update user preferences
  updatePreferences: async (userId, preferences) => {
    const response = await axios.put(`/users/${userId}/preferences`, preferences);
    return response.data;
  },

  // Get leaderboard
  getLeaderboard: async (params) => {
    const response = await axios.get('/users/leaderboard', { params });
    return response.data;
  },

  // Search users
  searchUsers: async (query) => {
    const response = await axios.get('/users/search', {
      params: { q: query },
    });
    return response.data;
  },

  // Get all users (admin only)
  getAllUsers: async (params) => {
    const response = await axios.get('/users', { params });
    return response.data;
  },

  // Delete user (admin only)
  deleteUser: async (userId) => {
    const response = await axios.delete(`/users/${userId}`);
    return response.data;
  },
};

export default userApi;