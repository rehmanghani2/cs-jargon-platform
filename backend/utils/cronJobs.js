const User = require('../models/User');
const StreakService = require('../services/streakService');
const { sendEmail } = require('./emailService');
const { getWeekNumber } = require('./helpers');

// Update streaks for all users (run daily at midnight)
exports.updateStreaks = async () => {
    console.log('🔄 Running daily streak update...');
    
    try {
        const users = await User.find({ 
            isActive: true, 
            isEmailVerified: true,
            currentStreak: { $gt: 0 }
        }).select('_id');

        let updated = 0;
        let reset = 0;

        for (const user of users) {
            const result = await StreakService.updateUserStreak(user._id);
            if (result === 0) {
                reset++;
            } else if (result !== null) {
                updated++;
            }
        }

        console.log(`✅ Streak update complete: ${updated} maintained, ${reset} reset`);

    } catch (error) {
        console.error('❌ Streak update error:', error);
    }
};

// Send reminders to inactive users (run daily at 9 AM)
exports.sendReminders = async () => {
    console.log('📧 Running inactive user reminders...');
    
    try {
        const now = new Date();
        
        // Users inactive for 1 day (gentle reminder)
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        oneDayAgo.setHours(0, 0, 0, 0);

        const oneDayInactive = await User.find({
            lastLoginDate: { 
                $gte: new Date(oneDayAgo.getTime() - 24 * 60 * 60 * 1000),
                $lt: oneDayAgo 
            },
            isActive: true,
            isEmailVerified: true,
            currentStreak: { $gte: 3 } // Only remind if they have a streak to protect
        });

        for (const user of oneDayInactive) {
            await sendEmail({
                email: user.email,
                subject: `🔥 Your ${user.currentStreak}-day streak is at risk!`,
                html: generateStreakReminderEmail(user, 'at-risk')
            });
        }

        // Users inactive for 3 days (stronger reminder)
        const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
        
        const threeDaysInactive = await User.find({
            lastLoginDate: { $lt: threeDaysAgo },
            isActive: true,
            isEmailVerified: true
        }).limit(100); // Limit to prevent overwhelming email service

        for (const user of threeDaysInactive) {
            await sendEmail({
                email: user.email,
                subject: "We miss you! 📚 Continue your CS Jargon learning",
                html: generateComeBackEmail(user)
            });
        }

        console.log(`✅ Sent ${oneDayInactive.length} streak reminders and ${threeDaysInactive.length} comeback emails`);

    } catch (error) {
        console.error('❌ Reminder job error:', error);
    }
};

// Generate weekly reports (run every Sunday at 11 PM)
exports.generateWeeklyReports = async () => {
    console.log('📊 Generating weekly reports...');
    
    try {
        const weekId = getWeekNumber(new Date());
        
        const activeUsers = await User.find({
            isActive: true,
            isEmailVerified: true,
            placementTestCompleted: true
        }).select('_id email fullName');

        let generated = 0;

        for (const user of activeUsers) {
            try {
                const report = await StreakService.generateWeeklyReport(user._id, weekId);
                
                if (report) {
                    // Send weekly report email
                    await sendEmail({
                        email: user.email,
                        subject: `📊 Your Weekly Learning Report - ${weekId}`,
                        html: generateWeeklyReportEmail(user, report)
                    });

                    report.emailSent = true;
                    report.emailSentAt = new Date();
                    await report.save();
                    
                    generated++;
                }
            } catch (error) {
                console.error(`Error generating report for user ${user._id}:`, error);
            }
        }

        console.log(`✅ Generated ${generated} weekly reports`);

    } catch (error) {
        console.error('❌ Weekly report generation error:', error);
    }
};

// Expire old streak freezes (run daily)
exports.expireStreakFreezes = async () => {
    console.log('🧊 Expiring old streak freezes...');
    
    try {
        const StreakFreeze = require('../models/StreakFreeze');
        
        const result = await StreakFreeze.updateMany(
            {
                isUsed: false,
                isExpired: false,
                expiresAt: { $lt: new Date() }
            },
            {
                isExpired: true
            }
        );

        console.log(`✅ Expired ${result.modifiedCount} streak freezes`);

    } catch (error) {
        console.error('❌ Streak freeze expiry error:', error);
    }
};

