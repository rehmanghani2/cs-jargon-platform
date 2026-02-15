const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
    startSession,
    endSession,
    logActivity,
    getToday,
    getSummary,
    getWeeklyActivity,
    getHistory,
    getUserAttendanceAdmin,
    getGlobalStatsAdmin
} = require('../controllers/attendanceController');

// All routes require authentication
router.use(protect);

// User-facing routes
router.post('/session/start', startSession);
router.post('/session/end', endSession);
router.post('/activity', logActivity);

router.get('/today', getToday);
router.get('/summary', getSummary);
router.get('/weekly', getWeeklyActivity);
router.get('/history', getHistory);

// Admin routes
router.get('/admin/user/:userId', authorize('admin', 'instructor'), getUserAttendanceAdmin);
router.get('/admin/stats', authorize('admin', 'instructor'), getGlobalStatsAdmin);

module.exports = router;