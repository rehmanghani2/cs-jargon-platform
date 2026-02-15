const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
    getResources,
    getResource,
    getResourcesByType,
    toggleSaveResource,
    getSavedResources,
    addReview,
    trackClick,
    getResourceCategories,
    getSuggestedApps,
    getPathways,
    getPathway,
    enrollInPathway,
    completePathwayStep,
    getEnrolledPathways
} = require('../controllers/resourceController');

// All routes require authentication
router.use(protect);

// Resources
router.get('/', getResources);
router.get('/categories', getResourceCategories);
router.get('/saved', getSavedResources);
router.get('/apps', getSuggestedApps);
router.get('/type/:type', getResourcesByType);
router.get('/:id', getResource);
router.post('/:id/save', toggleSaveResource);
router.post('/:id/review', addReview);
router.post('/:id/click', trackClick);

// Learning Pathways
router.get('/pathways', getPathways);
router.get('/pathways/enrolled', getEnrolledPathways);
router.get('/pathways/:id', getPathway);
router.post('/pathways/:id/enroll', enrollInPathway);
router.post('/pathways/:id/complete-step', completePathwayStep);

module.exports = router;