// Helper: Generate streak at-risk email
function generateStreakReminderEmail(user, type) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .container { background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%); border-radius: 10px; padding: 30px; text-align: center; }
            .content { background: #fff; border-radius: 8px; padding: 30px; margin-top: 20px; }
            .streak-number { font-size: 72px; font-weight: bold; color: #ff6b6b; margin: 20px 0; }
            .button { display: inline-block; background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%); color: #fff !important; text-decoration: none; padding: 15px 40px; border-radius: 30px; font-weight: bold; margin: 20px 0; font-size: 16px; }
            .warning { background: #fff3cd; border: 1px solid #ffc107; border-radius: 5px; padding: 15px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="content">
                <h2>⚠️ Your Streak is at Risk!</h2>
                <p>Hey ${user.fullName},</p>
                <div class="streak-number">🔥 ${user.currentStreak}</div>
                <p>Your <strong>${user.currentStreak}-day streak</strong> will be lost if you don't study today!</p>
                <div class="warning">
                    <strong>Don't let your hard work go to waste!</strong><br>
                    Just 5 minutes of learning will keep your streak alive.
                </div>
                <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Save My Streak! 🔥</a>
                <p style="color: #888; font-size: 14px;">Remember: Consistency beats intensity!</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

// Helper: Generate comeback email
function generateComeBackEmail(user) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .container { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; padding: 30px; text-align: center; }
            .content { background: #fff; border-radius: 8px; padding: 30px; margin-top: 20px; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff !important; text-decoration: none; padding: 15px 40px; border-radius: 30px; font-weight: bold; margin: 20px 0; font-size: 16px; }
            .features { text-align: left; margin: 20px 0; }
            .feature { padding: 10px 0; border-bottom: 1px solid #eee; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="content">
                <h2>We Miss You, ${user.fullName}! 👋</h2>
                <p>It's been a few days since we've seen you on CS Jargon Platform.</p>
                <p>Your learning journey is waiting for you!</p>
                <div class="features">
                    <div class="feature">📚 <strong>New content</strong> has been added since your last visit</div>
                    <div class="feature">🏆 <strong>Your peers</strong> are making progress - stay ahead!</div>
                    <div class="feature">🎯 <strong>Quick 5-minute</strong> sessions can make a big difference</div>
                </div>
                <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Continue Learning 🚀</a>
                <p style="color: #888; font-size: 14px;">Your longest streak was ${user.longestStreak} days. Ready to beat it?</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

// Helper: Generate weekly report email
function generateWeeklyReportEmail(user, report) {
    const trendEmoji = {
        'improving': '📈',
        'stable': '➡️',
        'declining': '📉'
    };

    const goalStatus = report.weeklyGoal.achieved 
        ? '✅ Goal Achieved!' 
        : `${Math.round((report.totalMinutes / report.weeklyGoal.targetMinutes) * 100)}% of goal`;

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .container { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); border-radius: 10px; padding: 30px; text-align: center; }
            .header { color: #fff; }
            .content { background: #fff; border-radius: 8px; padding: 30px; margin-top: 20px; }
            .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
            .stat-card { background: #f8f9fa; border-radius: 8px; padding: 15px; text-align: center; }
            .stat-number { font-size: 28px; font-weight: bold; color: #11998e; }
            .stat-label { color: #666; font-size: 14px; }
            .daily-chart { display: flex; justify-content: space-between; align-items: flex-end; height: 100px; margin: 20px 0; padding: 10px; background: #f8f9fa; border-radius: 8px; }
            .day-bar { display: flex; flex-direction: column; align-items: center; }
            .bar { width: 30px; background: linear-gradient(to top, #11998e, #38ef7d); border-radius: 4px 4px 0 0; min-height: 5px; }
            .day-label { font-size: 12px; color: #666; margin-top: 5px; }
            .message { background: #e8f5e9; border-radius: 8px; padding: 15px; margin: 20px 0; }
            .button { display: inline-block; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: #fff !important; text-decoration: none; padding: 15px 40px; border-radius: 30px; font-weight: bold; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📊 Weekly Report</h1>
                <p>${report.weekId}</p>
            </div>
            <div class="content">
                <h2>Great work, ${user.fullName}!</h2>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">${report.daysActive}/7</div>
                        <div class="stat-label">Days Active</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${Math.round(report.totalMinutes / 60 * 10) / 10}h</div>
                        <div class="stat-label">Time Spent</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${report.lessonsCompleted}</div>
                        <div class="stat-label">Lessons Done</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">🔥 ${report.streakAtWeekEnd}</div>
                        <div class="stat-label">Current Streak</div>
                    </div>
                </div>

                <h3>Daily Activity</h3>
                <div class="daily-chart">
                    ${report.dailyActivity.map(day => `
                        <div class="day-bar">
                            <div class="bar" style="height: ${Math.max(5, day.minutes / 60 * 80)}px;"></div>
                            <div class="day-label">${day.dayName}</div>
                        </div>
                    `).join('')}
                </div>

                <div class="stat-card">
                    <div class="stat-label">Weekly Goal</div>
                    <div class="stat-number">${goalStatus}</div>
                </div>

                <div class="stat-card">
                    <div class="stat-label">Trend ${trendEmoji[report.comparison.trend]}</div>
                    <div class="stat-number" style="font-size: 18px;">
                        ${report.comparison.minutesChange >= 0 ? '+' : ''}${report.comparison.minutesChange} min vs last week
                    </div>
                </div>

                <div class="message">
                    <strong>${report.motivationalMessage}</strong>
                </div>

                ${report.badgesEarned.length > 0 ? `
                    <h3>🏆 Badges Earned This Week</h3>
                    <p>${report.badgesEarned.length} new badge(s)!</p>
                ` : ''}

                <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Continue Learning 🚀</a>
            </div>
        </div>
    </body>
    </html>
    `;
}