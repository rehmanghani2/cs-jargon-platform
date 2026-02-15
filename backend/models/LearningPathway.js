const mongoose = require('mongoose');

const PathwayStepSchema = new mongoose.Schema({
    order: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    type: {
        type: String,
        enum: ['jargon', 'module', 'resource', 'assignment', 'quiz', 'project'],
        required: true
    },
    // Reference to actual content
    jargon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jargon'
    },
    module: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module'
    },
    resource: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource'
    },
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment'
    },
    // Custom content
    customContent: {
        text: String,
        url: String,
        videoUrl: String
    },
    // Estimated time
    estimatedTime: Number, // in minutes
    // Points
    points: {
        type: Number,
        default: 10
    },
    // Is optional
    isOptional: {
        type: Boolean,
        default: false
    }
});

const LearningPathwaySchema = new mongoose.Schema({
    // Basic Info
    title: {
        type: String,
        required: [true, 'Pathway title is required'],
        trim: true
    },
    slug: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Pathway description is required']
    },
    shortDescription: {
        type: String,
        maxlength: 200
    },
    // Category
    category: {
        type: String,
        enum: [
            'fundamentals',
            'web-development',
            'mobile-development',
            'data-science',
            'machine-learning',
            'devops',
            'cybersecurity',
            'cloud-computing',
            'system-design',
            'interview-prep',
            'career-growth'
        ],
        required: true
    },
    // Target Audience
    targetLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    },
    prerequisites: [String],
    // Learning Outcomes
    learningOutcomes: [String],
    skills: [String],
    // Steps/Content
    steps: [PathwayStepSchema],
    totalSteps: {
        type: Number,
        default: 0
    },
    // Timing
    estimatedDuration: {
        weeks: Number,
        hoursPerWeek: Number,
        totalHours: Number
    },
    // Media
    coverImage: String,
    thumbnail: String,
    introVideo: String,
    // Related Content
    relatedCourse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    relatedJargons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jargon'
    }],
    // Completion
    certificateOffered: {
        type: Boolean,
        default: true
    },
    badgeOffered: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Badge'
    },
    totalPoints: {
        type: Number,
        default: 0
    },
    // Enrollment
    enrolledUsers: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        enrolledAt: {
            type: Date,
            default: Date.now
        },
        completedSteps: [Number],
        currentStep: {
            type: Number,
            default: 0
        },
        progress: {
            type: Number,
            default: 0
        },
        completedAt: Date,
        pointsEarned: {
            type: Number,
            default: 0
        }
    }],
    enrollmentCount: {
        type: Number,
        default: 0
    },
    completionCount: {
        type: Number,
        default: 0
    },
    // Rating
    rating: {
        average: {
            type: Number,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    },
    // Status
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    isFeatured: {
        type: Boolean,
        default: false
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

// Generate slug and calculate totals
LearningPathwaySchema.pre('save', function(next) {
    if (this.isModified('title') || !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    
    // Update counts
    this.totalSteps = this.steps?.length || 0;
    this.totalPoints = this.steps?.reduce((sum, step) => sum + (step.points || 0), 0) || 0;
    this.enrollmentCount = this.enrolledUsers?.length || 0;
    this.completionCount = this.enrolledUsers?.filter(e => e.completedAt)?.length || 0;
    
    // Calculate estimated duration
    if (this.steps?.length > 0) {
        const totalMinutes = this.steps.reduce((sum, step) => sum + (step.estimatedTime || 30), 0);
        this.estimatedDuration = {
            totalHours: Math.round(totalMinutes / 60),
            weeks: Math.ceil(totalMinutes / 60 / 5), // Assuming 5 hours per week
            hoursPerWeek: 5
        };
    }
    
    next();
});

module.exports = mongoose.model('LearningPathway', LearningPathwaySchema);