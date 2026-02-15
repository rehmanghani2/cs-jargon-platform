const Attendance = require('../models/Attendance');
const User = require('../models/User');
const BadgeService = require('../services/badgeService');
const { getWeekNumber } = require('./helpers');

// Helper: get start-of-day Date
function getStartOfDay(date = new Date()) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

class AttendanceService {
    // Start a session (called when user logs in or opens app)
    static async startSession(userId) {
        const now = new Date();
        const today = getStartOfDay(now);

        const user = await User.findById(userId);
        if (!user) return null;

        // Find or create today's attendance record
        let attendance = await Attendance.findOne({ user: userId, date: today });

        if (!attendance) {
            attendance = await Attendance.create({
                user: userId,
                date: today,
                loginTime: now,
                duration: 0,
                activitiesCompleted: [],
                modulesAccessed: [],
                jargonsViewed: []
            });
        } else {
            // If no login time recorded yet for today, set it
            if (!attendance.loginTime) {
                attendance.loginTime = now;
                await attendance.save();
            }
        }

        // Award login-related badges (first-login, early-bird, night-owl, etc.)
        await BadgeService.checkAndAwardBadges(userId, 'login');
        // Award streak badges if applicable (currentStreak should already be updated in auth)
        await BadgeService.checkAndAwardBadges(userId, 'streak');

        return attendance;
    }

    // End a session (client sends how many minutes they were active this session)
    static async endSession(userId, sessionMinutes = 0) {
        const now = new Date();
        const today = getStartOfDay(now);

        const user = await User.findById(userId);
        if (!user) return null;

        let attendance = await Attendance.findOne({ user: userId, date: today });

        // If no record for today, create one (edge case)
        if (!attendance) {
            attendance = await Attendance.create({
                user: userId,
                date: today,
                loginTime: now,
                duration: 0,
                activitiesCompleted: [],
                modulesAccessed: [],
                jargonsViewed: []
            });
        }

        // Update duration (in minutes)
        const addMinutes = Number(sessionMinutes) || 0;
        attendance.duration = (attendance.duration || 0) + addMinutes;
        attendance.logoutTime = now;
        await attendance.save();

        // Update user total time spent (in minutes)
        user.totalTimeSpent = (user.totalTimeSpent || 0) + addMinutes;
        await user.save();

        // Award time-spent badges
        await BadgeService.checkAndAwardBadges(userId, 'time-spent');

        return attendance;
    }

    // Record an activity (lesson, quiz, assignment, flashcard, library)
    static async recordActivity(userId, { type, itemId = null, moduleId = null, jargonId = null }) {
        const now = new Date();
        const today = getStartOfDay(now);

        let attendance = await Attendance.findOne({ user: userId, date: today });

        if (!attendance) {
            // If no attendance, start a session implicitly
            attendance = await Attendance.create({
                user: userId,
                date: today,
                loginTime: now,
                duration: 0,
                activitiesCompleted: [],
                modulesAccessed: [],
                jargonsViewed: []
            });
        }

        // Add activity record
        attendance.activitiesCompleted.push({
            type,
            itemId,
            completedAt: now
        });

        // Track modules accessed (unique)
        if (moduleId) {
            const exists = attendance.modulesAccessed.some(
                m => m.toString() === moduleId.toString()
            );
            if (!exists) {
                attendance.modulesAccessed.push(moduleId);
            }
        }

        // Track jargons viewed (unique)
        if (jargonId) {
            const exists = attendance.jargonsViewed.some(
                j => j.toString() === jargonId.toString()
            );
            if (!exists) {
                attendance.jargonsViewed.push(jargonId);
            }
        }

        await attendance.save();
        return attendance;
    }

    // Get attendance summary for a user
    static async getSummary(userId) {
        const user = await User.findById(userId);
        if (!user) return null;

        const allRecords = await Attendance.find({ user: userId }).sort({ date: 1 });

        const totalDaysActive = allRecords.length;
        const totalMinutes = allRecords.reduce((sum, r) => sum + (r.duration || 0), 0);

        // Last 7 days stats
        const sevenDaysAgo = getStartOfDay(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000));
        const last7Records = allRecords.filter(r => r.date >= sevenDaysAgo);
        const last7DaysActive = last7Records.length;
        const last7Minutes = last7Records.reduce((sum, r) => sum + (r.duration || 0), 0);

        // Current week label (ISO week)
        const currentWeek = getWeekNumber(new Date());

        return {
            user: {
                id: user._id,
                fullName: user.fullName
            },
            totals: {
                totalDaysActive,
                totalMinutes,
                totalHours: +(totalMinutes / 60).toFixed(1)
            },
            last7Days: {
                daysActive: last7DaysActive,
                totalMinutes: last7Minutes,
                totalHours: +(last7Minutes / 60).toFixed(1),
                message: `You studied ${last7DaysActive}/7 days in the last week`
            },
            streaks: {
                currentStreak: user.currentStreak,
                longestStreak: user.longestStreak,
                totalLoginDays: user.totalLoginDays
            },
            currentWeek
        };
    }

    // Get detailed daily records for last N days (default 7)
    static async getDailyRecords(userId, days = 7) {
        const end = getStartOfDay(new Date());
        const start = getStartOfDay(new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000));

        const records = await Attendance.find({
            user: userId,
            date: { $gte: start, $lte: end }
        }).sort({ date: 1 });

        // Build a complete list of days, even if no record
        const result = [];
        for (let i = 0; i < days; i++) {
            const d = getStartOfDay(new Date(start.getTime() + i * 24 * 60 * 60 * 1000));
            const rec = records.find(r => r.date.getTime() === d.getTime());

            result.push({
                date: d,
                isoDate: d.toISOString().slice(0, 10),
                weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
                minutes: rec ? rec.duration || 0 : 0,
                activitiesCount: rec ? (rec.activitiesCompleted?.length || 0) : 0
            });
        }

        return result;
    }
}

module.exports = AttendanceService;