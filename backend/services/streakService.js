const User = require('../models/User');
const Attendance = require('../models/Attendance');
const StreakFreeze = require('../models/StreakFreeze');
const WeeklyReport = require('../models/WeeklyReport');
const Badge = require('../models/Badge');
const Notification = require('../models/Notification');
const BadgeService = require('./badgeService');
const { sendEmail, emailTemplates } = require('../utils/emailService');
const { getWeekNumber } = require('../utils/helpers');

class StreakService {
    
    // Check and update streak for a user (called daily via cron)
    static async updateUserStreak(userId) {
        try {
            const user = await User.findById(userId);
            if (!user || !user.isActive) return null;

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            const lastLoginDate = user.lastLoginDate 
                ? new Date(user.lastLoginDate) 
                : null;

            if (lastLoginDate) {
                lastLoginDate.setHours(0, 0, 0, 0);
            }

            // Check if user logged in today
            const todayAttendance = await Attendance.findOne({
                user: userId,
                date: today
            });

            // Check if user logged in yesterday
            const yesterdayAttendance = await Attendance.findOne({
                user: userId,
                date: yesterday
            });

            // If logged in today, streak is already updated in auth middleware
            if (todayAttendance) {
                return user.currentStreak;
            }

            // If no login today but logged in yesterday, check for streak freeze
            if (yesterdayAttendance && !todayAttendance) {
                // User might still log in today, don't reset yet
                return user.currentStreak;
            }

            // If last login was more than 1 day ago, check for freeze or reset
            if (lastLoginDate && lastLoginDate < yesterday) {
                // Check for available streak freeze
                const freeze = await this.useStreakFreeze(userId);
                
                if (freeze) {
                    // Freeze used, maintain streak
                    await Notification.create({
                        recipient: userId,
                        type: 'streak-reminder',
                        title: 'Streak Freeze Used! 🧊',
                        message: `Your ${user.currentStreak}-day streak was preserved using a streak freeze.`,
                        priority: 'medium'
                    });
                    return user.currentStreak;
                }

                // No freeze available, reset streak
                const previousStreak = user.currentStreak;
                user.currentStreak = 0;
                await user.save();

                // Notify user about lost streak
                if (previousStreak >= 3) {
                    await Notification.create({
                        recipient: userId,
                        type: 'streak-reminder',
                        title: 'Streak Lost 😢',
                        message: `Your ${previousStreak}-day streak has ended. Don't worry, you can start building a new one today!`,
                        priority: 'high'
                    });
                }

                return 0;
            }

            return user.currentStreak;

        } catch (error) {
            console.error(`Error updating streak for user ${userId}:`, error);
            return null;
        }
    }

    // Use a streak freeze for a user
    static async useStreakFreeze(userId) {
        const freeze = await StreakFreeze.findOne({
            user: userId,
            isUsed: false,
            isExpired: false,
            $or: [
                { expiresAt: { $gt: new Date() } },
                { expiresAt: null }
            ]
        }).sort({ createdAt: 1 }); // Use oldest freeze first

        if (!freeze) return null;

        freeze.isUsed = true;
        freeze.usedAt = new Date();
        await freeze.save();

        return freeze;
    }

    // Award streak freeze to user (e.g., after completing a week)
    static async awardStreakFreeze(userId, reason = 'earned') {
        const user = await User.findById(userId);
        if (!user) return null;

        const freeze = await StreakFreeze.create({
            user: userId,
            freezeDate: new Date(),
            reason,
            streakPreserved: user.currentStreak,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days expiry
        });

        await Notification.create({
            recipient: userId,
            type: 'badge-earned',
            title: 'Streak Freeze Earned! 🧊',
            message: 'You earned a streak freeze! It will automatically protect your streak if you miss a day.',
            priority: 'medium'
        });

        return freeze;
    }

    // Get user's available streak freezes
    static async getAvailableFreezes(userId) {
        const freezes = await StreakFreeze.find({
            user: userId,
            isUsed: false,
            isExpired: false,
            $or: [
                { expiresAt: { $gt: new Date() } },
                { expiresAt: null }
            ]
        });

        return freezes;
    }

    // Purchase streak freeze with points
    static async purchaseStreakFreeze(userId) {
        const FREEZE_COST = 50; // points

        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (user.points < FREEZE_COST) {
            throw new Error(`Not enough points. You need ${FREEZE_COST} points.`);
        }

        // Deduct points
        user.points -= FREEZE_COST;
        await user.save();

        // Create freeze
        const freeze = await StreakFreeze.create({
            user: userId,
            freezeDate: new Date(),
            reason: 'purchased',
            streakPreserved: user.currentStreak,
            pointsCost: FREEZE_COST,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });

        return {
            freeze,
            remainingPoints: user.points
        };
    }

