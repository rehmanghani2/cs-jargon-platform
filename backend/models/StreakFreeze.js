const mongoose = require('mongoose');

const StreakFreezeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Freeze details
    freezeDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        enum: ['earned', 'purchased', 'admin-granted', 'automatic'],
        default: 'earned'
    },
    // Streak at time of freeze
    streakPreserved: {
        type: Number,
        required: true
    },
    // Usage status
    isUsed: {
        type: Boolean,
        default: false
    },
    usedAt: Date,
    // Expiry
    expiresAt: Date,
    isExpired: {
        type: Boolean,
        default: false
    },
    // Points cost (if purchased)
    pointsCost: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('StreakFreeze', StreakFreezeSchema);