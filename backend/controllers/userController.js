const User = require('../models/User');
const Course = require('../models/Course');
const Badge = require('../models/Badge');
const Attendance = require('../models/Attendance');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// @desc    Complete introduction/profile setup
// @route   PUT /api/users/complete-profile
// @access  Private
exports.completeProfile = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const {
            age,
            gender,
            educationalBackground,
            currentField,
            learningPreferences,
            weeklyTimeCommitment
        } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update profile fields
        user.age = age;
        user.gender = gender;
        user.educationalBackground = educationalBackground;
        user.currentField = currentField;
        user.learningPreferences = learningPreferences;
        user.weeklyTimeCommitment = weeklyTimeCommitment;
        user.isProfileComplete = true;

        await user.save();

        // Award first badge for completing profile
        await awardBadge(user._id, 'profile-complete');

        res.status(200).json({
            success: true,
            message: 'Profile completed successfully',
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    profilePicture: user.profilePicture,
                    age: user.age,
                    gender: user.gender,
                    educationalBackground: user.educationalBackground,
                    currentField: user.currentField,
                    learningPreferences: user.learningPreferences,
                    weeklyTimeCommitment: user.weeklyTimeCommitment,
                    isProfileComplete: user.isProfileComplete,
                    placementTestCompleted: user.placementTestCompleted
                },
                nextStep: user.placementTestCompleted ? 'dashboard' : 'placement-test'
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const allowedUpdates = [
            'fullName',
            'age',
            'gender',
            'educationalBackground',
            'currentField',
            'learningPreferences',
            'weeklyTimeCommitment'
        ];

        const updates = {};
        
        // Only include allowed fields that are present in request
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    profilePicture: user.profilePicture,
                    age: user.age,
                    gender: user.gender,
                    educationalBackground: user.educationalBackground,
                    currentField: user.currentField,
                    learningPreferences: user.learningPreferences,
                    weeklyTimeCommitment: user.weeklyTimeCommitment,
                    isProfileComplete: user.isProfileComplete
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Update profile picture
// @route   PUT /api/users/profile-picture
// @access  Private
exports.updateProfilePicture = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image file'
            });
        }

        const user = await User.findById(req.user.id);

        // Delete old profile picture if it's not the default
        if (user.profilePicture && user.profilePicture !== 'default-avatar.png') {
            const oldPath = path.join(__dirname, '../uploads/profiles', user.profilePicture);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        // Update with new picture
        user.profilePicture = req.file.filename;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile picture updated successfully',
            data: {
                profilePicture: user.profilePicture,
                profilePictureUrl: `/uploads/profiles/${user.profilePicture}`
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('badges.badge')
            .populate('currentCourse')
            .populate('completedCourses.course');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Calculate completion percentage
        let profileCompletionPercentage = 0;
        const profileFields = [
            'fullName', 'email', 'profilePicture', 'age', 'gender',
            'educationalBackground', 'currentField', 'learningPreferences',
            'weeklyTimeCommitment'
        ];

        profileFields.forEach(field => {
            if (user[field] && (Array.isArray(user[field]) ? user[field].length > 0 : true)) {
                profileCompletionPercentage += (100 / profileFields.length);
            }
        });

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    profilePicture: user.profilePicture,
                    profilePictureUrl: `/uploads/profiles/${user.profilePicture}`,
                    age: user.age,
                    gender: user.gender,
                    educationalBackground: user.educationalBackground,
                    currentField: user.currentField,
                    learningPreferences: user.learningPreferences,
                    weeklyTimeCommitment: user.weeklyTimeCommitment,
                    role: user.role,
                    isProfileComplete: user.isProfileComplete,
                    profileCompletionPercentage: Math.round(profileCompletionPercentage),
                    placementTestCompleted: user.placementTestCompleted,
                    placementTestScore: user.placementTestScore,
                    assignedLevel: user.assignedLevel,
                    levelAssignedDate: user.levelAssignedDate,
                    strengthAreas: user.strengthAreas,
                    improvementAreas: user.improvementAreas,
                    currentCourse: user.currentCourse,
                    completedCourses: user.completedCourses,
                    currentModuleIndex: user.currentModuleIndex,
                    currentStreak: user.currentStreak,
                    longestStreak: user.longestStreak,
                    totalLoginDays: user.totalLoginDays,
                    totalTimeSpent: user.totalTimeSpent,
                    points: user.points,
                    badges: user.badges,
                    certificates: user.certificates,
                    recommendationLetter: user.recommendationLetter,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
exports.getDashboard = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('badges.badge')
            .populate('currentCourse')
            .populate({
                path: 'moduleProgress.moduleId',
                select: 'title weekNumber'
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get recent attendance data
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentAttendance = await Attendance.find({
            user: req.user.id,
            date: { $gte: sevenDaysAgo }
        }).sort({ date: -1 });

        // Calculate weekly stats
        const weeklyStats = {
            daysActive: recentAttendance.length,
            totalTime: recentAttendance.reduce((sum, att) => sum + (att.duration || 0), 0),
            activitiesCompleted: recentAttendance.reduce((sum, att) => 
                sum + (att.activitiesCompleted?.length || 0), 0)
        };

        // Get course progress
        let courseProgress = null;
        if (user.currentCourse) {
            const totalModules = user.currentCourse.modules?.length || 0;
            const completedModules = user.moduleProgress.filter(m => m.isCompleted).length;
            courseProgress = {
                courseId: user.currentCourse._id,
                courseName: user.currentCourse.title,
                level: user.currentCourse.level,
                totalModules,
                completedModules,
                progressPercentage: totalModules > 0 
                    ? Math.round((completedModules / totalModules) * 100) 
                    : 0,
                currentModuleIndex: user.currentModuleIndex
            };
        }

        // Get recent badges
        const recentBadges = user.badges
            .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
            .slice(0, 5);

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    profilePicture: user.profilePicture,
                    assignedLevel: user.assignedLevel,
                    points: user.points
                },
                streaks: {
                    current: user.currentStreak,
                    longest: user.longestStreak,
                    totalLoginDays: user.totalLoginDays
                },
                weeklyStats,
                courseProgress,
                recentBadges,
                totalBadges: user.badges.length,
                totalCertificates: user.certificates.length,
                isEligibleForRecommendation: user.recommendationLetter?.isEligible || false
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get user statistics
// @route   GET /api/users/statistics
// @access  Private
exports.getStatistics = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('completedCourses.course')
            .populate('badges.badge');

        // Get all attendance records for charts
        const attendanceRecords = await Attendance.find({ user: req.user.id })
            .sort({ date: 1 });

        // Calculate monthly activity
        const monthlyActivity = {};
        attendanceRecords.forEach(record => {
            const monthYear = new Date(record.date).toISOString().slice(0, 7);
            if (!monthlyActivity[monthYear]) {
                monthlyActivity[monthYear] = {
                    daysActive: 0,
                    timeSpent: 0,
                    activities: 0
                };
            }
            monthlyActivity[monthYear].daysActive += 1;
            monthlyActivity[monthYear].timeSpent += record.duration || 0;
            monthlyActivity[monthYear].activities += record.activitiesCompleted?.length || 0;
        });

        // Calculate badge statistics
        const badgeStats = {
            total: user.badges.length,
            byCategory: {}
        };

        user.badges.forEach(b => {
            const category = b.badge?.category || 'unknown';
            badgeStats.byCategory[category] = (badgeStats.byCategory[category] || 0) + 1;
        });

        // Learning statistics
        const learningStats = {
            totalTimeSpent: user.totalTimeSpent,
            averageSessionTime: attendanceRecords.length > 0
                ? Math.round(user.totalTimeSpent / attendanceRecords.length)
                : 0,
            totalModulesCompleted: user.moduleProgress.filter(m => m.isCompleted).length,
            totalCoursesCompleted: user.completedCourses.length,
            averageQuizScore: calculateAverageQuizScore(user.moduleProgress)
        };

        res.status(200).json({
            success: true,
            data: {
                monthlyActivity: Object.entries(monthlyActivity).map(([month, data]) => ({
                    month,
                    ...data
                })),
                streakHistory: {
                    current: user.currentStreak,
                    longest: user.longestStreak,
                    totalLoginDays: user.totalLoginDays
                },
                badgeStats,
                learningStats,
                points: user.points,
                levelProgress: {
                    currentLevel: user.assignedLevel,
                    levelStartDate: user.levelAssignedDate
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get user activity feed
// @route   GET /api/users/activity
// @access  Private
exports.getActivityFeed = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const skip = (page - 1) * limit;

        // Aggregate activities from various sources
        const activities = [];

        // Get badge earnings
        const user = await User.findById(req.user.id).populate('badges.badge');
        user.badges.forEach(b => {
            activities.push({
                type: 'badge_earned',
                title: `Earned "${b.badge?.name}" badge`,
                description: b.badge?.description,
                icon: b.badge?.icon,
                timestamp: b.earnedAt
            });
        });

        // Get attendance records
        const attendanceRecords = await Attendance.find({ user: req.user.id })
            .populate('modulesAccessed', 'title')
            .sort({ date: -1 })
            .limit(50);

        attendanceRecords.forEach(record => {
            if (record.activitiesCompleted?.length > 0) {
                record.activitiesCompleted.forEach(activity => {
                    activities.push({
                        type: activity.type,
                        title: `Completed ${activity.type}`,
                        timestamp: activity.completedAt
                    });
                });
            }
        });

        // Sort all activities by timestamp
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Paginate
        const paginatedActivities = activities.slice(skip, skip + limit);

        res.status(200).json({
            success: true,
            data: {
                activities: paginatedActivities,
                pagination: {
                    page,
                    limit,
                    total: activities.length,
                    pages: Math.ceil(activities.length / limit)
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Private
exports.getLeaderboard = async (req, res, next) => {
    try {
        const { type = 'points', limit = 10 } = req.query;

        let sortField;
        switch (type) {
            case 'streak':
                sortField = 'currentStreak';
                break;
            case 'badges':
                sortField = 'badges';
                break;
            case 'time':
                sortField = 'totalTimeSpent';
                break;
            default:
                sortField = 'points';
        }

        let leaderboard;

        if (type === 'badges') {
            // Special aggregation for badge count
            leaderboard = await User.aggregate([
                { $match: { role: 'student', isActive: true } },
                {
                    $project: {
                        fullName: 1,
                        profilePicture: 1,
                        assignedLevel: 1,
                        badgeCount: { $size: '$badges' },
                        points: 1
                    }
                },
                { $sort: { badgeCount: -1 } },
                { $limit: parseInt(limit) }
            ]);
        } else {
            leaderboard = await User.find({ role: 'student', isActive: true })
                .select('fullName profilePicture assignedLevel points currentStreak totalTimeSpent')
                .sort({ [sortField]: -1 })
                .limit(parseInt(limit));
        }

        // Add rank to each user
        const rankedLeaderboard = leaderboard.map((user, index) => ({
            rank: index + 1,
            id: user._id,
            fullName: user.fullName,
            profilePicture: user.profilePicture,
            assignedLevel: user.assignedLevel,
            points: user.points,
            currentStreak: user.currentStreak,
            totalTimeSpent: user.totalTimeSpent,
            badgeCount: user.badgeCount || user.badges?.length || 0
        }));

        // Find current user's rank
        const currentUser = await User.findById(req.user.id);
        let userRank = null;

        if (type === 'badges') {
            const userBadgeCount = currentUser.badges.length;
            const higherRanked = await User.countDocuments({
                role: 'student',
                isActive: true,
                $expr: { $gt: [{ $size: '$badges' }, userBadgeCount] }
            });
            userRank = higherRanked + 1;
        } else {
            const userValue = currentUser[sortField];
            const higherRanked = await User.countDocuments({
                role: 'student',
                isActive: true,
                [sortField]: { $gt: userValue }
            });
            userRank = higherRanked + 1;
        }

        res.status(200).json({
            success: true,
            data: {
                leaderboard: rankedLeaderboard,
                currentUserRank: {
                    rank: userRank,
                    id: currentUser._id,
                    fullName: currentUser.fullName,
                    profilePicture: currentUser.profilePicture,
                    points: currentUser.points,
                    currentStreak: currentUser.currentStreak,
                    badgeCount: currentUser.badges.length
                },
                type
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Update learning preferences
// @route   PUT /api/users/learning-preferences
// @access  Private
exports.updateLearningPreferences = async (req, res, next) => {
    try {
        const { learningPreferences, weeklyTimeCommitment } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                learningPreferences,
                weeklyTimeCommitment
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Learning preferences updated successfully',
            data: {
                learningPreferences: user.learningPreferences,
                weeklyTimeCommitment: user.weeklyTimeCommitment
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Deactivate account
// @route   PUT /api/users/deactivate
// @access  Private
exports.deactivateAccount = async (req, res, next) => {
    try {
        const { password } = req.body;

        const user = await User.findById(req.user.id).select('+password');

        // Verify password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Password is incorrect'
            });
        }

        user.isActive = false;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Account deactivated successfully'
        });

    } catch (error) {
        next(error);
    }
};

// Helper function to award badge
async function awardBadge(userId, badgeName) {
    try {
        const badge = await Badge.findOne({ name: badgeName });
        if (!badge) return;

        const user = await User.findById(userId);
        
        // Check if user already has this badge
        const hasBadge = user.badges.some(b => b.badge.toString() === badge._id.toString());
        if (hasBadge) return;

        user.badges.push({
            badge: badge._id,
            earnedAt: new Date()
        });
        user.points += badge.points;
        await user.save();

        return badge;
    } catch (error) {
        console.error('Error awarding badge:', error);
    }
}

// Helper function to calculate average quiz score
function calculateAverageQuizScore(moduleProgress) {
    const allScores = [];
    moduleProgress.forEach(m => {
        if (m.quizScores && m.quizScores.length > 0) {
            allScores.push(...m.quizScores);
        }
    });
    
    if (allScores.length === 0) return 0;
    return Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
}

module.exports = exports;