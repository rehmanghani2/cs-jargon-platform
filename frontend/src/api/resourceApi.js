import axios from './axios';

const resourceApi = {
  // Get all resources
  getAllResources: async (params) => {
    const response = await axios.get('/resources', { params });
    return response.data;
  },

  // Get resource by ID
  getResourceById: async (resourceId) => {
    const response = await axios.get(`/resources/${resourceId}`);
    return response.data;
  },

  // Search resources
  searchResources: async (query, filters) => {
    const response = await axios.get('/resources/search', {
      params: { q: query, ...filters },
    });
    return response.data;
  },

  // Get resources by type
  getResourcesByType: async (type, params) => {
    const response = await axios.get(`/resources/type/${type}`, { params });
    return response.data;
  },

  // Get resources by category
  getResourcesByCategory: async (category, params) => {
    const response = await axios.get(`/resources/category/${category}`, { params });
    return response.data;
  },

  // Get featured resources
  getFeaturedResources: async (limit = 6) => {
    const response = await axios.get('/resources/featured', {
      params: { limit },
    });
    return response.data;
  },

  // Get recommended resources
  getRecommendedResources: async (userId) => {
    const response = await axios.get(`/resources/recommended/${userId}`);
    return response.data;
  },

  // Get popular resources
  getPopularResources: async (limit = 10) => {
    const response = await axios.get('/resources/popular', {
      params: { limit },
    });
    return response.data;
  },

  // Get related resources
  getRelatedResources: async (resourceId) => {
    const response = await axios.get(`/resources/${resourceId}/related`);
    return response.data;
  },

  // Bookmark resource
  bookmarkResource: async (resourceId) => {
    const response = await axios.post(`/resources/${resourceId}/bookmark`);
    return response.data;
  },

  // Remove bookmark
  removeBookmark: async (resourceId) => {
    const response = await axios.delete(`/resources/${resourceId}/bookmark`);
    return response.data;
  },

  // Get user bookmarks
  getUserBookmarks: async (userId, params) => {
    const response = await axios.get(`/users/${userId}/bookmarks`, { params });
    return response.data;
  },

  // Rate resource
  rateResource: async (resourceId, rating) => {
    const response = await axios.post(`/resources/${resourceId}/rate`, { rating });
    return response.data;
  },

  // Track resource view
  trackView: async (resourceId) => {
    const response = await axios.post(`/resources/${resourceId}/view`);
    return response.data;
  },

  // Download resource
  downloadResource: async (resourceId) => {
    const response = await axios.get(`/resources/${resourceId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get learning pathways
  getLearningPathways: async (params) => {
    const response = await axios.get('/resources/pathways', { params });
    return response.data;
  },

  // Get pathway by ID
  getPathwayById: async (pathwayId) => {
    const response = await axios.get(`/resources/pathways/${pathwayId}`);
    return response.data;
  },

  // Enroll in pathway
  enrollInPathway: async (pathwayId) => {
    const response = await axios.post(`/resources/pathways/${pathwayId}/enroll`);
    return response.data;
  },

  // Get pathway progress
  getPathwayProgress: async (pathwayId, userId) => {
    const response = await axios.get(`/resources/pathways/${pathwayId}/progress/${userId}`);
    return response.data;
  },

  // Update pathway progress
  updatePathwayProgress: async (pathwayId, stepId) => {
    const response = await axios.put(`/resources/pathways/${pathwayId}/progress`, { stepId });
    return response.data;
  },

  // Create resource (admin only)
  createResource: async (resourceData) => {
    const response = await axios.post('/resources', resourceData);
    return response.data;
  },

  // Update resource (admin only)
  updateResource: async (resourceId, resourceData) => {
    const response = await axios.put(`/resources/${resourceId}`, resourceData);
    return response.data;
  },

  // Delete resource (admin only)
  deleteResource: async (resourceId) => {
    const response = await axios.delete(`/resources/${resourceId}`);
    return response.data;
  },

  // Upload resource file (admin only)
  uploadResourceFile: async (formData) => {
    const response = await axios.post('/resources/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Create pathway (admin only)
  createPathway: async (pathwayData) => {
    const response = await axios.post('/resources/pathways', pathwayData);
    return response.data;
  },

  // Update pathway (admin only)
  updatePathway: async (pathwayId, pathwayData) => {
    const response = await axios.put(`/resources/pathways/${pathwayId}`, pathwayData);
    return response.data;
  },

  // Delete pathway (admin only)
  deletePathway: async (pathwayId) => {
    const response = await axios.delete(`/resources/pathways/${pathwayId}`);
    return response.data;
  },

  // Get resource analytics
  getResourceAnalytics: async (resourceId) => {
    const response = await axios.get(`/resources/${resourceId}/analytics`);
    return response.data;
  },

  // Get resource categories
  getCategories: async () => {
    const response = await axios.get('/resources/categories');
    return response.data;
  },

  // Report broken link
  reportBrokenLink: async (resourceId, details) => {
    const response = await axios.post(`/resources/${resourceId}/report`, details);
    return response.data;
  },
};

export default resourceApi;