    // Generate weekly report for a user
    static async generateWeeklyReport(userId, weekId = null) {
        const user = await User.findById(userId);
        if (!user) return null;

        // Calculate week dates
        const now = new Date();
        const currentWeekId = weekId || getWeekNumber(now);
        
        // Parse week ID (e.g., "2024-W03")
        const [year, weekNum] = currentWeekId.split('-W').map(Number);
        
        // Calculate week start (Monday) and end (Sunday)
        const jan1 = new Date(year, 0, 1);
        const daysOffset = (jan1.getDay() || 7) - 1; // Days to subtract to get Monday
        const weekStart = new Date(jan1);
        weekStart.setDate(jan1.getDate() - daysOffset + (weekNum - 1) * 7);
        weekStart.setHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        // Get attendance records for the week
        const attendanceRecords = await Attendance.find({
            user: userId,
            date: { $gte: weekStart, $lte: weekEnd }
        }).sort({ date: 1 });

        // Build daily activity
        const dailyActivity = [];
        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        for (let i = 0; i < 7; i++) {
            const dayDate = new Date(weekStart);
            dayDate.setDate(weekStart.getDate() + i);
            
            const record = attendanceRecords.find(r => 
                r.date.toDateString() === dayDate.toDateString()
            );

            const activities = record?.activitiesCompleted || [];
            
            dailyActivity.push({
                date: dayDate,
                dayName: dayNames[i],
                minutes: record?.duration || 0,
                lessonsCompleted: activities.filter(a => a.type === 'lesson').length,
                quizzesCompleted: activities.filter(a => a.type === 'quiz').length,
                assignmentsCompleted: activities.filter(a => a.type === 'assignment').length,
                jargonsLearned: record?.jargonsViewed?.length || 0
            });
        }

        // Calculate totals
        const daysActive = dailyActivity.filter(d => d.minutes > 0).length;
        const totalMinutes = dailyActivity.reduce((sum, d) => sum + d.minutes, 0);
        const lessonsCompleted = dailyActivity.reduce((sum, d) => sum + d.lessonsCompleted, 0);
        const quizzesCompleted = dailyActivity.reduce((sum, d) => sum + d.quizzesCompleted, 0);
        const assignmentsSubmitted = dailyActivity.reduce((sum, d) => sum + d.assignmentsCompleted, 0);
        const jargonsLearned = dailyActivity.reduce((sum, d) => sum + d.jargonsLearned, 0);

        // Get previous week report for comparison
        const prevWeekNum = weekNum === 1 ? 52 : weekNum - 1;
        const prevYear = weekNum === 1 ? year - 1 : year;
        const prevWeekId = `${prevYear}-W${String(prevWeekNum).padStart(2, '0')}`;
        
        const prevReport = await WeeklyReport.findOne({
            user: userId,
            weekId: prevWeekId
        });

        // Calculate comparison
        let comparison = {
            daysActiveChange: 0,
            minutesChange: 0,
            lessonsChange: 0,
            trend: 'stable'
        };

        if (prevReport) {
            comparison.daysActiveChange = daysActive - prevReport.daysActive;
            comparison.minutesChange = totalMinutes - prevReport.totalMinutes;
            comparison.lessonsChange = lessonsCompleted - prevReport.lessonsCompleted;

            if (comparison.minutesChange > 30 || comparison.daysActiveChange > 0) {
                comparison.trend = 'improving';
            } else if (comparison.minutesChange < -30 || comparison.daysActiveChange < -1) {
                comparison.trend = 'declining';
            }
        }

        // Get badges earned this week
        const badgesEarned = user.badges.filter(b => {
            const earnedDate = new Date(b.earnedAt);
            return earnedDate >= weekStart && earnedDate <= weekEnd;
        });

        // Calculate weekly goal achievement
        const targetMinutes = (user.weeklyTimeCommitment || 5) * 60; // hours to minutes
        const targetDays = 5;
        const goalAchieved = totalMinutes >= targetMinutes && daysActive >= targetDays;

        // Generate motivational message
        const motivationalMessage = this.generateMotivationalMessage(
            daysActive, 
            user.currentStreak, 
            comparison.trend,
            goalAchieved
        );

        // Create or update weekly report
        const report = await WeeklyReport.findOneAndUpdate(
            { user: userId, weekId: currentWeekId },
            {
                user: userId,
                weekId: currentWeekId,
                weekStartDate: weekStart,
                weekEndDate: weekEnd,
                daysActive,
                totalMinutes,
                dailyActivity,
                lessonsCompleted,
                quizzesCompleted,
                assignmentsSubmitted,
                jargonsLearned,
                streakAtWeekEnd: user.currentStreak,
                streakMaintained: user.currentStreak > 0,
                pointsEarned: badgesEarned.reduce((sum, b) => sum + (b.badge?.points || 0), 0),
                badgesEarned,
                comparison,
                weeklyGoal: {
                    targetMinutes,
                    targetDays,
                    achieved: goalAchieved
                },
                motivationalMessage,
                generatedAt: new Date()
            },
            { upsert: true, new: true }
        );

        // Award streak freeze if goal achieved
        if (goalAchieved && !prevReport?.weeklyGoal?.achieved) {
            await this.awardStreakFreeze(userId, 'earned');
        }

        return report;
    }

