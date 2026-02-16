import axios from './axios';

const jargonApi = {
  // Get all jargon terms
  getAllJargon: async (params) => {
    const response = await axios.get('/jargon', { params });
    return response.data;
  },

  // Get jargon by ID
  getJargonById: async (jargonId) => {
    const response = await axios.get(`/jargon/${jargonId}`);
    return response.data;
  },

  // Search jargon
  searchJargon: async (query, filters) => {
    const response = await axios.get('/jargon/search', {
      params: { q: query, ...filters },
    });
    return response.data;
  },

  // Get jargon by category
  getJargonByCategory: async (category, params) => {
    const response = await axios.get(`/jargon/category/${category}`, { params });
    return response.data;
  },

  // Get jargon by difficulty
  getJargonByDifficulty: async (difficulty, params) => {
    const response = await axios.get(`/jargon/difficulty/${difficulty}`, { params });
    return response.data;
  },

  // Get jargon of the week
  getJargonOfWeek: async () => {
    const response = await axios.get('/jargon/week');
    return response.data;
  },

  // Get random jargon
  getRandomJargon: async (count = 1) => {
    const response = await axios.get('/jargon/random', {
      params: { count },
    });
    return response.data;
  },

  // Get flashcards
  getFlashcards: async (params) => {
    const response = await axios.get('/jargon/flashcards', { params });
    return response.data;
  },

  // Mark jargon as learned
  markAsLearned: async (jargonId) => {
    const response = await axios.post(`/jargon/${jargonId}/learned`);
    return response.data;
  },

  // Mark jargon as favorite
  toggleFavorite: async (jargonId) => {
    const response = await axios.post(`/jargon/${jargonId}/favorite`);
    return response.data;
  },

  // Get user's learned jargon
  getLearnedJargon: async (userId, params) => {
    const response = await axios.get(`/users/${userId}/jargon/learned`, { params });
    return response.data;
  },

  // Get user's favorite jargon
  getFavoriteJargon: async (userId, params) => {
    const response = await axios.get(`/users/${userId}/jargon/favorites`, { params });
    return response.data;
  },

  // Get jargon statistics
  getJargonStats: async (userId) => {
    const response = await axios.get(`/users/${userId}/jargon/stats`);
    return response.data;
  },

  // Add jargon to study list
  addToStudyList: async (jargonId) => {
    const response = await axios.post(`/jargon/${jargonId}/study-list`);
    return response.data;
  },

  // Remove from study list
  removeFromStudyList: async (jargonId) => {
    const response = await axios.delete(`/jargon/${jargonId}/study-list`);
    return response.data;
  },

  // Get study list
  getStudyList: async (userId) => {
    const response = await axios.get(`/users/${userId}/jargon/study-list`);
    return response.data;
  },

  // Practice quiz
  getPracticeQuiz: async (params) => {
    const response = await axios.get('/jargon/quiz', { params });
    return response.data;
  },

  // Submit quiz
  submitQuiz: async (quizData) => {
    const response = await axios.post('/jargon/quiz/submit', quizData);
    return response.data;
  },

  // Get quiz history
  getQuizHistory: async (userId, params) => {
    const response = await axios.get(`/users/${userId}/jargon/quiz-history`, { params });
    return response.data;
  },

  // Create jargon (admin only)
  createJargon: async (jargonData) => {
    const response = await axios.post('/jargon', jargonData);
    return response.data;
  },

  // Update jargon (admin only)
  updateJargon: async (jargonId, jargonData) => {
    const response = await axios.put(`/jargon/${jargonId}`, jargonData);
    return response.data;
  },

  // Delete jargon (admin only)
  deleteJargon: async (jargonId) => {
    const response = await axios.delete(`/jargon/${jargonId}`);
    return response.data;
  },

  // Get jargon categories
  getCategories: async () => {
    const response = await axios.get('/jargon/categories');
    return response.data;
  },

  // Get related jargon
  getRelatedJargon: async (jargonId) => {
    const response = await axios.get(`/jargon/${jargonId}/related`);
    return response.data;
  },

  // Add jargon example
  addExample: async (jargonId, example) => {
    const response = await axios.post(`/jargon/${jargonId}/examples`, { example });
    return response.data;
  },

  // Report jargon issue
  reportIssue: async (jargonId, issueData) => {
    const response = await axios.post(`/jargon/${jargonId}/report`, issueData);
    return response.data;
  },
};

export default jargonApi;