const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isGlobal: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        enum: [
            'announcement',
            'assignment-due',
            'assignment-graded',
            'badge-earned',
            'level-promoted',
            'streak-reminder',
            'jargon-of-week',
            'certificate-issued',
            'system'
        ],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    link: String,
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: Date,
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    expiresAt: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', NotificationSchema);