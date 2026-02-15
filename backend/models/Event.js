const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    // Basic Info
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Event description is required']
    },
    shortDescription: {
        type: String,
        maxlength: 200
    },
    // Event Type
    type: {
        type: String,
        enum: [
            'webinar',
            'workshop',
            'quiz-competition',
            'hackathon',
            'guest-lecture',
            'study-session',
            'q-and-a',
            'certification-exam',
            'other'
        ],
        required: true
    },
    // Timing
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    timezone: {
        type: String,
        default: 'Asia/Karachi'
    },
    duration: Number, // in minutes
    // Location
    isOnline: {
        type: Boolean,
        default: true
    },
    location: {
        venue: String,
        address: String,
        city: String,
        onlineUrl: String,
        meetingId: String,
        password: String
    },
    // Host/Speaker
    host: {
        name: String,
        title: String,
        bio: String,
        image: String,
        organization: String
    },
    speakers: [{
        name: String,
        title: String,
        bio: String,
        image: String,
        topic: String
    }],
    // Registration
    requiresRegistration: {
        type: Boolean,
        default: true
    },
    maxParticipants: Number,
    registrationDeadline: Date,
    registeredUsers: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        registeredAt: {
            type: Date,
            default: Date.now
        },
        attended: {
            type: Boolean,
            default: false
        },
        feedback: {
            rating: Number,
            comment: String,
            submittedAt: Date
        }
    }],
    // Content
    agenda: [{
        time: String,
        title: String,
        description: String,
        speaker: String
    }],
    resources: [{
        title: String,
        url: String,
        type: {
            type: String,
            enum: ['slides', 'recording', 'notes', 'code', 'other']
        },
        isPublic: {
            type: Boolean,
            default: false
        }
    }],
    // Media
    coverImage: String,
    thumbnail: String,
    // Target Audience
    targetLevel: {
        type: String,
        enum: ['all', 'beginner', 'intermediate', 'advanced'],
        default: 'all'
    },
    relatedCourse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    relatedJargons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jargon'
    }],
    // Rewards
    certificateOffered: {
        type: Boolean,
        default: false
    },
    pointsAwarded: {
        type: Number,
        default: 0
    },
    badgeAwarded: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Badge'
    },
    // Status
    status: {
        type: String,
        enum: ['draft', 'upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'draft'
    },
    cancellationReason: String,
    // Stats
    viewCount: {
        type: Number,
        default: 0
    },
    // Creator
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Generate slug
EventSchema.pre('save', function(next) {
    if (this.isModified('title') || !this.slug) {
        const date = new Date(this.startDate).toISOString().split('T')[0];
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') + '-' + date;
    }
    
    // Calculate duration
    if (this.startDate && this.endDate) {
        this.duration = Math.round((this.endDate - this.startDate) / (1000 * 60));
    }
    
    next();
});

// Virtual for registration count
EventSchema.virtual('registrationCount').get(function() {
    return this.registeredUsers?.length || 0;
});

// Virtual for spots remaining
EventSchema.virtual('spotsRemaining').get(function() {
    if (!this.maxParticipants) return null;
    return Math.max(0, this.maxParticipants - (this.registeredUsers?.length || 0));
});

// Index
EventSchema.index({ status: 1, startDate: 1 });
EventSchema.index({ type: 1, status: 1 });

module.exports = mongoose.model('Event', EventSchema);