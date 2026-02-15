const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
    getAnnouncements,
    getAnnouncement,
    markAnnouncementAsRead,
    getUnreadCount,
    getEvents,
    getEvent,
    registerForEvent,
    unregisterFromEvent,
    submitEventFeedback,
    getJargonOfWeek,
    getLeaderboard,
    getNoticeBoardOverview
} = require('../controllers/noticeBoardController');

// All routes require authentication
router.use(protect);

// Overview
router.get('/overview', getNoticeBoardOverview);

// Announcements
router.get('/announcements', getAnnouncements);
router.get('/announcements/unread-count', getUnreadCount);
router.get('/announcements/:id', getAnnouncement);
router.put('/announcements/:id/read', markAnnouncementAsRead);

// Events
router.get('/events', getEvents);
router.get('/events/:id', getEvent);
router.post('/events/:id/register', registerForEvent);
router.delete('/events/:id/register', unregisterFromEvent);
router.post('/events/:id/feedback', submitEventFeedback);

// Jargon of the Week
router.get('/jargon-of-week', getJargonOfWeek);

// Leaderboard
router.get('/leaderboard', getLeaderboard);

module.exports = router;