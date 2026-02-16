import axios from './axios';

const noticeBoardApi = {
  // Get all announcements
  getAllAnnouncements: async (params) => {
    const response = await axios.get('/announcements', { params });
    return response.data;
  },

  // Get announcement by ID
  getAnnouncementById: async (announcementId) => {
    const response = await axios.get(`/announcements/${announcementId}`);
    return response.data;
  },

  // Get latest announcements
  getLatestAnnouncements: async (limit = 5) => {
    const response = await axios.get('/announcements/latest', {
      params: { limit },
    });
    return response.data;
  },

  // Get pinned announcements
  getPinnedAnnouncements: async () => {
    const response = await axios.get('/announcements/pinned');
    return response.data;
  },

  // Mark announcement as read
  markAsRead: async (announcementId) => {
    const response = await axios.post(`/announcements/${announcementId}/read`);
    return response.data;
  },

  // Get all events
  getAllEvents: async (params) => {
    const response = await axios.get('/events', { params });
    return response.data;
  },

  // Get event by ID
  getEventById: async (eventId) => {
    const response = await axios.get(`/events/${eventId}`);
    return response.data;
  },

  // Get upcoming events
  getUpcomingEvents: async (limit = 10) => {
    const response = await axios.get('/events/upcoming', {
      params: { limit },
    });
    return response.data;
  },

  // Register for event
  registerForEvent: async (eventId) => {
    const response = await axios.post(`/events/${eventId}/register`);
    return response.data;
  },

  // Unregister from event
  unregisterFromEvent: async (eventId) => {
    const response = await axios.delete(`/events/${eventId}/register`);
    return response.data;
  },

  // Get event attendees
  getEventAttendees: async (eventId, params) => {
    const response = await axios.get(`/events/${eventId}/attendees`, { params });
    return response.data;
  },

  // Get user registered events
  getUserEvents: async (userId) => {
    const response = await axios.get(`/users/${userId}/events`);
    return response.data;
  },

  // Add event to calendar
  addEventToCalendar: async (eventId) => {
    const response = await axios.get(`/events/${eventId}/calendar`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Create announcement (admin only)
  createAnnouncement: async (announcementData) => {
    const response = await axios.post('/announcements', announcementData);
    return response.data;
  },

  // Update announcement (admin only)
  updateAnnouncement: async (announcementId, announcementData) => {
    const response = await axios.put(`/announcements/${announcementId}`, announcementData);
    return response.data;
  },

  // Delete announcement (admin only)
  deleteAnnouncement: async (announcementId) => {
    const response = await axios.delete(`/announcements/${announcementId}`);
    return response.data;
  },

  // Pin announcement (admin only)
  pinAnnouncement: async (announcementId) => {
    const response = await axios.post(`/announcements/${announcementId}/pin`);
    return response.data;
  },

  // Unpin announcement (admin only)
  unpinAnnouncement: async (announcementId) => {
    const response = await axios.delete(`/announcements/${announcementId}/pin`);
    return response.data;
  },

  // Create event (admin only)
  createEvent: async (eventData) => {
    const response = await axios.post('/events', eventData);
    return response.data;
  },

  // Update event (admin only)
  updateEvent: async (eventId, eventData) => {
    const response = await axios.put(`/events/${eventId}`, eventData);
    return response.data;
  },

  // Delete event (admin only)
  deleteEvent: async (eventId) => {
    const response = await axios.delete(`/events/${eventId}`);
    return response.data;
  },

  // Send event reminder (admin only)
  sendEventReminder: async (eventId) => {
    const response = await axios.post(`/events/${eventId}/reminder`);
    return response.data;
  },

  // Get announcement analytics
  getAnnouncementAnalytics: async (announcementId) => {
    const response = await axios.get(`/announcements/${announcementId}/analytics`);
    return response.data;
  },

  // Search announcements and events
  search: async (query, type) => {
    const response = await axios.get('/notice-board/search', {
      params: { q: query, type },
    });
    return response.data;
  },
};

export default noticeBoardApi;