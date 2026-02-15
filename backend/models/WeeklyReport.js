const mongoose = require('mongoose');

const WeeklyReportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Week identifier (e.g., "2024-W03")
    weekId: {
        type: String,
        required: true
    },
    weekStartDate: {
        type: Date,
        required: true
    },
    weekEndDate: {
        type: Date,
        required: true
    },
    // Activity Summary
    daysActive: {
        type: Number,
        default: 0,
        min: 0,
        max: 7
    },
    totalMinutes: {
        type: Number,
        default: 0
    },
    // Breakdown by day
    dailyActivity: [{
        date: Date,
        dayName: String, // Mon, Tue, etc.
        minutes: {
            type: Number,
            default: 0
        },
        lessonsCompleted: {
            type: Number,
            default: 0
        },
        quizzesCompleted: {
            type: Number,
            default: 0
        },
        assignmentsCompleted: {
            type: Number,
            default: 0
        },
        jargonsLearned: {
            type: Number,
            default: 0
        }
    }],
    // Learning Progress
    lessonsCompleted: {
        type: Number,
        default: 0
    },
    quizzesCompleted: {
        type: Number,
        default: 0
    },
    quizAverageScore: {
        type: Number,
        default: 0
    },
    assignmentsSubmitted: {
        type: Number,
        default: 0
    },
    assignmentAverageScore: {
        type: Number,
        default: 0
    },
    jargonsLearned: {
        type: Number,
        default: 0
    },
    // Streak Info
    streakAtWeekStart: {
        type: Number,
        default: 0
    },
    streakAtWeekEnd: {
        type: Number,
        default: 0
    },
    streakMaintained: {
        type: Boolean,
        default: false
    },
    // Points & Badges
    pointsEarned: {
        type: Number,
        default: 0
    },
    badgesEarned: [{
        badge: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Badge'
        },
        earnedAt: Date
    }],
    // Comparison with previous week
    comparison: {
        daysActiveChange: Number, // Can be negative
        minutesChange: Number,
        lessonsChange: Number,
        trend: {
            type: String,
            enum: ['improving', 'stable', 'declining'],
            default: 'stable'
        }
    },
    // Goals
    weeklyGoal: {
        targetMinutes: Number,
        targetDays: Number,
        achieved: {
            type: Boolean,
            default: false
        }
    },
    // Motivational message
    motivationalMessage: String,
    // Report generated timestamp
    generatedAt: {
        type: Date,
        default: Date.now
    },
    // Email sent status
    emailSent: {
        type: Boolean,
        default: false
    },
    emailSentAt: Date
}, {
    timestamps: true
});

// Compound index for unique weekly report per user
WeeklyReportSchema.index({ user: 1, weekId: 1 }, { unique: true });

module.exports = mongoose.model('WeeklyReport', WeeklyReportSchema);