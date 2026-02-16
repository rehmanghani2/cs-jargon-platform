import axios from './axios';

const courseApi = {
  // Get all courses
  getAllCourses: async (params) => {
    const response = await axios.get('/courses', { params });
    return response.data;
  },

  // Get course by ID
  getCourseById: async (courseId) => {
    const response = await axios.get(`/courses/${courseId}`);
    return response.data;
  },

  // Get enrolled courses
  getEnrolledCourses: async (userId) => {
    const response = await axios.get(`/users/${userId}/courses`);
    return response.data;
  },

  // Enroll in course
  enrollCourse: async (courseId) => {
    const response = await axios.post(`/courses/${courseId}/enroll`);
    return response.data;
  },

  // Unenroll from course
  unenrollCourse: async (courseId) => {
    const response = await axios.delete(`/courses/${courseId}/enroll`);
    return response.data;
  },

  // Get course progress
  getCourseProgress: async (courseId, userId) => {
    const response = await axios.get(`/courses/${courseId}/progress/${userId}`);
    return response.data;
  },

  // Update course progress
  updateCourseProgress: async (courseId, progressData) => {
    const response = await axios.put(`/courses/${courseId}/progress`, progressData);
    return response.data;
  },

  // Get course modules
  getCourseModules: async (courseId) => {
    const response = await axios.get(`/courses/${courseId}/modules`);
    return response.data;
  },

  // Get course students
  getCourseStudents: async (courseId, params) => {
    const response = await axios.get(`/courses/${courseId}/students`, { params });
    return response.data;
  },

  // Get course analytics
  getCourseAnalytics: async (courseId) => {
    const response = await axios.get(`/courses/${courseId}/analytics`);
    return response.data;
  },

  // Create course (instructor/admin only)
  createCourse: async (courseData) => {
    const response = await axios.post('/courses', courseData);
    return response.data;
  },

  // Update course (instructor/admin only)
  updateCourse: async (courseId, courseData) => {
    const response = await axios.put(`/courses/${courseId}`, courseData);
    return response.data;
  },

  // Delete course (admin only)
  deleteCourse: async (courseId) => {
    const response = await axios.delete(`/courses/${courseId}`);
    return response.data;
  },

  // Upload course thumbnail
  uploadCourseThumbnail: async (courseId, formData) => {
    const response = await axios.post(`/courses/${courseId}/thumbnail`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get recommended courses
  getRecommendedCourses: async (userId) => {
    const response = await axios.get(`/courses/recommended/${userId}`);
    return response.data;
  },

  // Search courses
  searchCourses: async (query, filters) => {
    const response = await axios.get('/courses/search', {
      params: { q: query, ...filters },
    });
    return response.data;
  },

  // Get course reviews
  getCourseReviews: async (courseId, params) => {
    const response = await axios.get(`/courses/${courseId}/reviews`, { params });
    return response.data;
  },

  // Add course review
  addCourseReview: async (courseId, reviewData) => {
    const response = await axios.post(`/courses/${courseId}/reviews`, reviewData);
    return response.data;
  },

  // Get course announcements
  getCourseAnnouncements: async (courseId) => {
    const response = await axios.get(`/courses/${courseId}/announcements`);
    return response.data;
  },
};

export default courseApi;