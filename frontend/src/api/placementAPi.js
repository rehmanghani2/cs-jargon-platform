import api from './axios';

export const placementApi = {
  // Start placement test
  startTest: async () => {
    const response = await api.post('/placement-test/start');
    return response.data;
  },
  
  // Submit answer
  submitAnswer: async (testId, questionIndex, answer, timeSpent) => {
    const response = await api.put(`/placement-test/${testId}/answer`, {
      questionIndex,
      answer,
      timeSpent,
    });
    return response.data;
  },
  
  // Submit test
  submitTest: async (testId, answers, totalTimeSpent) => {
    const response = await api.post(`/placement-test/${testId}/submit`, {
      answers,
      totalTimeSpent,
    });
    return response.data;
  },
  
  // Get result
  getResult: async () => {
    const response = await api.get('/placement-test/result');
    return response.data;
  },
};

export default placementApi;