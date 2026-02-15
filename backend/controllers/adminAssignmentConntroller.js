const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Jargon = require('../models/Jargon');
const { validationResult } = require('express-validator');

// @desc    Create assignment
// @route   POST /api/admin/assignments
// @access  Private/Admin
exports.createAssignment = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const assignment = await Assignment.create({
            ...req.body,
            createdBy: req.user.id
        });

        res.status(201).json({
            success: true,
            message: 'Assignment created successfully',
            data: { assignment }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Update assignment
// @route   PUT /api/admin/assignments/:id
// @access  Private/Admin
exports.updateAssignment = async (req, res, next) => {
    try {
        let assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        // Don't allow major changes if assignment is published and has submissions
        if (assignment.status === 'published' && assignment.totalSubmissions > 0) {
            const restrictedFields = ['questions', 'totalPoints', 'type'];
            const hasRestrictedChanges = restrictedFields.some(
                field => req.body[field] !== undefined
            );

            if (hasRestrictedChanges) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot modify questions or scoring after students have submitted'
                });
            }
        }

        assignment = await Assignment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Assignment updated successfully',
            data: { assignment }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Publish assignment
// @route   PUT /api/admin/assignments/:id/publish
// @access  Private/Admin
exports.publishAssignment = async (req, res, next) => {
    try {
        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        // Validate assignment is ready
        if (!assignment.questions || assignment.questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Assignment must have at least one question'
            });
        }

        if (!assignment.dueDate) {
            return res.status(400).json({
                success: false,
                message: 'Assignment must have a due date'
            });
        }

        assignment.status = 'published';
        assignment.publishedAt = new Date();
        await assignment.save();

        // Notify enrolled students
        const Enrollment = require('../models/Enrollment');
        const Notification = require('../models/Notification');
        
        const enrollments = await Enrollment.find({ 
            course: assignment.course,
            status: 'active'
        });

        for (const enrollment of enrollments) {
            await Notification.create({
                recipient: enrollment.user,
                type: 'assignment-due',
                title: 'New Assignment Available! 📝',
                message: `"${assignment.title}" is now available. Due: ${assignment.dueDate.toLocaleDateString()}`,
                link: `/assignments/${assignment._id}`,
                priority: 'high'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Assignment published successfully',
            data: { assignment }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Close assignment
// @route   PUT /api/admin/assignments/:id/close
// @access  Private/Admin
exports.closeAssignment = async (req, res, next) => {
    try {
        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        assignment.status = 'closed';
        assignment.closedAt = new Date();
        await assignment.save();

        res.status(200).json({
            success: true,
            message: 'Assignment closed',
            data: { assignment }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Delete assignment
// @route   DELETE /api/admin/assignments/:id
// @access  Private/Admin
exports.deleteAssignment = async (req, res, next) => {
    try {
        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        // Check for submissions
        if (assignment.totalSubmissions > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete assignment with existing submissions. Archive it instead.'
            });
        }

        await assignment.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Assignment deleted successfully'
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Duplicate assignment
// @route   POST /api/admin/assignments/:id/duplicate
// @access  Private/Admin
exports.duplicateAssignment = async (req, res, next) => {
    try {
        const original = await Assignment.findById(req.params.id);

        if (!original) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        const duplicate = new Assignment({
            ...original.toObject(),
            _id: undefined,
            title: `${original.title} (Copy)`,
            status: 'draft',
            totalSubmissions: 0,
            gradedSubmissions: 0,
            averageScore: 0,
            publishedAt: undefined,
            closedAt: undefined,
            createdBy: req.user.id
        });

        await duplicate.save();

        res.status(201).json({
            success: true,
            message: 'Assignment duplicated successfully',
            data: { assignment: duplicate }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get all assignments (admin)
// @route   GET /api/admin/assignments
// @access  Private/Admin
exports.getAllAssignments = async (req, res, next) => {
    try {
        const { course, status, type, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (course) filter.course = course;
        if (status) filter.status = status;
        if (type) filter.type = type;

        const total = await Assignment.countDocuments(filter);

        const assignments = await Assignment.find(filter)
            .populate('course', 'title level')
            .populate('module', 'title')
            .populate('createdBy', 'fullName')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            data: {
                assignments,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Extend deadline
// @route   PUT /api/admin/assignments/:id/extend-deadline
// @access  Private/Admin
exports.extendDeadline = async (req, res, next) => {
    try {
        const { newDueDate, reason } = req.body;

        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        const oldDueDate = assignment.dueDate;
        assignment.dueDate = new Date(newDueDate);
        await assignment.save();

        // Notify students
        const Enrollment = require('../models/Enrollment');
        const Notification = require('../models/Notification');
        
        const enrollments = await Enrollment.find({ 
            course: assignment.course,
            status: 'active'
        });

        for (const enrollment of enrollments) {
            await Notification.create({
                recipient: enrollment.user,
                type: 'announcement',
                title: 'Assignment Deadline Extended ⏰',
                message: `The deadline for "${assignment.title}" has been extended to ${assignment.dueDate.toLocaleDateString()}. ${reason || ''}`,
                link: `/assignments/${assignment._id}`,
                priority: 'medium'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Deadline extended successfully',
            data: {
                oldDueDate,
                newDueDate: assignment.dueDate
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = exports;