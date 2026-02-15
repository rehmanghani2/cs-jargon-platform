const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const {
    getStreakInfo,
    purchaseStreakFreeze,
    getActivityHeatmap,
    getWeeklyReports,
    getWeeklyReport,
    getStreakLeaderboard,
    getStreakTips
} = require('../controllers/streakController');

// All routes require authentication
router.use(protect);

// Streak info
router.get('/', getStreakInfo);
router.get('/tips', getStreakTips);

// Streak freezes
router.post('/purchase-freeze', purchaseStreakFreeze);

// Activity data
router.get('/heatmap', getActivityHeatmap);

// Weekly reports
router.get('/weekly-reports', getWeeklyReports);
router.get('/weekly-reports/:weekId', getWeeklyReport);

// Leaderboard
router.get('/leaderboard', getStreakLeaderboard);

module.exports = router;