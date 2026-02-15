const PlacementQuestion = require('../models/PlacementQuestion');
const PlacementTest = require('../models/PlacementTest');
const { validationResult } = require('express-validator');

// @desc    Get all placement questions
// @route   GET /api/admin/placement-questions
// @access  Private/Admin
exports.getAllQuestions = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.category) filter.category = req.query.category;
        if (req.query.difficulty) filter.difficulty = req.query.difficulty;
        if (req.query.type) filter.questionType = req.query.type;
        if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

        const total = await PlacementQuestion.countDocuments(filter);
        const questions = await PlacementQuestion.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            data: {
                questions,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Create placement question
// @route   POST /api/admin/placement-questions
// @access  Private/Admin
exports.createQuestion = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const question = await PlacementQuestion.create(req.body);

        res.status(201).json({
            success: true,
            data: { question }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Update placement question
// @route   PUT /api/admin/placement-questions/:id
// @access  Private/Admin
exports.updateQuestion = async (req, res, next) => {
    try {
        const question = await PlacementQuestion.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { question }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Delete placement question
// @route   DELETE /api/admin/placement-questions/:id
// @access  Private/Admin
exports.deleteQuestion = async (req, res, next) => {
    try {
        const question = await PlacementQuestion.findByIdAndDelete(req.params.id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Question deleted successfully'
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get placement test statistics
// @route   GET /api/admin/placement-stats
// @access  Private/Admin
exports.getPlacementStats = async (req, res, next) => {
    try {
        // Total tests
        const totalTests = await PlacementTest.countDocuments({ status: 'completed' });

        // Level distribution
        const levelDistribution = await PlacementTest.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: '$assignedLevel', count: { $sum: 1 } } }
        ]);

        // Average score
        const avgScore = await PlacementTest.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, avgScore: { $avg: '$percentageScore' } } }
        ]);

        // Score distribution
        const scoreDistribution = await PlacementTest.aggregate([
            { $match: { status: 'completed' } },
            {
                $bucket: {
                    groupBy: '$percentageScore',
                    boundaries: [0, 20, 40, 60, 80, 100],
                    default: 100,
                    output: { count: { $sum: 1 } }
                }
            }
        ]);

        // Category performance
        const categoryPerformance = await PlacementTest.aggregate([
            { $match: { status: 'completed' } },
            { $unwind: '$categoryScores' },
            {
                $group: {
                    _id: '$categoryScores.category',
                    avgPercentage: { $avg: '$categoryScores.percentage' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalTests,
                levelDistribution: levelDistribution.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {}),
                averageScore: Math.round(avgScore[0]?.avgScore || 0),
                scoreDistribution,
                categoryPerformance
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Allow user to retake placement test
// @route   POST /api/admin/placement-retake/:userId
// @access  Private/Admin
exports.allowRetake = async (req, res, next) => {
    try {
        const User = require('../models/User');
        
        const user = await User.findById(req.params.userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Reset placement test status
        user.placementTestCompleted = false;
        user.placementTestScore = 0;
        user.assignedLevel = null;
        user.levelAssignedDate = null;
        user.strengthAreas = [];
        user.improvementAreas = [];
        
        await user.save();

        // Mark previous tests as abandoned
        await PlacementTest.updateMany(
            { user: user._id, status: 'completed' },
            { $set: { status: 'abandoned' } }
        );

        res.status(200).json({
            success: true,
            message: `User ${user.fullName} can now retake the placement test`
        });

    } catch (error) {
        next(error);
    }
};