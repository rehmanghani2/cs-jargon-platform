const mongoose = require('mongoose');
const crypto = require('crypto');

const RecommendationLetterSchema = new mongoose.Schema({
    // Unique letter ID
    letterId: {
        type: String,
        unique: true,
        required: true
    },
    // Letter recipient
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Recipient details
    recipientDetails: {
        fullName: String,
        email: String,
        currentLevel: String,
        enrollmentDate: Date
    },
    // Performance summary
    performanceSummary: {
        coursesCompleted: [{
            courseName: String,
            level: String,
            grade: String,
            percentage: Number,
            completedAt: Date
        }],
        totalJargonsMastered: Number,
        totalTimeSpent: Number, // in hours
        totalAssignments: Number,
        assignmentAverage: Number,
        totalQuizzes: Number,
        quizAverage: Number,
        streakRecord: Number,
        badgesEarned: Number,
        overallRank: Number, // percentile
        peerReviewsCompleted: Number
    },
    // Highlighted achievements
    achievements: [{
        title: String,
        description: String,
        date: Date
    }],
    // Letter content (generated)
    content: {
        greeting: String,
        introduction: String,
        bodyParagraphs: [String],
        skills: [String],
        conclusion: String,
        closing: String
    },
    // Strengths identified
    strengths: [String],
    // Letter metadata
    purpose: {
        type: String,
        enum: ['academic', 'employment', 'internship', 'general'],
        default: 'general'
    },
    addressedTo: {
        type: String,
        default: 'To Whom It May Concern'
    },
    // Issue details
    issuedAt: {
        type: Date,
        default: Date.now
    },
    issuedBy: {
        name: {
            type: String,
            default: 'Dr. Academic Director'
        },
        title: {
            type: String,
            default: 'Director, CS Jargon Platform'
        },
        institution: {
            type: String,
            default: 'PAF-IAST'
        },
        signature: String
    },
    // Validity
    validUntil: Date,
    isRevoked: {
        type: Boolean,
        default: false
    },
    // File storage
    pdfUrl: String,
    pdfGeneratedAt: Date,
    // Verification
    verificationUrl: String,
    qrCodeUrl: String,
    // Download tracking
    downloadCount: {
        type: Number,
        default: 0
    },
    lastDownloadedAt: Date
}, {
    timestamps: true
});

// Generate unique letter ID
RecommendationLetterSchema.pre('save', function(next) {
    if (!this.letterId) {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = crypto.randomBytes(3).toString('hex').toUpperCase();
        this.letterId = `CSJP-RL-${timestamp}-${random}`;
    }
    
    if (!this.verificationUrl) {
        this.verificationUrl = `${process.env.FRONTEND_URL}/verify/letter/${this.letterId}`;
    }
    
    // Set validity (1 year from issue)
    if (!this.validUntil) {
        this.validUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    }
    
    next();
});

module.exports = mongoose.model('RecommendationLetter', RecommendationLetterSchema);