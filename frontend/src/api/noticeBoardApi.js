import axios from './axios';

const noticeBoardApi = {
  // Get overview
  getOverview: async () => {
    const response = await axios.get('/notice-board/overview');
    return response.data;
  },

  // Get all announcements
  getAllAnnouncements: async (params) => {
    const response = await axios.get('/notice-board/announcements', { params });
    return response.data;
  },

  // Get unread announcements count
  getUnreadCount: async () => {
    const response = await axios.get('/notice-board/announcements/unread-count');
    return response.data;
  },

  // Get announcement by ID
  getAnnouncementById: async (announcementId) => {
    const response = await axios.get(`/notice-board/announcements/${announcementId}`);
    return response.data;
  },

  // Mark announcement as read
  markAsRead: async (announcementId) => {
    const response = await axios.put(`/notice-board/announcements/${announcementId}/read`);
    return response.data;
  },

  // Get all events
  getAllEvents: async (params) => {
    const response = await axios.get('/notice-board/events', { params });
    return response.data;
  },

  // Get event by ID
  getEventById: async (eventId) => {
    const response = await axios.get(`/notice-board/events/${eventId}`);
    return response.data;
  },

  // Register for event
  registerForEvent: async (eventId) => {
    const response = await axios.post(`/notice-board/events/${eventId}/register`);
    return response.data;
  },

  // Unregister from event
  unregisterFromEvent: async (eventId) => {
    const response = await axios.delete(`/notice-board/events/${eventId}/register`);
    return response.data;
  },

  // Submit event feedback
  submitEventFeedback: async (eventId, feedbackData) => {
    const response = await axios.post(`/notice-board/events/${eventId}/feedback`, feedbackData);
    return response.data;
  },

  // Get Jargon of the Week
  getJargonOfWeek: async () => {
    const response = await axios.get('/notice-board/jargon-of-week');
    return response.data;
  },

  // Get Leaderboard
  getLeaderboard: async () => {
    const response = await axios.get('/notice-board/leaderboard');
    return response.data;
  },
};

export default noticeBoardApi;