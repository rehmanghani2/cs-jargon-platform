const mongoose = require('mongoose');

// Question schema for structured assignments
const AssignmentQuestionSchema = new mongoose.Schema({
    questionNumber: Number,
    questionText: {
        type: String,
        required: true
    },
    questionType: {
        type: String,
        enum: [
            'short-answer',
            'long-answer',
            'fill-blank',
            'multiple-choice',
            'matching',
            'definition',
            'paraphrase',
            'categorization'
        ],
        required: true
    },
    instructions: String,
    // For multiple choice
    options: [{
        id: String,
        text: String
    }],
    // For matching
    matchingPairs: {
        leftColumn: [{
            id: String,
            text: String
        }],
        rightColumn: [{
            id: String,
            text: String
        }],
        correctMatches: [{
            leftId: String,
            rightId: String
        }]
    },
    // For fill-in-blank
    blankSentence: String, // Sentence with ___ for blanks
    acceptableAnswers: [String], // Multiple acceptable answers
    // For definition questions
    termToDefine: String,
    // For paraphrase questions
    originalText: String,
    // Correct answer for auto-grading
    correctAnswer: mongoose.Schema.Types.Mixed,
    // Grading
    points: {
        type: Number,
        default: 1
    },
    isAutoGraded: {
        type: Boolean,
        default: false
    },
    // Rubric for manual grading
    rubric: {
        criteria: [String],
        maxPoints: Number
    },
    // Related jargon
    relatedJargon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jargon'
    }
});

const AssignmentSchema = new mongoose.Schema({
    // Basic Info
    title: {
        type: String,
        required: [true, 'Assignment title is required'],
        trim: true
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Assignment description is required']
    },
    instructions: [String],
    // Association
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    module: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module'
    },
    weekNumber: Number,
    // Assignment Type
    type: {
        type: String,
        enum: [
            'definition-writing',      // Write short definitions for given terms
            'jargon-matching',          // Match jargon with its usage
            'paraphrasing',             // Paraphrase sentences containing technical terms
            'peer-review',              // Evaluate classmates' use of jargon
            'fill-in-blank',            // Fill in the blank exercises
            'comprehension',            // Reading comprehension with jargon focus
            'practical-application',    // Use jargons in real context (e.g., write documentation)
            'mixed'                     // Combination of different types
        ],
        required: true
    },
    // Questions/Content
    questions: [AssignmentQuestionSchema],
    totalQuestions: {
        type: Number,
        default: 0
    },
    // For comprehension type
    passage: {
        title: String,
        content: String,
        source: String
    },
    // For practical application
    scenario: {
        description: String,
        context: String,
        requirements: [String],
        deliverables: [String]
    },
    // Jargons focused
    jargonsFocused: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jargon'
    }],
    // Grading
    totalPoints: {
        type: Number,
        default: 100
    },
    passingScore: {
        type: Number,
        default: 60
    },
    weightage: {
        type: Number,
        default: 10 // percentage of course grade
    },
    // Rubric for overall assignment
    rubric: [{
        criteria: {
            type: String,
            required: true
        },
        description: String,
        maxPoints: {
            type: Number,
            required: true
        },
        levels: [{
            score: Number,
            description: String
        }]
    }],
    // Timing
    availableFrom: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    lateDueDate: Date, // Extended deadline with penalty
    lateSubmissionPenalty: {
        type: Number,
        default: 10 // percentage deducted per day
    },
    maxLateDays: {
        type: Number,
        default: 3
    },
    estimatedTime: {
        type: Number, // in minutes
        default: 30
    },
    // Submission settings
    submissionType: {
        type: String,
        enum: ['online', 'file', 'both'],
        default: 'online'
    },
    allowedFileTypes: {
        type: [String],
        default: ['pdf', 'doc', 'docx', 'txt']
    },
    maxFileSize: {
        type: Number,
        default: 10 // MB
    },
    maxAttempts: {
        type: Number,
        default: 1
    },
    // Peer Review Settings
    isPeerReviewEnabled: {
        type: Boolean,
        default: false
    },
    peerReviewSettings: {
        reviewsRequired: {
            type: Number,
            default: 2
        },
        reviewDeadline: Date,
        isAnonymous: {
            type: Boolean,
            default: true
        },
        reviewRubric: [{
            criteria: String,
            maxPoints: Number,
            description: String
        }],
        peerReviewWeight: {
            type: Number,
            default: 20 // percentage of assignment grade
        }
    },
    // Auto-grading
    isAutoGraded: {
        type: Boolean,
        default: false
    },
    autoGradePercentage: {
        type: Number,
        default: 0 // what percentage of points are auto-graded
    },
    // Status
    status: {
        type: String,
        enum: ['draft', 'published', 'closed', 'archived'],
        default: 'draft'
    },
    publishedAt: Date,
    closedAt: Date,
    // Stats
    totalSubmissions: {
        type: Number,
        default: 0
    },
    gradedSubmissions: {
        type: Number,
        default: 0
    },
    averageScore: {
        type: Number,
        default: 0
    },
    // Creator
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Generate slug
AssignmentSchema.pre('save', function(next) {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    
    // Update total questions
    this.totalQuestions = this.questions?.length || 0;
    
    // Calculate auto-grade percentage
    if (this.questions?.length > 0) {
        const autoGradedPoints = this.questions
            .filter(q => q.isAutoGraded)
            .reduce((sum, q) => sum + (q.points || 0), 0);
        const totalPoints = this.questions.reduce((sum, q) => sum + (q.points || 0), 0);
        this.autoGradePercentage = totalPoints > 0 
            ? Math.round((autoGradedPoints / totalPoints) * 100) 
            : 0;
    }
    
    next();
});

// Check if assignment is open for submissions
AssignmentSchema.methods.isOpen = function() {
    const now = new Date();
    return this.status === 'published' && 
           now >= this.availableFrom && 
           (now <= this.dueDate || (this.lateDueDate && now <= this.lateDueDate));
};

// Check if submission is late
AssignmentSchema.methods.isLate = function(submissionDate) {
    return submissionDate > this.dueDate;
};

// Calculate late penalty
AssignmentSchema.methods.calculateLatePenalty = function(submissionDate) {
    if (!this.isLate(submissionDate)) return 0;
    
    const daysLate = Math.ceil((submissionDate - this.dueDate) / (1000 * 60 * 60 * 24));
    const effectiveDays = Math.min(daysLate, this.maxLateDays);
    return effectiveDays * this.lateSubmissionPenalty;
};

module.exports = mongoose.model('Assignment', AssignmentSchema);