    // Generate motivational message based on activity
    static generateMotivationalMessage(daysActive, currentStreak, trend, goalAchieved) {
        const messages = {
            excellent: [
                "🌟 Outstanding week! You're on fire!",
                "🚀 Incredible progress! Keep up the amazing work!",
                "💪 You're crushing it! Your dedication is inspiring!",
                "🎯 Perfect week! You're a learning machine!"
            ],
            good: [
                "👏 Great job this week! You're making solid progress!",
                "✨ Nice work! Consistency is key and you're nailing it!",
                "🎉 Well done! Keep building on this momentum!",
                "💫 Good week! You're on the right track!"
            ],
            moderate: [
                "👍 Decent effort this week! Every bit counts!",
                "📚 You showed up! That's what matters most!",
                "🌱 Progress takes time. Keep going!",
                "💡 Good start! Try to add one more day next week!"
            ],
            needsImprovement: [
                "🤗 We missed you this week! Let's get back on track!",
                "💪 New week, new opportunities! You've got this!",
                "🌈 It's okay to have slow weeks. Tomorrow is a fresh start!",
                "📖 Your learning journey awaits! Jump back in!"
            ]
        };

        let category;
        if (daysActive >= 6 || (daysActive >= 5 && currentStreak >= 7)) {
            category = 'excellent';
        } else if (daysActive >= 4 || goalAchieved) {
            category = 'good';
        } else if (daysActive >= 2) {
            category = 'moderate';
        } else {
            category = 'needsImprovement';
        }

        const categoryMessages = messages[category];
        return categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
    }

    // Get streak milestones and rewards
    static getStreakMilestones() {
        return [
            { days: 3, reward: 'streak-3 badge', points: 15, description: '3-day streak!' },
            { days: 7, reward: 'streak-7 badge + freeze', points: 30, description: '1 week streak!' },
            { days: 14, reward: 'streak-14 badge', points: 50, description: '2 week streak!' },
            { days: 30, reward: 'streak-30 badge + 2 freezes', points: 100, description: '1 month streak!' },
            { days: 60, reward: 'streak-master badge', points: 200, description: '2 month streak!' },
            { days: 100, reward: 'century badge + special certificate', points: 500, description: '100 day streak!' }
        ];
    }

    // Check and award streak milestone rewards
    static async checkStreakMilestone(userId) {
        const user = await User.findById(userId);
        if (!user) return null;

        const milestones = this.getStreakMilestones();
        const currentStreak = user.currentStreak;

        const achievedMilestone = milestones.find(m => m.days === currentStreak);
        
        if (achievedMilestone) {
            // Award badge
            await BadgeService.checkAndAwardBadges(userId, 'streak');

            // Award streak freezes for certain milestones
            if (achievedMilestone.days === 7 || achievedMilestone.days === 30) {
                const freezeCount = achievedMilestone.days === 30 ? 2 : 1;
                for (let i = 0; i < freezeCount; i++) {
                    await this.awardStreakFreeze(userId, 'earned');
                }
            }

            // Create milestone notification
            await Notification.create({
                recipient: userId,
                type: 'badge-earned',
                title: `🔥 ${achievedMilestone.days}-Day Streak Milestone!`,
                message: `Amazing! ${achievedMilestone.description} You earned ${achievedMilestone.points} points!`,
                priority: 'high'
            });

            return achievedMilestone;
        }

        return null;
    }

    // Get activity heatmap data for a year
    static async getActivityHeatmap(userId, year = null) {
        const targetYear = year || new Date().getFullYear();
        const startDate = new Date(targetYear, 0, 1);
        const endDate = new Date(targetYear, 11, 31);

        const attendanceRecords = await Attendance.find({
            user: userId,
            date: { $gte: startDate, $lte: endDate }
        }).select('date duration');

        // Create a map of date -> activity level
        const heatmapData = {};
        
        attendanceRecords.forEach(record => {
            const dateStr = record.date.toISOString().slice(0, 10);
            const minutes = record.duration || 0;
            
            // Determine activity level (0-4)
            let level;
            if (minutes === 0) level = 0;
            else if (minutes < 15) level = 1;
            else if (minutes < 30) level = 2;
            else if (minutes < 60) level = 3;
            else level = 4;

            heatmapData[dateStr] = {
                minutes,
                level
            };
        });

        return {
            year: targetYear,
            totalDays: Object.keys(heatmapData).length,
            heatmapData
        };
    }
}

module.exports = StreakService;