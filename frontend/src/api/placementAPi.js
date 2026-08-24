import axios from './axios';

const placementApi = {
  // Start placement test and get questions
  startPlacementTest: async () => {
    const response = await axios.post('/placement-test/start');
    return response.data;
  },

  // Submit single answer
  submitAnswer: async (testId, answerData) => {
    const response = await axios.put(`/placement-test/${testId}/answer`, answerData);
    return response.data;
  },

  // Submit test and finalize score/level
  submitTest: async (testId, testData) => {
    const response = await axios.post(`/placement-test/${testId}/submit`, testData);
    return response.data;
  },

  // Get test result
  getTestResult: async () => {
    const response = await axios.get('/placement-test/result');
    return response.data;
  },

  // Get test questions (admin only)
  getQuestionsAdmin: async () => {
    const response = await axios.get('/placement-test/questions');
    return response.data;
  },
};

export default placementApi;