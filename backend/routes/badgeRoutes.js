const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Badge = require('../models/Badge');
const BadgeService = require('../services/badgeService');

// @desc    Get all badges with user progress
// @route   GET /api/badges
// @access  Private
router.get('/', protect, async (req, res, next) => {
    try {
        const badges = await BadgeService.getBadgesWithProgress(req.user.id);

        // Group by category
        const groupedBadges = badges.reduce((acc, badge) => {
            const category = badge.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(badge);
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            data: {
                badges: groupedBadges,
                totalBadges: badges.length,
                earnedBadges: badges.filter(b => b.earned).length,
                totalPoints: badges.filter(b => b.earned).reduce((sum, b) => sum + b.points, 0)
            }
        });

    } catch (error) {
        next(error);
    }
});

// @desc    Get badge by ID
// @route   GET /api/badges/:id
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
    try {
        const badge = await Badge.findById(req.params.id);

        if (!badge) {
            return res.status(404).json({
                success: false,
                message: 'Badge not found'
            });
        }

        // Check if user has this badge
        const user = await require('../models/User').findById(req.user.id);
        const userBadge = user.badges.find(
            b => b.badge.toString() === badge._id.toString()
        );

        res.status(200).json({
            success: true,
            data: {
                badge: {
                    ...badge.toObject(),
                    earned: !!userBadge,
                    earnedAt: userBadge?.earnedAt
                }
            }
        });

    } catch (error) {
        next(error);
    }
});

// @desc    Get user's earned badges
// @route   GET /api/badges/user/earned
// @access  Private
router.get('/user/earned', protect, async (req, res, next) => {
    try {
        const user = await require('../models/User').findById(req.user.id)
            .populate('badges.badge');

        const earnedBadges = user.badges.map(b => ({
            ...b.badge.toObject(),
            earnedAt: b.earnedAt
        }));

        res.status(200).json({
            success: true,
            data: {
                badges: earnedBadges,
                totalPoints: earnedBadges.reduce((sum, b) => sum + b.points, 0)
            }
        });

    } catch (error) {
        next(error);
    }
});

// Admin routes
// @desc    Create new badge
// @route   POST /api/badges
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res, next) => {
    try {
        const badge = await Badge.create(req.body);

        res.status(201).json({
            success: true,
            data: { badge }
        });

    } catch (error) {
        next(error);
    }
});

// @desc    Update badge
// @route   PUT /api/badges/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
    try {
        const badge = await Badge.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!badge) {
            return res.status(404).json({
                success: false,
                message: 'Badge not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { badge }
        });

    } catch (error) {
        next(error);
    }
});

// @desc    Delete badge
// @route   DELETE /api/badges/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
    try {
        const badge = await Badge.findByIdAndDelete(req.params.id);

        if (!badge) {
            return res.status(404).json({
                success: false,
                message: 'Badge not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Badge deleted successfully'
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;