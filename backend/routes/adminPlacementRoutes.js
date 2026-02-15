const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
    getAllQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getPlacementStats,
    allowRetake
} = require('../controllers/adminPlacementController');

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

router.route('/placement-questions')
    .get(getAllQuestions)
    .post(createQuestion);

router.route('/placement-questions/:id')
    .put(updateQuestion)
    .delete(deleteQuestion);

router.get('/placement-stats', getPlacementStats);
router.post('/placement-retake/:userId', allowRetake);

module.exports = router;