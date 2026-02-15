const User = require('../models/User');
const StreakService = require('../services/streakService');
const StreakFreeze = require('../models/StreakFreeze');
const WeeklyReport = require('../models/WeeklyReport');

// @desc    Get user's streak info
// @route   GET /api/streaks
// @access  Private
exports.getStreakInfo = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get available freezes
        const freezes = await StreakService.getAvailableFreezes(req.user.id);

        // Get milestones
        const milestones = StreakService.getStreakMilestones();
        
        // Find next milestone
        const nextMilestone = milestones.find(m => m.days > user.currentStreak);
        const daysToNextMilestone = nextMilestone 
            ? nextMilestone.days - user.currentStreak 
            : 0;

        // Calculate streak percentage to next milestone
        const prevMilestone = [...milestones].reverse().find(m => m.days <= user.currentStreak);
        let progressToNextMilestone = 0;
        if (nextMilestone && prevMilestone) {
            const range = nextMilestone.days - prevMilestone.days;
            const current = user.currentStreak - prevMilestone.days;
            progressToNextMilestone = Math.round((current / range) * 100);
        } else if (nextMilestone) {
            progressToNextMilestone = Math.round((user.currentStreak / nextMilestone.days) * 100);
        }

        res.status(200).json({
            success: true,
            data: {
                currentStreak: user.currentStreak,
                longestStreak: user.longestStreak,
                totalLoginDays: user.totalLoginDays,
                lastLoginDate: user.lastLoginDate,
                freezesAvailable: freezes.length,
                freezes: freezes.map(f => ({
                    id: f._id,
                    reason: f.reason,
                    expiresAt: f.expiresAt,
                    createdAt: f.createdAt
                })),
                milestones: {
                    achieved: milestones.filter(m => m.days <= user.currentStreak),
                    next: nextMilestone,
                    daysToNext: daysToNextMilestone,
                    progressPercentage: progressToNextMilestone
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Purchase streak freeze
// @route   POST /api/streaks/purchase-freeze
// @access  Private
exports.purchaseStreakFreeze = async (req, res, next) => {
    try {
        const result = await StreakService.purchaseStreakFreeze(req.user.id);

        res.status(200).json({
            success: true,
            message: 'Streak freeze purchased successfully!',
            data: {
                freeze: {
                    id: result.freeze._id,
                    expiresAt: result.freeze.expiresAt
                },
                remainingPoints: result.remainingPoints
            }
        });

    } catch (error) {
        if (error.message.includes('Not enough points')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
};

// @desc    Get activity heatmap
// @route   GET /api/streaks/heatmap
// @access  Private
exports.getActivityHeatmap = async (req, res, next) => {
    try {
        const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
        
        const heatmapData = await StreakService.getActivityHeatmap(req.user.id, year);

        res.status(200).json({
            success: true,
            data: heatmapData
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get weekly reports
// @route   GET /api/streaks/weekly-reports
// @access  Private
exports.getWeeklyReports = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 12;
        const skip = (page - 1) * limit;

        const total = await WeeklyReport.countDocuments({ user: req.user.id });

        const reports = await WeeklyReport.find({ user: req.user.id })
            .sort({ weekStartDate: -1 })
            .skip(skip)
            .limit(limit)
            .select('-dailyActivity'); // Exclude detailed daily for list view

        res.status(200).json({
            success: true,
            data: {
                reports,
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

// @desc    Get specific weekly report
// @route   GET /api/streaks/weekly-reports/:weekId
// @access  Private
exports.getWeeklyReport = async (req, res, next) => {
    try {
        const { weekId } = req.params;

        let report = await WeeklyReport.findOne({
            user: req.user.id,
            weekId
        }).populate('badgesEarned.badge');

        // If report doesn't exist, try to generate it
        if (!report) {
            report = await StreakService.generateWeeklyReport(req.user.id, weekId);
        }

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Weekly report not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { report }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get streak leaderboard
// @route   GET /api/streaks/leaderboard
// @access  Private
exports.getStreakLeaderboard = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 20;
        const type = req.query.type || 'current'; // 'current' or 'longest'

        const sortField = type === 'longest' ? 'longestStreak' : 'currentStreak';

        const leaderboard = await User.find({
            role: 'student',
            isActive: true
        })
        .select('fullName profilePicture currentStreak longestStreak totalLoginDays')
        .sort({ [sortField]: -1 })
        .limit(limit);

        // Add rank
        const rankedLeaderboard = leaderboard.map((user, index) => ({
            rank: index + 1,
            id: user._id,
            fullName: user.fullName,
            profilePicture: user.profilePicture,
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
            totalLoginDays: user.totalLoginDays
        }));

        // Find current user's rank
        const currentUser = await User.findById(req.user.id);
        const allUsers = await User.find({
            role: 'student',
            isActive: true,
            [sortField]: { $gt: currentUser[sortField] }
        }).countDocuments();
        
        const userRank = allUsers + 1;

        res.status(200).json({
            success: true,
            data: {
                leaderboard: rankedLeaderboard,
                currentUser: {
                    rank: userRank,
                    currentStreak: currentUser.currentStreak,
                    longestStreak: currentUser.longestStreak
                },
                type
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get motivational tips based on streak
// @route   GET /api/streaks/tips
// @access  Private
exports.getStreakTips = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const streak = user.currentStreak;

        let tips = [];
        let encouragement = '';

        if (streak === 0) {
            encouragement = "Today is the perfect day to start your streak! 🌟";
            tips = [
                "Start with just 5 minutes of learning",
                "Set a daily reminder on your phone",
                "Choose a consistent time each day",
                "Pair learning with an existing habit (like morning coffee)"
            ];
        } else if (streak < 7) {
            encouragement = `${streak} days strong! Keep building that momentum! 💪`;
            tips = [
                "You're building a habit - stay consistent!",
                `Only ${7 - streak} more days to your first week!`,
                "Short daily sessions beat long occasional ones",
                "Review yesterday's jargons before learning new ones"
            ];
        } else if (streak < 30) {
            encouragement = `${streak}-day streak! You're becoming a learning machine! 🚀`;
            tips = [
                "Great consistency! Consider increasing your daily time",
                `${30 - streak} days until your 1-month milestone!`,
                "Try teaching a jargon to someone else",
                "Your streak freeze is your safety net - you've earned it!"
            ];
        } else {
            encouragement = `Incredible ${streak}-day streak! You're an inspiration! 🏆`;
            tips = [
                "You've mastered consistency - focus on quality now",
                "Help newer learners on the platform",
                "Challenge yourself with advanced jargons",
                "Your dedication is truly remarkable!"
            ];
        }

        res.status(200).json({
            success: true,
            data: {
                currentStreak: streak,
                encouragement,
                tips,
                nextMilestone: StreakService.getStreakMilestones().find(m => m.days > streak)
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = exports;