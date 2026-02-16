import axios from './axios';

const certificateApi = {
  // Get user certificates
  getUserCertificates: async (userId, params) => {
    const response = await axios.get(`/users/${userId}/certificates`, { params });
    return response.data;
  },

  // Get certificate by ID
  getCertificateById: async (certificateId) => {
    const response = await axios.get(`/certificates/${certificateId}`);
    return response.data;
  },

  // Verify certificate
  verifyCertificate: async (certificateCode) => {
    const response = await axios.get(`/certificates/verify/${certificateCode}`);
    return response.data;
  },

  // Download certificate
  downloadCertificate: async (certificateId) => {
    const response = await axios.get(`/certificates/${certificateId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Generate certificate
  generateCertificate: async (certificateData) => {
    const response = await axios.post('/certificates/generate', certificateData);
    return response.data;
  },

  // Share certificate
  shareCertificate: async (certificateId, platform) => {
    const response = await axios.post(`/certificates/${certificateId}/share`, { platform });
    return response.data;
  },

  // Get certificate template
  getCertificateTemplate: async (templateId) => {
    const response = await axios.get(`/certificates/templates/${templateId}`);
    return response.data;
  },

  // Get all certificates (admin only)
  getAllCertificates: async (params) => {
    const response = await axios.get('/certificates', { params });
    return response.data;
  },

  // Create certificate (admin only)
  createCertificate: async (certificateData) => {
    const response = await axios.post('/certificates', certificateData);
    return response.data;
  },

  // Update certificate (admin only)
  updateCertificate: async (certificateId, certificateData) => {
    const response = await axios.put(`/certificates/${certificateId}`, certificateData);
    return response.data;
  },

  // Delete certificate (admin only)
  deleteCertificate: async (certificateId) => {
    const response = await axios.delete(`/certificates/${certificateId}`);
    return response.data;
  },

  // Revoke certificate (admin only)
  revokeCertificate: async (certificateId, reason) => {
    const response = await axios.post(`/certificates/${certificateId}/revoke`, { reason });
    return response.data;
  },

  // Get certificate analytics
  getCertificateAnalytics: async (params) => {
    const response = await axios.get('/certificates/analytics', { params });
    return response.data;
  },

  // Request recommendation letter
  requestRecommendation: async (requestData) => {
    const response = await axios.post('/certificates/recommendation', requestData);
    return response.data;
  },

  // Get recommendation letters
  getRecommendationLetters: async (userId) => {
    const response = await axios.get(`/users/${userId}/recommendations`);
    return response.data;
  },

  // Download recommendation letter
  downloadRecommendation: async (letterId) => {
    const response = await axios.get(`/recommendations/${letterId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default certificateApi;