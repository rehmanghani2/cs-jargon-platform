import axios from './axios';

const certificateApi = {
  // Get current user's certificates
  getMyCertificates: async () => {
    const response = await axios.get('/certificates');
    return response.data;
  },

  // Check eligibility for course completion certificate
  checkEligibility: async (courseId) => {
    const response = await axios.get(`/certificates/check-eligibility/${courseId}`);
    return response.data;
  },

  // Request completion certificate
  requestCompletionCertificate: async (courseId) => {
    const response = await axios.post(`/certificates/request/completion/${courseId}`);
    return response.data;
  },

  // Request character certificate
  requestCharacterCertificate: async () => {
    const response = await axios.post('/certificates/request/character');
    return response.data;
  },

  // Get certificate details
  getCertificateById: async (certificateId) => {
    const response = await axios.get(`/certificates/${certificateId}`);
    return response.data;
  },

  // Download certificate PDF
  downloadCertificate: async (certificateId) => {
    const response = await axios.get(`/certificates/${certificateId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Verify certificate by ID (public)
  verifyCertificate: async (certificateId) => {
    const response = await axios.get(`/certificates/verify/${certificateId}`);
    return response.data;
  },

  // Toggle certificate visibility
  toggleVisibility: async (certificateId) => {
    const response = await axios.put(`/certificates/${certificateId}/visibility`);
    return response.data;
  },

  // Get user recommendation letters
  getRecommendations: async () => {
    const response = await axios.get('/certificates/recommendations');
    return response.data;
  },

  // Check recommendation eligibility
  checkRecommendationEligibility: async () => {
    const response = await axios.get('/certificates/recommendations/check-eligibility');
    return response.data;
  },

  // Request recommendation letter
  requestRecommendationLetter: async () => {
    const response = await axios.post('/certificates/recommendations/request');
    return response.data;
  },

  // Get recommendation letter details
  getRecommendationLetter: async (letterId) => {
    const response = await axios.get(`/certificates/recommendations/${letterId}`);
    return response.data;
  },

  // Download recommendation letter PDF
  downloadRecommendationLetter: async (letterId) => {
    const response = await axios.get(`/certificates/recommendations/${letterId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Verify recommendation letter (public)
  verifyRecommendationLetter: async (letterId) => {
    const response = await axios.get(`/certificates/recommendations/verify/${letterId}`);
    return response.data;
  },
};

export default certificateApi;