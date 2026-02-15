const express = require('express');
const router = express.Router();
const { protect, requireCompleteProfile, requirePlacementTest } = require('../middleware/auth');
const { uploadAssignment } = require('../middleware/upload');

const {
    getCourseAssignments,
    getAssignment,
    startAssignment,
    saveDraft,
    submitAssignment,
    getSubmission,
    getPeerReviewAssignments,
    submitPeerReview,
    getMyAssignmentStats
} = require('../controllers/assignmentController');

// All routes require authentication
router.use(protect);
router.use(requireCompleteProfile);
router.use(requirePlacementTest);

// Student routes
router.get('/course/:courseId', getCourseAssignments);
router.get('/my-stats', getMyAssignmentStats);
router.get('/peer-reviews', getPeerReviewAssignments);
router.get('/:id', getAssignment);
router.post('/:id/start', startAssignment);
router.put('/:id/save-draft', saveDraft);
router.post('/:id/submit', uploadAssignment, submitAssignment);
router.get('/:assignmentId/submission/:submissionId', getSubmission);
router.post('/:assignmentId/submission/:submissionId/peer-review', submitPeerReview);

module.exports = router;