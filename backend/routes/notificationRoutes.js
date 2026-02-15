const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
    createAnnouncement
} = require('../controllers/notificationController');

// All routes require authentication
router.use(protect);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

// Admin routes
router.post('/announcement', authorize('admin'), createAnnouncement);

module.exports = router;