const Attendance = require('../models/Attendance');
const User = require('../models/User');
const AttendanceService = require('../utils/attendanceService');
const { getWeekNumber } = require('../utils/helpers');

// @desc    Start attendance session (login/open app)
// @route   POST /api/attendance/session/start
// @access  Private
exports.startSession = async (req, res, next) => {
    try {
        const attendance = await AttendanceService.startSession(req.user.id);

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Session started',
            data: {
                date: attendance.date,
                loginTime: attendance.loginTime,
                durationMinutes: attendance.duration || 0
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    End attendance session (logout/close app)
// @route   POST /api/attendance/session/end
// @access  Private
exports.endSession = async (req, res, next) => {
    try {
        const { durationMinutes } = req.body;

        const attendance = await AttendanceService.endSession(
            req.user.id,
            durationMinutes
        );

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Session ended',
            data: {
                date: attendance.date,
                loginTime: attendance.loginTime,
                logoutTime: attendance.logoutTime,
                durationMinutes: attendance.duration
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Log a learning activity (lesson/quiz/assignment/etc.)
// @route   POST /api/attendance/activity
// @access  Private
exports.logActivity = async (req, res, next) => {
    try {
        const { type, itemId, moduleId, jargonId } = req.body;

        if (!type) {
            return res.status(400).json({
                success: false,
                message: 'Activity type is required'
            });
        }

        const validTypes = ['lesson', 'quiz', 'assignment', 'flashcard', 'library'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                message: `Invalid activity type. Must be one of: ${validTypes.join(', ')}`
            });
        }

        const attendance = await AttendanceService.recordActivity(req.user.id, {
            type,
            itemId,
            moduleId,
            jargonId
        });

        res.status(200).json({
            success: true,
            message: 'Activity logged',
            data: {
                date: attendance.date,
                totalActivities: attendance.activitiesCompleted.length
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get today's attendance
// @route   GET /api/attendance/today
// @access  Private
exports.getToday = async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOne({
            user: req.user.id,
            date: today
        });

        res.status(200).json({
            success: true,
            data: {
                hasRecord: !!attendance,
                attendance: attendance || null
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get attendance summary (totals + last 7 days)
// @route   GET /api/attendance/summary
// @access  Private
exports.getSummary = async (req, res, next) => {
    try {
        const summary = await AttendanceService.getSummary(req.user.id);

        if (!summary) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: summary
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get weekly activity (last N days, default 7)
// @route   GET /api/attendance/weekly
// @access  Private
exports.getWeeklyActivity = async (req, res, next) => {
    try {
        const days = parseInt(req.query.days, 10) || 7;
        const records = await AttendanceService.getDailyRecords(req.user.id, days);

        const totalMinutes = records.reduce((sum, r) => sum + r.minutes, 0);
        const daysActive = records.filter(r => r.minutes > 0).length;

        res.status(200).json({
            success: true,
            data: {
                daysRequested: days,
                daysActive,
                totalMinutes,
                totalHours: +(totalMinutes / 60).toFixed(1),
                records,
                message: `You studied ${daysActive}/${days} days in this period`
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get full attendance history (paginated)
// @route   GET /api/attendance/history
// @access  Private
exports.getHistory = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 30;
        const skip = (page - 1) * limit;

        const total = await Attendance.countDocuments({ user: req.user.id });

        const records = await Attendance.find({ user: req.user.id })
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .populate('modulesAccessed', 'title')
            .populate('jargonsViewed', 'term');

        res.status(200).json({
            success: true,
            data: {
                records,
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

// =================== ADMIN ENDPOINTS ===================

// @desc    Get a user's attendance (admin)
// @route   GET /api/attendance/admin/user/:userId
// @access  Private/Admin
exports.getUserAttendanceAdmin = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId).select('fullName email');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const total = await Attendance.countDocuments({ user: userId });
        const records = await Attendance.find({ user: userId })
            .sort({ date: -1 })
            .limit(90); // last 90 days

        const totalMinutes = records.reduce((sum, r) => sum + (r.duration || 0), 0);

        res.status(200).json({
            success: true,
            data: {
                user,
                summary: {
                    totalDaysActive: total,
                    totalMinutes,
                    totalHours: +(totalMinutes / 60).toFixed(1)
                },
                records
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get global attendance stats (admin)
// @route   GET /api/attendance/admin/stats
// @access  Private/Admin
exports.getGlobalStatsAdmin = async (req, res, next) => {
    try {
        const totalRecords = await Attendance.countDocuments({});
        const totalUsers = await User.countDocuments({ role: 'student', isActive: true });

        const recent30Days = new Date();
        recent30Days.setDate(recent30Days.getDate() - 30);
        recent30Days.setHours(0, 0, 0, 0);

        const recentRecords = await Attendance.find({
            date: { $gte: recent30Days }
        });

        const activeUsersSet = new Set(recentRecords.map(r => r.user.toString()));
        const totalMinutes = recentRecords.reduce((sum, r) => sum + (r.duration || 0), 0);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalRecords,
                activeUsersLast30Days: activeUsersSet.size,
                inactiveUsersLast30Days: Math.max(totalUsers - activeUsersSet.size, 0),
                totalMinutesLast30Days: totalMinutes,
                totalHoursLast30Days: +(totalMinutes / 60).toFixed(1)
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = exports;