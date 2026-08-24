import axios from './axios';

const jargonApi = {
  // Get all jargon terms
  getAllJargon: async (params) => {
    const response = await axios.get('/jargons', { params });
    return response.data;
  },

  // Get jargon categories
  getCategories: async () => {
    const response = await axios.get('/jargons/categories');
    return response.data;
  },

  // Search jargon
  searchJargon: async (query, filters) => {
    const response = await axios.get('/jargons/search', {
      params: { q: query, ...filters },
    });
    return response.data;
  },

  // Get jargon of the week
  getJargonOfWeek: async () => {
    const response = await axios.get('/jargons/jargon-of-week');
    return response.data;
  },

  // Get flashcards
  getFlashcards: async (params) => {
    const response = await axios.get('/jargons/flashcards', { params });
    return response.data;
  },

  // Get jargon stats
  getJargonStats: async () => {
    const response = await axios.get('/jargons/stats');
    return response.data;
  },

  // Get mastered jargons
  getMasteredJargons: async () => {
    const response = await axios.get('/jargons/mastered');
    return response.data;
  },

  // Get jargon by ID
  getJargonById: async (jargonId) => {
    const response = await axios.get(`/jargons/${jargonId}`);
    return response.data;
  },
};

export default jargonApi;