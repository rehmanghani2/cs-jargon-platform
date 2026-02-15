const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    loginTime: {
        type: Date,
        required: true
    },
    logoutTime: Date,
    duration: {
        type: Number, // in minutes
        default: 0
    },
    activitiesCompleted: [{
        type: {
            type: String,
            enum: ['lesson', 'quiz', 'assignment', 'flashcard', 'library']
        },
        itemId: mongoose.Schema.Types.ObjectId,
        completedAt: Date
    }],
    modulesAccessed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module'
    }],
    jargonsViewed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jargon'
    }]
}, {
    timestamps: true
});

// Compound index for one attendance record per user per day
AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);