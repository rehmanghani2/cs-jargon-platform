import axios from './axios';

const assignmentApi = {
  // Get all assignments
  getAllAssignments: async (params) => {
    const response = await axios.get('/assignments', { params });
    return response.data;
  },

  // Get assignment by ID
  getAssignmentById: async (assignmentId) => {
    const response = await axios.get(`/assignments/${assignmentId}`);
    return response.data;
  },

  // Get user assignments
  getUserAssignments: async (userId, params) => {
    const response = await axios.get(`/users/${userId}/assignments`, { params });
    return response.data;
  },

  // Get course assignments
  getCourseAssignments: async (courseId) => {
    const response = await axios.get(`/courses/${courseId}/assignments`);
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
  getSubmission: async (assignmentId, userId) => {
    const response = await axios.get(`/assignments/${assignmentId}/submissions/${userId}`);
    return response.data;
  },

  // Get all submissions for assignment
  getAssignmentSubmissions: async (assignmentId, params) => {
    const response = await axios.get(`/assignments/${assignmentId}/submissions`, { params });
    return response.data;
  },

  // Update submission
  updateSubmission: async (submissionId, formData) => {
    const response = await axios.put(`/submissions/${submissionId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete submission
  deleteSubmission: async (submissionId) => {
    const response = await axios.delete(`/submissions/${submissionId}`);
    return response.data;
  },

  // Grade submission (instructor/admin only)
  gradeSubmission: async (submissionId, gradeData) => {
    const response = await axios.post(`/submissions/${submissionId}/grade`, gradeData);
    return response.data;
  },

  // Add feedback to submission
  addFeedback: async (submissionId, feedback) => {
    const response = await axios.post(`/submissions/${submissionId}/feedback`, { feedback });
    return response.data;
  },

  // Request resubmission
  requestResubmission: async (submissionId, reason) => {
    const response = await axios.post(`/submissions/${submissionId}/resubmit`, { reason });
    return response.data;
  },

  // Get assignment analytics
  getAssignmentAnalytics: async (assignmentId) => {
    const response = await axios.get(`/assignments/${assignmentId}/analytics`);
    return response.data;
  },

  // Create assignment (instructor/admin only)
  createAssignment: async (assignmentData) => {
    const response = await axios.post('/assignments', assignmentData);
    return response.data;
  },

  // Update assignment (instructor/admin only)
  updateAssignment: async (assignmentId, assignmentData) => {
    const response = await axios.put(`/assignments/${assignmentId}`, assignmentData);
    return response.data;
  },

  // Delete assignment (admin only)
  deleteAssignment: async (assignmentId) => {
    const response = await axios.delete(`/assignments/${assignmentId}`);
    return response.data;
  },

  // Upload assignment attachment
  uploadAttachment: async (assignmentId, formData) => {
    const response = await axios.post(`/assignments/${assignmentId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Download submission file
  downloadSubmission: async (submissionId) => {
    const response = await axios.get(`/submissions/${submissionId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get upcoming assignments
  getUpcomingAssignments: async (userId) => {
    const response = await axios.get(`/users/${userId}/assignments/upcoming`);
    return response.data;
  },

  // Get overdue assignments
  getOverdueAssignments: async (userId) => {
    const response = await axios.get(`/users/${userId}/assignments/overdue`);
    return response.data;
  },

  // Peer review assignment
  submitPeerReview: async (submissionId, reviewData) => {
    const response = await axios.post(`/submissions/${submissionId}/peer-review`, reviewData);
    return response.data;
  },

  // Get peer reviews
  getPeerReviews: async (submissionId) => {
    const response = await axios.get(`/submissions/${submissionId}/peer-reviews`);
    return response.data;
  },
};

export default assignmentApi;