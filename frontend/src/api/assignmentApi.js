import axios from './axios';

const assignmentApi = {
  // Get course assignments
  getCourseAssignments: async (courseId) => {
    const response = await axios.get(`/assignments/course/${courseId}`);
    return response.data;
  },

  // Get user assignment stats
  getMyAssignmentStats: async () => {
    const response = await axios.get('/assignments/my-stats');
    return response.data;
  },

  // Get peer review assignments
  getPeerReviewAssignments: async () => {
    const response = await axios.get('/assignments/peer-reviews');
    return response.data;
  },

  // Get assignment by ID
  getAssignmentById: async (assignmentId) => {
    const response = await axios.get(`/assignments/${assignmentId}`);
    return response.data;
  },

  // Start assignment
  startAssignment: async (assignmentId) => {
    const response = await axios.post(`/assignments/${assignmentId}/start`);
    return response.data;
  },

  // Save draft
  saveDraft: async (assignmentId, draftData) => {
    const response = await axios.put(`/assignments/${assignmentId}/save-draft`, draftData);
    return response.data;
  },

  // Submit assignment
  submitAssignment: async (assignmentId, formData) => {
    const response = await axios.post(`/assignments/${assignmentId}/submit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get submission
  getSubmission: async (assignmentId, submissionId) => {
    const response = await axios.get(`/assignments/${assignmentId}/submission/${submissionId}`);
    return response.data;
  },

  // Submit peer review
  submitPeerReview: async (assignmentId, submissionId, reviewData) => {
    const response = await axios.post(`/assignments/${assignmentId}/submission/${submissionId}/peer-review`, reviewData);
    return response.data;
  },
};

export default assignmentApi;