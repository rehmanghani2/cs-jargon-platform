import api from './axios';

export const courseApi = {
  // Get all courses
  getCourses: async () => {
    const response = await api.get('/courses');
    return response.data;
  },
  
  // Get single course
  getCourse: async (courseId) => {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  },
  
  // Get my courses
  getMyCourses: async () => {
    const response = await api.get('/courses/my-courses');
    return response.data;
  },
  
  // Enroll in course
  enrollInCourse: async (courseId) => {
    const response = await api.post(`/courses/${courseId}/enroll`);
    return response.data;
  },
  
  // Get course progress
  getCourseProgress: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/progress`);
    return response.data;
  },
};

export default courseApi;