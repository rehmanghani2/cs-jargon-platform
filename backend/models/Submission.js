const mongoose = require('mongoose');

const SubmissionAnswerSchema = new mongoose.Schema({
    questionIndex: Number,
    questionId: mongoose.Schema.Types.ObjectId,
    answer: mongoose.Schema.Types.Mixed, // Can be string, array, object depending on question type
    // For file uploads within answers
    fileUrl: String,
    fileName: String,
    // Auto-grading results
    isAutoGraded: Boolean,
    isCorrect: Boolean,
    autoScore: Number,
    // Manual grading
    manualScore: Number,
    feedback: String
});

const PeerReviewSchema = new mongoose.Schema({
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Scores per rubric criteria
    scores: [{
        criteria: String,
        score: Number,
        maxScore: Number,
        comment: String
    }],
    totalScore: Number,
    overallFeedback: String,
    strengths: [String],
    improvements: [String],
    // Review metadata
    reviewedAt: {
        type: Date,
        default: Date.now
    },
    timeSpent: Number, // in seconds
    // Quality of review (for reviewer accountability)
    reviewQuality: {
        type: String,
        enum: ['pending', 'helpful', 'not-helpful'],
        default: 'pending'
    },
    helpfulVotes: {
        type: Number,
        default: 0
    }
});

const SubmissionSchema = new mongoose.Schema({
    // References
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    // Submission Content
    answers: [SubmissionAnswerSchema],
    // For file submissions
    files: [{
        fileName: String,
        fileUrl: String,
        fileSize: Number,
        mimeType: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    // For text-based submissions (essays, practical applications)
    textContent: {
        type: String,
        maxlength: 50000
    },
    // Submission Metadata
    attemptNumber: {
        type: Number,
        default: 1
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    isLate: {
        type: Boolean,
        default: false
    },
    daysLate: {
        type: Number,
        default: 0
    },
    latePenalty: {
        type: Number,
        default: 0 // percentage
    },
    // Time tracking
    startedAt: Date,
    timeSpent: Number, // in seconds
    // Auto-grading
    autoGradedScore: {
        type: Number,
        default: 0
    },
    autoGradedAt: Date,
    // Manual Grading
    manualScore: {
        type: Number,
        default: 0
    },
    // Overall Scoring
    rawScore: {
        type: Number,
        default: 0
    },
    finalScore: {
        type: Number, // After late penalty applied
        default: 0
    },
    percentage: {
        type: Number,
        default: 0
    },
    passed: {
        type: Boolean,
        default: false
    },
    // Grading Details
    grading: {
        rubricScores: [{
            criteria: String,
            score: Number,
            maxScore: Number,
            comment: String
        }],
        generalFeedback: String,
        strengths: [String],
        areasForImprovement: [String],
        gradedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        gradedAt: Date
    },
    // Peer Reviews
    peerReviews: [PeerReviewSchema],
    peerReviewScore: {
        type: Number,
        default: 0
    },
    peerReviewsReceived: {
        type: Number,
        default: 0
    },
    // Peer reviews this student needs to complete
    assignedPeerReviews: [{
        submission: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Submission'
        },
        assignedAt: Date,
        completedAt: Date,
        isCompleted: {
            type: Boolean,
            default: false
        }
    }],
    peerReviewsCompleted: {
        type: Number,
        default: 0
    },
    // Status
    status: {
        type: String,
        enum: [
            'draft',
            'submitted',
            'auto-graded',
            'pending-review',
            'under-review',
            'graded',
            'returned',
            'resubmit-requested'
        ],
        default: 'draft'
    },
    // Resubmission
    isResubmission: {
        type: Boolean,
        default: false
    },
    previousSubmission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission'
    },
    resubmissionReason: String,
    // Plagiarism check
    plagiarismCheck: {
        isChecked: {
            type: Boolean,
            default: false
        },
        similarity: Number,
        checkedAt: Date,
        report: String
    }
}, {
    timestamps: true
});

// Compound index for unique submission per attempt
SubmissionSchema.index(
    { assignment: 1, student: 1, attemptNumber: 1 }, 
    { unique: true }
);

// Calculate final score after grading
SubmissionSchema.methods.calculateFinalScore = function(totalPoints, passingScore) {
    // Combine auto-graded and manual scores
    let rawScore = 0;
    
    // Sum answer scores
    this.answers.forEach(answer => {
        if (answer.isAutoGraded) {
            rawScore += answer.autoScore || 0;
        } else {
            rawScore += answer.manualScore || 0;
        }
    });
    
    // Add manual overall score if exists
    if (this.manualScore > 0) {
        rawScore = this.manualScore;
    }
    
    this.rawScore = rawScore;
    
    // Apply late penalty
    const penaltyAmount = (rawScore * this.latePenalty) / 100;
    this.finalScore = Math.max(0, rawScore - penaltyAmount);
    
    // Calculate percentage
    this.percentage = totalPoints > 0 
        ? Math.round((this.finalScore / totalPoints) * 100) 
        : 0;
    
    // Check if passed
    this.passed = this.percentage >= passingScore;
    
    return this.finalScore;
};

// Calculate peer review score
SubmissionSchema.methods.calculatePeerReviewScore = function() {
    if (this.peerReviews.length === 0) return 0;
    
    const totalScore = this.peerReviews.reduce((sum, review) => 
        sum + (review.totalScore || 0), 0
    );
    
    this.peerReviewScore = Math.round(totalScore / this.peerReviews.length);
    this.peerReviewsReceived = this.peerReviews.length;
    
    return this.peerReviewScore;
};

module.exports = mongoose.model('Submission', SubmissionSchema);