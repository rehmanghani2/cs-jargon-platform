const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    // Basic Information
    fullName: {
        type: String,
        required: [true, 'Please provide your full name'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false
    },
    profilePicture: {
        type: String,
        required: [true, 'Profile picture is mandatory'],
        default: 'default-avatar.png'
    },
    
    // Email Verification
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    
    // Password Reset
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    
    // Introduction Page Data
    age: {
        type: Number,
        min: [10, 'Age must be at least 10'],
        max: [100, 'Age cannot exceed 100']
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer-not-to-say']
    },
    educationalBackground: {
        type: String,
        enum: ['high-school', 'undergraduate', 'graduate', 'postgraduate', 'phd', 'professional']
    },
    currentField: {
        type: String,
        trim: true
    },
    learningPreferences: [{
        type: String,
        enum: ['flashcards', 'quizzes', 'reading', 'videos', 'interactive-exercises']
    }],
    weeklyTimeCommitment: {
        type: Number, // hours per week
        min: 1,
        max: 40
    },
    
    // Placement Test & Level
    placementTestCompleted: {
        type: Boolean,
        default: false
    },
    placementTestScore: {
        type: Number,
        default: 0
    },
    assignedLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: null
    },
    levelAssignedDate: Date,
    strengthAreas: [String],
    improvementAreas: [String],
    
    // Course Progress
    currentCourse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    completedCourses: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        completedAt: Date,
        finalScore: Number
    }],
    currentModuleIndex: {
        type: Number,
        default: 0
    },
    moduleProgress: [{
        moduleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Module'
        },
        completedLessons: [Number],
        quizScores: [Number],
        isCompleted: {
            type: Boolean,
            default: false
        },
        completedAt: Date
    }],
    
    // Attendance & Engagement
    totalLoginDays: {
        type: Number,
        default: 0
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    },
    lastLoginDate: Date,
    totalTimeSpent: {
        type: Number, // in minutes
        default: 0
    },
    weeklyActivity: [{
        week: String, // Format: "2024-W01"
        daysActive: Number,
        timeSpent: Number
    }],
    
    // Badges & Achievements
    badges: [{
        badge: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Badge'
        },
        earnedAt: {
            type: Date,
            default: Date.now
        }
    }],
    points: {
        type: Number,
        default: 0
    },
    
    // Certificates
    certificates: [{
        type: {
            type: String,
            enum: ['completion', 'appreciation', 'character']
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        issuedAt: Date,
        certificateUrl: String,
        certificateId: String
    }],
    
    // Recommendation Letter
    recommendationLetter: {
        isEligible: {
            type: Boolean,
            default: false
        },
        generatedAt: Date,
        letterUrl: String
    },
    
    // Role & Status
    role: {
        type: String,
        enum: ['student', 'admin', 'instructor'],
        default: 'student'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isProfileComplete: {
        type: Boolean,
        default: false
    },
    
    // OAuth
    googleId: String,
    authProvider: {
        type: String,
        enum: ['local', 'google', 'institutional'],
        default: 'local'
    }
    
}, {
    timestamps: true
});

// Encrypt password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

// Match password
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate email verification token
UserSchema.methods.generateVerificationToken = function() {
    const token = require('crypto').randomBytes(32).toString('hex');
    this.emailVerificationToken = require('crypto')
        .createHash('sha256')
        .update(token)
        .digest('hex');
    this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    return token;
};

// Generate password reset token
UserSchema.methods.generateResetToken = function() {
    const token = require('crypto').randomBytes(32).toString('hex');
    this.resetPasswordToken = require('crypto')
        .createHash('sha256')
        .update(token)
        .digest('hex');
    this.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
    return token;
};

// Update streak
UserSchema.methods.updateStreak = function() {
    const today = new Date().toDateString();
    const lastLogin = this.lastLoginDate ? new Date(this.lastLoginDate).toDateString() : null;
    
    if (lastLogin === today) {
        return; // Already logged in today
    }
    
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    
    if (lastLogin === yesterday) {
        this.currentStreak += 1;
    } else {
        this.currentStreak = 1;
    }
    
    if (this.currentStreak > this.longestStreak) {
        this.longestStreak = this.currentStreak;
    }
    
    this.totalLoginDays += 1;
    this.lastLoginDate = new Date();
};

module.exports = mongoose.model('User', UserSchema);