import axios from './axios';

const courseApi = {
  // Get all public courses
  getAllCourses: async (params) => {
    const response = await axios.get('/courses', { params });
    return response.data;
  },

  // Get user's assigned/enrolled courses
  getMyCourses: async () => {
    const response = await axios.get('/courses/my-courses');
    return response.data;
  },

  // Get course by ID
  getCourseById: async (courseId) => {
    const response = await axios.get(`/courses/${courseId}`);
    return response.data;
  },

  // Enroll in course
  enrollCourse: async (courseId) => {
    const response = await axios.post(`/courses/${courseId}/enroll`);
    return response.data;
  },

  // Get course progress
  getCourseProgress: async (courseId) => {
    const response = await axios.get(`/courses/${courseId}/progress`);
    return response.data;
  },

  // Update course progress
  updateCourseProgress: async (courseId, progressData) => {
    const response = await axios.put(`/courses/${courseId}/progress`, progressData);
    return response.data;
  },
};

export default courseApi;