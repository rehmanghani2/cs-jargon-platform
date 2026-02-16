import axios from './axios';

const attendanceApi = {
  // Mark attendance
  markAttendance: async (attendanceData) => {
    const response = await axios.post('/attendance', attendanceData);
    return response.data;
  },

  // Get user attendance
  getUserAttendance: async (userId, params) => {
    const response = await axios.get(`/users/${userId}/attendance`, { params });
    return response.data;
  },

  // Get course attendance
  getCourseAttendance: async (courseId, params) => {
    const response = await axios.get(`/courses/${courseId}/attendance`, { params });
    return response.data;
  },

  // Get attendance by date
  getAttendanceByDate: async (date) => {
    const response = await axios.get('/attendance/date', {
      params: { date },
    });
    return response.data;
  },

  // Get attendance statistics
  getAttendanceStats: async (userId) => {
    const response = await axios.get(`/users/${userId}/attendance/stats`);
    return response.data;
  },

  // Update attendance
  updateAttendance: async (attendanceId, status) => {
    const response = await axios.put(`/attendance/${attendanceId}`, { status });
    return response.data;
  },

  // Delete attendance record
  deleteAttendance: async (attendanceId) => {
    const response = await axios.delete(`/attendance/${attendanceId}`);
    return response.data;
  },

  // Get attendance report
  getAttendanceReport: async (params) => {
    const response = await axios.get('/attendance/report', { params });
    return response.data;
  },

  // Export attendance
  exportAttendance: async (params) => {
    const response = await axios.get('/attendance/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  // Get student attendance summary
  getStudentSummary: async (userId, courseId) => {
    const response = await axios.get(`/users/${userId}/courses/${courseId}/attendance/summary`);
    return response.data;
  },

  // Get class attendance for date
  getClassAttendance: async (courseId, date) => {
    const response = await axios.get(`/courses/${courseId}/attendance/date`, {
      params: { date },
    });
    return response.data;
  },

  // Bulk mark attendance
  bulkMarkAttendance: async (attendanceRecords) => {
    const response = await axios.post('/attendance/bulk', { records: attendanceRecords });
    return response.data;
  },

  // Request attendance correction
  requestCorrection: async (attendanceId, reason) => {
    const response = await axios.post(`/attendance/${attendanceId}/correction`, { reason });
    return response.data;
  },
};

export default attendanceApi;