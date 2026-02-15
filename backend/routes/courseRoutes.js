const express = require('express');
const router = express.Router();
const { protect, requireCompleteProfile, requirePlacementTest } = require('../middleware/auth');

const {
    getCourses,
    getCourse,
    getMyCourses,
    enrollInCourse,
    getCourseProgress,
    updateCourseProgress
} = require('../controllers/courseController');

// All routes require authentication
router.use(protect);

// Public course routes (for browsing)
router.get('/', getCourses);
router.get('/my-courses', requireCompleteProfile, requirePlacementTest, getMyCourses);
router.get('/:id', getCourse);

// Enrollment and progress (requires placement test)
router.post('/:id/enroll', requireCompleteProfile, requirePlacementTest, enrollInCourse);
router.get('/:id/progress', requireCompleteProfile, requirePlacementTest, getCourseProgress);
router.put('/:id/progress', requireCompleteProfile, requirePlacementTest, updateCourseProgress);

module.exports = router;