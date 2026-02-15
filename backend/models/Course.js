const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Course title is required'],
        trim: true
    },
    slug: {
        type: String,
        unique: true
    },
    level: {
        type: String,
        required: true,
        enum: ['beginner', 'intermediate', 'advanced'],
        unique: true
    },
    levelCode: {
        type: String,
        enum: ['A1-A2', 'B1-B2', 'C1-C2']
    },
    description: {
        short: {
            type: String,
            required: [true, 'Short description is required'],
            maxlength: 200
        },
        full: {
            type: String,
            required: [true, 'Full description is required']
        }
    },
    objectives: [{
        type: String
    }],
    prerequisites: {
        type: String,
        default: 'None'
    },
    duration: {
        weeks: {
            type: Number,
            required: true
        },
        hoursPerWeek: {
            type: Number,
            default: 5
        },
        totalHours: Number
    },
    modules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module'
    }],
    totalModules: {
        type: Number,
        default: 0
    },
    totalLessons: {
        type: Number,
        default: 0
    },
    totalJargons: {
        type: Number,
        default: 0
    },
    // Grading
    passingScore: {
        type: Number,
        default: 70
    },
    attendanceThreshold: {
        type: Number,
        default: 75 // percentage
    },
    // Weights for final grade calculation
    gradeWeights: {
        quizzes: {
            type: Number,
            default: 30
        },
        assignments: {
            type: Number,
            default: 40
        },
        attendance: {
            type: Number,
            default: 15
        },
        finalExam: {
            type: Number,
            default: 15
        }
    },
    // Media
    thumbnail: {
        type: String,
        default: 'default-course.png'
    },
    introVideo: String,
    // Status
    isActive: {
        type: Boolean,
        default: true
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    publishedAt: Date,
    // Stats
    enrolledStudents: {
        type: Number,
        default: 0
    },
    completedStudents: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    // Instructor
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Generate slug before saving
CourseSchema.pre('save', function(next) {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    
    // Calculate total hours
    if (this.duration.weeks && this.duration.hoursPerWeek) {
        this.duration.totalHours = this.duration.weeks * this.duration.hoursPerWeek;
    }
    
    next();
});

// Set level code based on level
CourseSchema.pre('save', function(next) {
    const levelCodes = {
        'beginner': 'A1-A2',
        'intermediate': 'B1-B2',
        'advanced': 'C1-C2'
    };
    this.levelCode = levelCodes[this.level];
    next();
});

module.exports = mongoose.model('Course', CourseSchema);