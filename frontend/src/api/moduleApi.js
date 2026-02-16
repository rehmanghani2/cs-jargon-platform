import axios from './axios';

const moduleApi = {
  // Get module by ID
  getModuleById: async (moduleId) => {
    const response = await axios.get(`/modules/${moduleId}`);
    return response.data;
  },

  // Get module content
  getModuleContent: async (moduleId) => {
    const response = await axios.get(`/modules/${moduleId}/content`);
    return response.data;
  },

  // Get module progress
  getModuleProgress: async (moduleId, userId) => {
    const response = await axios.get(`/modules/${moduleId}/progress/${userId}`);
    return response.data;
  },

  // Update module progress
  updateModuleProgress: async (moduleId, progressData) => {
    const response = await axios.put(`/modules/${moduleId}/progress`, progressData);
    return response.data;
  },

  // Mark module as complete
  completeModule: async (moduleId) => {
    const response = await axios.post(`/modules/${moduleId}/complete`);
    return response.data;
  },

  // Get module quiz
  getModuleQuiz: async (moduleId) => {
    const response = await axios.get(`/modules/${moduleId}/quiz`);
    return response.data;
  },

  // Submit quiz answers
  submitQuiz: async (moduleId, answers) => {
    const response = await axios.post(`/modules/${moduleId}/quiz/submit`, { answers });
    return response.data;
  },

  // Get quiz results
  getQuizResults: async (moduleId, attemptId) => {
    const response = await axios.get(`/modules/${moduleId}/quiz/results/${attemptId}`);
    return response.data;
  },

  // Create module (instructor/admin only)
  createModule: async (courseId, moduleData) => {
    const response = await axios.post(`/courses/${courseId}/modules`, moduleData);
    return response.data;
  },

  // Update module (instructor/admin only)
  updateModule: async (moduleId, moduleData) => {
    const response = await axios.put(`/modules/${moduleId}`, moduleData);
    return response.data;
  },

  // Delete module (admin only)
  deleteModule: async (moduleId) => {
    const response = await axios.delete(`/modules/${moduleId}`);
    return response.data;
  },

  // Upload module resources
  uploadModuleResource: async (moduleId, formData) => {
    const response = await axios.post(`/modules/${moduleId}/resources`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete module resource
  deleteModuleResource: async (moduleId, resourceId) => {
    const response = await axios.delete(`/modules/${moduleId}/resources/${resourceId}`);
    return response.data;
  },

  // Reorder modules
  reorderModules: async (courseId, moduleOrder) => {
    const response = await axios.put(`/courses/${courseId}/modules/reorder`, { moduleOrder });
    return response.data;
  },
};

export default moduleApi;