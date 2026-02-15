const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/upload'); // You'll need to add upload middleware

const {
    getJargons,
    getJargon,
    getJargonOfWeek,
    getJargonStats,
    getMasteredJargons,
    searchJargons,
    getCategories,
    getSuggestions,
    getFlashcards
} = require('../controllers/jargonController');

const {
    createJargon,
    updateJargon,
    deleteJargon,
    setJargonOfWeek,
    verifyJargon,
    importJargons,
    exportJargons,
    getJargonDashboard
} = require('../controllers/adminJargonController');

// Public routes
router.get('/categories', getCategories);
router.get('/suggestions', getSuggestions);

// Protected routes
router.use(protect);

// User-facing routes
router.get('/', getJargons);
router.get('/search', searchJargons);
router.get('/:id', getJargon);
router.get('/jargon-of-week', getJargonOfWeek);
router.get('/stats', getJargonStats);
router.get('/mastered', getMasteredJargons);
router.get('/flashcards', getFlashcards);

// Admin routes
router.use(authorize('admin'));

router.post('/', createJargon);
router.put('/:id', updateJargon);
router.delete('/:id', deleteJargon);
router.put('/:id/set-jargon-of-week', setJargonOfWeek);
router.put('/:id/verify', verifyJargon);
router.post('/import', upload.single('file'), importJargons);
router.get('/export', exportJargons);
router.get('/dashboard', getJargonDashboard);

module.exports = router;