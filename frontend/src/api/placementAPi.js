import axios from './axios';

const placementApi = {
  // Get placement test
  getPlacementTest: async () => {
    const response = await axios.get('/placement-test');
    return response.data;
  },

  // Start placement test
  startPlacementTest: async () => {
    const response = await axios.post('/placement-test/start');
    return response.data;
  },

  // Get test questions
  getTestQuestions: async (testId) => {
    const response = await axios.get(`/placement-test/${testId}/questions`);
    return response.data;
  },

  // Submit answer
  submitAnswer: async (testId, questionId, answer) => {
    const response = await axios.post(`/placement-test/${testId}/answer`, {
      questionId,
      answer,
    });
    return response.data;
  },

  // Submit test
  submitTest: async (testId, answers) => {
    const response = await axios.post(`/placement-test/${testId}/submit`, { answers });
    return response.data;
  },

  // Get test result
  getTestResult: async (testId) => {
    const response = await axios.get(`/placement-test/${testId}/result`);
    return response.data;
  },

  // Get user test history
  getTestHistory: async (userId) => {
    const response = await axios.get(`/users/${userId}/placement-tests`);
    return response.data;
  },

  // Get test analytics
  getTestAnalytics: async (testId) => {
    const response = await axios.get(`/placement-test/${testId}/analytics`);
    return response.data;
  },

  // Retake test
  retakeTest: async () => {
    const response = await axios.post('/placement-test/retake');
    return response.data;
  },

  // Get recommended level
  getRecommendedLevel: async (userId) => {
    const response = await axios.get(`/users/${userId}/recommended-level`);
    return response.data;
  },

  // Create placement test (admin only)
  createPlacementTest: async (testData) => {
    const response = await axios.post('/placement-test', testData);
    return response.data;
  },

  // Update placement test (admin only)
  updatePlacementTest: async (testId, testData) => {
    const response = await axios.put(`/placement-test/${testId}`, testData);
    return response.data;
  },

  // Delete placement test (admin only)
  deletePlacementTest: async (testId) => {
    const response = await axios.delete(`/placement-test/${testId}`);
    return response.data;
  },

  // Add question (admin only)
  addQuestion: async (questionData) => {
    const response = await axios.post('/placement-test/questions', questionData);
    return response.data;
  },

  // Update question (admin only)
  updateQuestion: async (questionId, questionData) => {
    const response = await axios.put(`/placement-test/questions/${questionId}`, questionData);
    return response.data;
  },

  // Delete question (admin only)
  deleteQuestion: async (questionId) => {
    const response = await axios.delete(`/placement-test/questions/${questionId}`);
    return response.data;
  },

  // Get all questions (admin only)
  getAllQuestions: async (params) => {
    const response = await axios.get('/placement-test/questions', { params });
    return response.data;
  },

  // Get question statistics (admin only)
  getQuestionStats: async (questionId) => {
    const response = await axios.get(`/placement-test/questions/${questionId}/stats`);
    return response.data;
  },
};

export default placementApi;