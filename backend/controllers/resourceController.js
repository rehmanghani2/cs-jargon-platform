const Resource = require('../models/Resource');
const LearningPathway = require('../models/LearningPathway');
const User = require('../models/User');
const Notification = require('../models/Notification');

// =================== RESOURCES ===================

// @desc    Get all resources
// @route   GET /api/resources
// @access  Private
exports.getResources = async (req, res, next) => {
    try {
        const {
            type,
            category,
            difficulty,
            pathway,
            search,
            featured,
            recommended,
            sortBy = 'rating',
            order = 'desc',
            page = 1,
            limit = 20
        } = req.query;

        const filter = { isActive: true };

        if (type) filter.type = type;
        if (category) filter.category = category;
        if (difficulty) filter.difficulty = difficulty;
        if (pathway) filter.pathway = pathway;
        if (featured === 'true') filter.isFeatured = true;
        if (recommended === 'true') filter.isRecommended = true;

        // Search
        if (search && search.trim()) {
            filter.$text = { $search: search.trim() };
        }

        const total = await Resource.countDocuments(filter);

        // Sort options
        let sortOptions = {};
        switch (sortBy) {
            case 'rating':
                sortOptions = { 'rating.average': order === 'desc' ? -1 : 1 };
                break;
            case 'popular':
                sortOptions = { viewCount: order === 'desc' ? -1 : 1 };
                break;
            case 'newest':
                sortOptions = { createdAt: order === 'desc' ? -1 : 1 };
                break;
            case 'saved':
                sortOptions = { savedCount: order === 'desc' ? -1 : 1 };
                break;
            default:
                sortOptions = { 'rating.average': -1 };
        }

        const resources = await Resource.find(filter)
            .populate('relatedJargons', 'term')
            .populate('relatedCourse', 'title level')
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Add saved status for current user
        const resourcesWithStatus = resources.map(resource => ({
            ...resource.toObject(),
            isSaved: resource.savedBy.some(id => id.toString() === req.user.id)
        }));

        res.status(200).json({
            success: true,
            count: resources.length,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            },
            data: { resources: resourcesWithStatus }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get single resource
// @route   GET /api/resources/:id
// @access  Private
exports.getResource = async (req, res, next) => {
    try {
        const resource = await Resource.findById(req.params.id)
            .populate('relatedJargons', 'term definition.simple')
            .populate('relatedCourse', 'title level')
            .populate('relatedResources', 'title type thumbnail')
            .populate('reviews.user', 'fullName profilePicture')
            .populate('addedBy', 'fullName')
            .populate('verifiedBy', 'fullName');

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: 'Resource not found'
            });
        }

        // Increment view count
        resource.viewCount += 1;
        await resource.save();

        // Check if saved
        const isSaved = resource.savedBy.some(
            id => id.toString() === req.user.id
        );

        // Check if user has reviewed
        const userReview = resource.reviews.find(
            r => r.user._id.toString() === req.user.id
        );

        res.status(200).json({
            success: true,
            data: {
                resource: {
                    ...resource.toObject(),
                    isSaved,
                    userReview
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get resources by type
// @route   GET /api/resources/type/:type
// @access  Private
exports.getResourcesByType = async (req, res, next) => {
    try {
        const { type } = req.params;
        const { category, difficulty, page = 1, limit = 20 } = req.query;

        const filter = { type, isActive: true };
        if (category) filter.category = category;
        if (difficulty) filter.difficulty = difficulty;

        const total = await Resource.countDocuments(filter);

        const resources = await Resource.find(filter)
            .populate('relatedJargons', 'term')
            .sort({ 'rating.average': -1, viewCount: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            count: resources.length,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            },
            data: { resources }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Save/unsave resource
// @route   POST /api/resources/:id/save
// @access  Private
exports.toggleSaveResource = async (req, res, next) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: 'Resource not found'
            });
        }

        const savedIndex = resource.savedBy.findIndex(
            id => id.toString() === req.user.id
        );

        let message;
        if (savedIndex === -1) {
            // Save
            resource.savedBy.push(req.user.id);
            message = 'Resource saved to your library';
        } else {
            // Unsave
            resource.savedBy.splice(savedIndex, 1);
            message = 'Resource removed from your library';
        }

        resource.savedCount = resource.savedBy.length;
        await resource.save();

        res.status(200).json({
            success: true,
            message,
            data: {
                isSaved: savedIndex === -1,
                savedCount: resource.savedCount
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get saved resources
// @route   GET /api/resources/saved
// @access  Private
exports.getSavedResources = async (req, res, next) => {
    try {
        const { type, page = 1, limit = 20 } = req.query;

        const filter = {
            savedBy: req.user.id,
            isActive: true
        };

        if (type) filter.type = type;

        const total = await Resource.countDocuments(filter);

        const resources = await Resource.find(filter)
            .sort({ updatedAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            count: resources.length,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            },
            data: { resources }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Add review to resource
// @route   POST /api/resources/:id/review
// @access  Private
exports.addReview = async (req, res, next) => {
    try {
        const { rating, review } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: 'Resource not found'
            });
        }

        // Check if already reviewed
        const existingReview = resource.reviews.find(
            r => r.user.toString() === req.user.id
        );

        if (existingReview) {
            // Update existing review
            existingReview.rating = rating;
            existingReview.review = review;
            existingReview.createdAt = new Date();
        } else {
            // Add new review
            resource.reviews.push({
                user: req.user.id,
                rating,
                review,
                createdAt: new Date()
            });
        }

        // Recalculate rating
        resource.calculateRating();
        await resource.save();

        res.status(200).json({
            success: true,
            message: existingReview ? 'Review updated' : 'Review added',
            data: {
                rating: resource.rating
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Track resource click
// @route   POST /api/resources/:id/click
// @access  Private
exports.trackClick = async (req, res, next) => {
    try {
        await Resource.findByIdAndUpdate(req.params.id, {
            $inc: { clickCount: 1 }
        });

        res.status(200).json({
            success: true,
            message: 'Click tracked'
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get resource categories with counts
// @route   GET /api/resources/categories
// @access  Private
exports.getResourceCategories = async (req, res, next) => {
    try {
        const categories = await Resource.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        const types = await Resource.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                categories,
                types
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get suggested apps/tools
// @route   GET /api/resources/apps
// @access  Private
exports.getSuggestedApps = async (req, res, next) => {
    try {
        const apps = await Resource.find({
            type: { $in: ['app', 'tool'] },
            isActive: true,
            isRecommended: true
        })
        .sort({ 'rating.average': -1 })
        .limit(10);

        // Group by purpose
        const groupedApps = {
            flashcards: apps.filter(a => a.tags?.includes('flashcards')),
            writing: apps.filter(a => a.tags?.includes('writing')),
            coding: apps.filter(a => a.tags?.includes('coding')),
            productivity: apps.filter(a => a.tags?.includes('productivity')),
            other: apps.filter(a => 
                !a.tags?.includes('flashcards') && 
                !a.tags?.includes('writing') && 
                !a.tags?.includes('coding') && 
                !a.tags?.includes('productivity')
            )
        };

        res.status(200).json({
            success: true,
            data: {
                apps,
                grouped: groupedApps
            }
        });

    } catch (error) {
        next(error);
    }
};

// =================== LEARNING PATHWAYS ===================

// @desc    Get all learning pathways
// @route   GET /api/resources/pathways
// @access  Private
exports.getPathways = async (req, res, next) => {
    try {
        const { category, level, featured, page = 1, limit = 10 } = req.query;

        const filter = { status: 'published' };

        if (category) filter.category = category;
        if (level) filter.targetLevel = level;
        if (featured === 'true') filter.isFeatured = true;

        const total = await LearningPathway.countDocuments(filter);

        const pathways = await LearningPathway.find(filter)
            .populate('relatedCourse', 'title level')
            .populate('badgeOffered', 'name icon')
            .sort({ isFeatured: -1, enrollmentCount: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Add enrollment status
        const pathwaysWithStatus = pathways.map(pathway => {
            const enrollment = pathway.enrolledUsers.find(
                e => e.user.toString() === req.user.id
            );
            return {
                ...pathway.toObject(),
                isEnrolled: !!enrollment,
                userProgress: enrollment ? {
                    currentStep: enrollment.currentStep,
                    progress: enrollment.progress,
                    completedSteps: enrollment.completedSteps.length
                } : null
            };
        });

        res.status(200).json({
            success: true,
            count: pathways.length,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            },
            data: { pathways: pathwaysWithStatus }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get single pathway
// @route   GET /api/resources/pathways/:id
// @access  Private
exports.getPathway = async (req, res, next) => {
    try {
        const pathway = await LearningPathway.findById(req.params.id)
            .populate('relatedCourse', 'title level')
            .populate('relatedJargons', 'term definition.simple')
            .populate('badgeOffered', 'name icon description')
            .populate('steps.jargon', 'term definition.simple')
            .populate('steps.module', 'title description')
            .populate('steps.resource', 'title type url')
            .populate('createdBy', 'fullName');

        if (!pathway) {
            return res.status(404).json({
                success: false,
                message: 'Learning pathway not found'
            });
        }

        // Check enrollment
        const enrollment = pathway.enrolledUsers.find(
            e => e.user.toString() === req.user.id
        );

        res.status(200).json({
            success: true,
            data: {
                pathway: {
                    ...pathway.toObject(),
                    isEnrolled: !!enrollment,
                    userProgress: enrollment ? {
                        currentStep: enrollment.currentStep,
                        progress: enrollment.progress,
                        completedSteps: enrollment.completedSteps,
                        pointsEarned: enrollment.pointsEarned,
                        enrolledAt: enrollment.enrolledAt
                    } : null
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Enroll in pathway
// @route   POST /api/resources/pathways/:id/enroll
// @access  Private
exports.enrollInPathway = async (req, res, next) => {
    try {
        const pathway = await LearningPathway.findById(req.params.id);

        if (!pathway) {
            return res.status(404).json({
                success: false,
                message: 'Learning pathway not found'
            });
        }

        // Check if already enrolled
        const isEnrolled = pathway.enrolledUsers.some(
            e => e.user.toString() === req.user.id
        );

        if (isEnrolled) {
            return res.status(400).json({
                success: false,
                message: 'You are already enrolled in this pathway'
            });
        }

        // Enroll
        pathway.enrolledUsers.push({
            user: req.user.id,
            enrolledAt: new Date(),
            completedSteps: [],
            currentStep: 0,
            progress: 0,
            pointsEarned: 0
        });

        await pathway.save();

        // Create notification
        await Notification.create({
            recipient: req.user.id,
            type: 'announcement',
            title: 'Pathway Enrollment! 🛤️',
            message: `You've enrolled in the "${pathway.title}" learning pathway. Start your journey now!`,
            link: `/pathways/${pathway._id}`,
            priority: 'medium'
        });

        res.status(200).json({
            success: true,
            message: 'Successfully enrolled in pathway',
            data: {
                pathwayId: pathway._id,
                title: pathway.title,
                totalSteps: pathway.totalSteps
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Complete pathway step
// @route   POST /api/resources/pathways/:id/complete-step
// @access  Private
exports.completePathwayStep = async (req, res, next) => {
    try {
        const { stepOrder } = req.body;

        const pathway = await LearningPathway.findById(req.params.id);

        if (!pathway) {
            return res.status(404).json({
                success: false,
                message: 'Learning pathway not found'
            });
        }

        // Find enrollment
        const enrollment = pathway.enrolledUsers.find(
            e => e.user.toString() === req.user.id
        );

        if (!enrollment) {
            return res.status(400).json({
                success: false,
                message: 'You are not enrolled in this pathway'
            });
        }

        // Check if step exists
        const step = pathway.steps.find(s => s.order === stepOrder);
        if (!step) {
            return res.status(400).json({
                success: false,
                message: 'Invalid step'
            });
        }

        // Check if already completed
        if (enrollment.completedSteps.includes(stepOrder)) {
            return res.status(400).json({
                success: false,
                message: 'Step already completed'
            });
        }

        // Complete step
        enrollment.completedSteps.push(stepOrder);
        enrollment.currentStep = Math.max(...enrollment.completedSteps) + 1;
        enrollment.pointsEarned += step.points || 10;
        enrollment.progress = Math.round(
            (enrollment.completedSteps.length / pathway.totalSteps) * 100
        );

        // Check if pathway completed
        if (enrollment.completedSteps.length >= pathway.totalSteps) {
            enrollment.completedAt = new Date();

            // Award badge if offered
            if (pathway.badgeOffered) {
                const BadgeService = require('../services/badgeService');
                await BadgeService.awardBadge(req.user.id, pathway.badgeOffered);
            }

            // Create completion notification
            await Notification.create({
                recipient: req.user.id,
                type: 'badge-earned',
                title: 'Pathway Completed! 🎉',
                message: `Congratulations! You've completed the "${pathway.title}" learning pathway!`,
                link: `/pathways/${pathway._id}`,
                priority: 'high'
            });
        }

        await pathway.save();

        // Update user points
        await User.findByIdAndUpdate(req.user.id, {
            $inc: { points: step.points || 10 }
        });

        res.status(200).json({
            success: true,
            message: 'Step completed',
            data: {
                completedSteps: enrollment.completedSteps.length,
                totalSteps: pathway.totalSteps,
                progress: enrollment.progress,
                pointsEarned: step.points || 10,
                isCompleted: !!enrollment.completedAt
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get user's enrolled pathways
// @route   GET /api/resources/pathways/enrolled
// @access  Private
exports.getEnrolledPathways = async (req, res, next) => {
    try {
        const pathways = await LearningPathway.find({
            'enrolledUsers.user': req.user.id
        })
        .select('title category targetLevel estimatedDuration totalSteps enrolledUsers thumbnail')
        .sort({ updatedAt: -1 });

        const enrolledPathways = pathways.map(pathway => {
            const enrollment = pathway.enrolledUsers.find(
                e => e.user.toString() === req.user.id
            );
            return {
                _id: pathway._id,
                title: pathway.title,
                category: pathway.category,
                targetLevel: pathway.targetLevel,
                estimatedDuration: pathway.estimatedDuration,
                totalSteps: pathway.totalSteps,
                thumbnail: pathway.thumbnail,
                progress: enrollment.progress,
                currentStep: enrollment.currentStep,
                completedSteps: enrollment.completedSteps.length,
                isCompleted: !!enrollment.completedAt,
                enrolledAt: enrollment.enrolledAt
            };
        });

        res.status(200).json({
            success: true,
            count: enrolledPathways.length,
            data: { pathways: enrolledPathways }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = exports;