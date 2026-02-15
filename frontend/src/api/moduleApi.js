import api from './axios';

export const moduleApi = {
  // Get module
  getModule: async (moduleId) => {
    const response = await api.get(`/modules/${moduleId}`);
    return response.data;
  },
  
  // Get lesson
  getLesson: async (moduleId, lessonIndex) => {
    const response = await api.get(`/modules/${moduleId}/lessons/${lessonIndex}`);
    return response.data;
  },
  
  // Complete lesson
  completeLesson: async (moduleId, lessonIndex, timeSpent) => {
    const response = await api.post(`/modules/${moduleId}/lessons/${lessonIndex}/complete`, {
      timeSpent,
    });
    return response.data;
  },
  
  // Get quiz
  getQuiz: async (moduleId) => {
    const response = await api.get(`/modules/${moduleId}/quiz`);
    return response.data;
  },
  
  // Submit quiz
  submitQuiz: async (moduleId, answers, timeSpent) => {
    const response = await api.post(`/modules/${moduleId}/quiz/submit`, {
      answers,
      timeSpent,
    });
    return response.data;
  },
  
  // Get quiz results
  getQuizResults: async (moduleId) => {
    const response = await api.get(`/modules/${moduleId}/quiz/results`);
    return response.data;
  },
};

export default moduleApi;