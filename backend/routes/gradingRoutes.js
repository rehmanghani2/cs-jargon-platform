const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
    getSubmissionsForGrading,
    gradeSubmission,
    batchGradeSubmissions,
    requestResubmission,
    getGradingStats
} = require('../controllers/gradingController');

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin', 'instructor'));

router.get('/assignments/:assignmentId/submissions', getSubmissionsForGrading);
router.get('/assignments/:assignmentId/stats', getGradingStats);
router.put('/assignments/:assignmentId/batch-grade', batchGradeSubmissions);
router.put('/submissions/:submissionId/grade', gradeSubmission);
router.put('/submissions/:submissionId/request-resubmit', requestResubmission);

module.exports = router;