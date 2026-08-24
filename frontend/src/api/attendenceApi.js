import axios from './axios';

const attendanceApi = {
  // Start session
  startSession: async () => {
    const response = await axios.post('/attendance/session/start');
    return response.data;
  },

  // End session
  endSession: async (sessionData) => {
    const response = await axios.post('/attendance/session/end', sessionData);
    return response.data;
  },

  // Log activity time
  logActivity: async (activityData) => {
    const response = await axios.post('/attendance/activity', activityData);
    return response.data;
  },

  // Get today's attendance
  getToday: async () => {
    const response = await axios.get('/attendance/today');
    return response.data;
  },

  // Get attendance summary
  getSummary: async () => {
    const response = await axios.get('/attendance/summary');
    return response.data;
  },

  // Get weekly activity report
  getWeeklyActivity: async () => {
    const response = await axios.get('/attendance/weekly');
    return response.data;
  },

  // Get attendance history
  getHistory: async (params) => {
    const response = await axios.get('/attendance/history', { params });
    return response.data;
  },
};

export default attendanceApi;