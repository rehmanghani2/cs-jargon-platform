const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    togglePinAnnouncement,
    createEvent,
    updateEvent,
    deleteEvent,
    markEventAttendance,
    addEventResources
} = require('../controllers/adminNoticeBoardController');

// All routes require admin access
router.use(protect);
router.use(authorize('admin'));

// Announcements
router.post('/announcements', createAnnouncement);
router.put('/announcements/:id', updateAnnouncement);
router.delete('/announcements/:id', deleteAnnouncement);
router.put('/announcements/:id/pin', togglePinAnnouncement);

// Events
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);
router.put('/events/:id/attendance', markEventAttendance);
router.post('/events/:id/resources', addEventResources);

module.exports = router;