const express = require('express');
const router = express.Router();
const { protect, authorize, requireCompleteProfile } = require('../middleware/auth');

const {
    startPlacementTest,
    submitAnswer,
    submitPlacementTest,
    getPlacementResult,
    getPlacementQuestions
} = require('../controllers/placementTestController');

// All routes require authentication and complete profile
router.use(protect);
router.use(requireCompleteProfile);

// Student routes
router.post('/start', startPlacementTest);
router.put('/:testId/answer', submitAnswer);
router.post('/:testId/submit', submitPlacementTest);
router.get('/result', getPlacementResult);

// Admin routes
router.get('/questions', authorize('admin'), getPlacementQuestions);

module.exports = router;