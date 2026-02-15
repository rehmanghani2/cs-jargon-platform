const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const {
    getMyCertificates,
    getCertificate,
    checkEligibility,
    requestCompletionCertificate,
    requestCharacterCertificate,
    downloadCertificate,
    verifyCertificate,
    toggleVisibility,
    getMyRecommendations,
    checkRecommendationEligibility,
    requestRecommendationLetter,
    getRecommendationLetter,
    downloadRecommendationLetter,
    verifyRecommendationLetter
} = require('../controllers/certificateController');

// Public verification routes (no auth required)
router.get('/verify/:certificateId', verifyCertificate);
router.get('/recommendations/verify/:letterId', verifyRecommendationLetter);

// Protected routes
router.use(protect);

// Certificates
router.get('/', getMyCertificates);
router.get('/check-eligibility/:courseId', checkEligibility);
router.get('/:certificateId', getCertificate);
router.post('/request/completion/:courseId', requestCompletionCertificate);
router.post('/request/character', requestCharacterCertificate);
router.get('/:certificateId/download', downloadCertificate);
router.put('/:certificateId/visibility', toggleVisibility);

// Recommendation letters
router.get('/recommendations', getMyRecommendations);
router.get('/recommendations/check-eligibility', checkRecommendationEligibility);
router.post('/recommendations/request', requestRecommendationLetter);
router.get('/recommendations/:letterId', getRecommendationLetter);
router.get('/recommendations/:letterId/download', downloadRecommendationLetter);

module.exports = router;