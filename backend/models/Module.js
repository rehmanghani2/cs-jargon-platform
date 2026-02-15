const mongoose = require('mongoose');

// Lesson Schema (embedded)
const LessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: String,
    description: String,
    type: {
        type: String,
        enum: ['video', 'reading', 'flashcard', 'interactive', 'practice'],
        required: true
    },
    content: {
        // For video lessons
        videoUrl: String,
        videoDuration: Number, // in seconds
        // For reading lessons
        htmlContent: String,
        // For flashcard lessons
        flashcards: [{
            term: String,
            definition: String,
            example: String,
            image: String
        }],
        // For interactive lessons
        interactiveUrl: String,
        // For practice lessons
        exercises: [{
            type: {
                type: String,
                enum: ['fill-blank', 'matching', 'multiple-choice', 'drag-drop']
            },
            question: String,
            options: [String],
            correctAnswer: mongoose.Schema.Types.Mixed,
            explanation: String
        }]
    },
    duration: {
        type: Number, // in minutes
        default: 10
    },
    order: {
        type: Number,
        required: true
    },
    jargonsIntroduced: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jargon'
    }],
    resources: [{
        title: String,
        type: {
            type: String,
            enum: ['pdf', 'link', 'video', 'article']
        },
        url: String
    }],
    isPreview: {
        type: Boolean,
        default: false
    },
    isRequired: {
        type: Boolean,
        default: true
    }
});

// Quiz Question Schema (embedded)
const QuizQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    questionType: {
        type: String,
        enum: ['multiple-choice', 'matching', 'fill-blank', 'true-false', 'short-answer'],
        required: true
    },
    options: [{
        id: String,
        text: String
    }],
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
    correctAnswer: mongoose.Schema.Types.Mixed,
    explanation: String,
    points: {
        type: Number,
        default: 1
    },
    jargonTested: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jargon'
    }
});

// Main Module Schema
const ModuleSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Module title is required']
    },
    slug: String,
    description: {
        type: String,
        required: true
    },
    objectives: [String],
    weekNumber: {
        type: Number,
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    // Lessons
    lessons: [LessonSchema],
    totalLessons: {
        type: Number,
        default: 0
    },
    // Quiz
    quiz: {
        title: String,
        description: String,
        instructions: [String],
        questions: [QuizQuestionSchema],
        totalQuestions: {
            type: Number,
            default: 0
        },
        totalPoints: {
            type: Number,
            default: 0
        },
        passingScore: {
            type: Number,
            default: 60
        },
        timeLimit: Number, // in minutes
        attemptsAllowed: {
            type: Number,
            default: 3
        },
        shuffleQuestions: {
            type: Boolean,
            default: true
        },
        showCorrectAnswers: {
            type: Boolean,
            default: true
        }
    },
    // Jargons covered in this module
    jargonsToLearn: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jargon'
    }],
    totalJargons: {
        type: Number,
        default: 0
    },
    // Timing
    estimatedTime: {
        type: Number, // in minutes
        default: 60
    },
    // Unlock criteria
    isLocked: {
        type: Boolean,
        default: true
    },
    unlockCriteria: {
        previousModuleCompleted: {
            type: Boolean,
            default: true
        },
        minimumQuizScore: {
            type: Number,
            default: 60
        },
        requiredDaysFromStart: Number
    },
    // Status
    isActive: {
        type: Boolean,
        default: true
    },
    isPublished: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Generate slug
ModuleSchema.pre('save', function(next) {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    
    // Update counts
    this.totalLessons = this.lessons?.length || 0;
    this.totalJargons = this.jargonsToLearn?.length || 0;
    
    if (this.quiz && this.quiz.questions) {
        this.quiz.totalQuestions = this.quiz.questions.length;
        this.quiz.totalPoints = this.quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);
    }
    
    // Calculate estimated time
    const lessonTime = this.lessons?.reduce((sum, l) => sum + (l.duration || 10), 0) || 0;
    const quizTime = this.quiz?.timeLimit || 15;
    this.estimatedTime = lessonTime + quizTime;
    
    next();
});

module.exports = mongoose.model('Module', ModuleSchema);