const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
    // Basic Info
    title: {
        type: String,
        required: [true, 'Announcement title is required'],
        trim: true,
        maxlength: 200
    },
    slug: {
        type: String,
        unique: true
    },
    content: {
        type: String,
        required: [true, 'Announcement content is required']
    },
    excerpt: {
        type: String,
        maxlength: 300
    },
    // Type and Category
    type: {
        type: String,
        enum: [
            'general',           // General announcements
            'course-update',     // New modules, content updates
            'feature',           // New features on platform
            'maintenance',       // System maintenance
            'event',             // Webinars, workshops
            'achievement',       // Community achievements
            'jargon-of-week',    // Weekly jargon feature
            'leaderboard',       // Leaderboard updates
            'deadline',          // Assignment/course deadlines
            'important'          // Critical announcements
        ],
        default: 'general'
    },
    category: {
        type: String,
        enum: ['academic', 'technical', 'community', 'system', 'promotional'],
        default: 'academic'
    },
    // Priority
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    // Targeting
    targetAudience: {
        type: String,
        enum: ['all', 'students', 'beginners', 'intermediate', 'advanced', 'admins'],
        default: 'all'
    },
    targetCourse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    // Media
    image: String,
    attachments: [{
        name: String,
        url: String,
        type: String,
        size: Number
    }],
    // Links
    actionButton: {
        text: String,
        url: String,
        isExternal: {
            type: Boolean,
            default: false
        }
    },
    // Scheduling
    publishAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: Date,
    // Status
    status: {
        type: String,
        enum: ['draft', 'scheduled', 'published', 'expired', 'archived'],
        default: 'draft'
    },
    // Engagement
    viewCount: {
        type: Number,
        default: 0
    },
    readBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }],
    // Creator
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Generate slug before saving
AnnouncementSchema.pre('save', function(next) {
    if (this.isModified('title') || !this.slug) {
        const timestamp = Date.now().toString(36);
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') + '-' + timestamp;
    }
    
    // Generate excerpt if not provided
    if (!this.excerpt && this.content) {
        this.excerpt = this.content.substring(0, 297) + '...';
    }
    
    next();
});

// Auto-expire announcements
AnnouncementSchema.pre('find', function() {
    // This will be handled by a cron job instead
});

// Index for efficient queries
AnnouncementSchema.index({ status: 1, publishAt: -1 });
AnnouncementSchema.index({ type: 1, status: 1 });
AnnouncementSchema.index({ targetAudience: 1, status: 1 });

module.exports = mongoose.model('Announcement', AnnouncementSchema);