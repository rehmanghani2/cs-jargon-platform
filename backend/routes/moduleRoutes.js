const express = require('express');
const router = express.Router();
const { protect, requireCompleteProfile, requirePlacementTest } = require('../middleware/auth');

const {
    getModule,
    getLesson,
    completeLesson,
    getModuleQuiz,
    submitModuleQuiz,
    getQuizResults
} = require('../controllers/moduleController');

// All routes require authentication and placement test
router.use(protect);
router.use(requireCompleteProfile);
router.use(requirePlacementTest);

// Module routes
router.get('/:id', getModule);

// Lesson routes
router.get('/:moduleId/lessons/:lessonIndex', getLesson);
router.post('/:moduleId/lessons/:lessonIndex/complete', completeLesson);

// Quiz routes
router.get('/:id/quiz', getModuleQuiz);
router.post('/:id/quiz/submit', submitModuleQuiz);
router.get('/:id/quiz/results', getQuizResults);

module.exports = router;