const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
    createAssignment,
    updateAssignment,
    publishAssignment,
    closeAssignment,
    deleteAssignment,
    duplicateAssignment,
    getAllAssignments,
    extendDeadline
} = require('../controllers/adminAssignmentController');

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

router.route('/')
    .get(getAllAssignments)
    .post(createAssignment);

router.route('/:id')
    .put(updateAssignment)
    .delete(deleteAssignment);

router.put('/:id/publish', publishAssignment);
router.put('/:id/close', closeAssignment);
router.post('/:id/duplicate', duplicateAssignment);
router.put('/:id/extend-deadline', extendDeadline);

module.exports = router;