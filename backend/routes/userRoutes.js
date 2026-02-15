const express = require('express');
const router = express.Router();
const { protect, authorize, requireCompleteProfile } = require('../middleware/auth');
const { uploadProfile } = require('../middleware/upload');

const {
    completeProfile,
    updateProfile,
    updateProfilePicture,
    getProfile,
    getDashboard,
    getStatistics,
    getActivityFeed,
    getLeaderboard,
    updateLearningPreferences,
    deactivateAccount
} = require('../controllers/userController');

const {
    completeProfileValidation,
    updateProfileValidation,
    learningPreferencesValidation
} = require('../utils/validators');

// All routes require authentication
router.use(protect);

// Profile routes
router.put('/complete-profile', completeProfileValidation, completeProfile);
router.get('/profile', getProfile);
router.put('/profile', updateProfileValidation, updateProfile);
router.put('/profile-picture', uploadProfile, updateProfilePicture);
router.put('/learning-preferences', learningPreferencesValidation, updateLearningPreferences);

// Dashboard and statistics
router.get('/dashboard', requireCompleteProfile, getDashboard);
router.get('/statistics', requireCompleteProfile, getStatistics);
router.get('/activity', requireCompleteProfile, getActivityFeed);

// Leaderboard
router.get('/leaderboard', requireCompleteProfile, getLeaderboard);

// Account management
router.put('/deactivate', deactivateAccount);

module.exports = router;