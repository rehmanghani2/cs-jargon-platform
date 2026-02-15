const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
    getAllCertificates,
    issueAppreciationCertificate,
    revokeCertificate,
    getCertificateStats,
    getAllRecommendations,
    revokeRecommendationLetter
} = require('../controllers/adminCertificateController');

// All routes require admin access
router.use(protect);
router.use(authorize('admin'));

// Certificate routes
router.get('/certificates', getAllCertificates);
router.get('/certificates/stats', getCertificateStats);
router.post('/certificates/appreciation', issueAppreciationCertificate);
router.put('/certificates/:certificateId/revoke', revokeCertificate);

// Recommendation letter routes
router.get('/recommendations', getAllRecommendations);
router.put('/recommendations/:letterId/revoke', revokeRecommendationLetter);

module.exports = router;