const mongoose = require('mongoose');

const ModuleProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    module: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
        required: true
    },
    // Lesson Progress
    lessonsCompleted: [{
        lessonIndex: Number,
        lessonId: mongoose.Schema.Types.ObjectId,
        completedAt: Date,
        timeSpent: Number // in seconds
    }],
    totalLessonsCompleted: {
        type: Number,
        default: 0
    },
    currentLessonIndex: {
        type: Number,
        default: 0
    },
    // Flashcard Progress
    flashcardsReviewed: [{
        lessonIndex: Number,
        cardIndex: Number,
        reviewedAt: Date,
        wasCorrect: Boolean
    }],
    // Practice Exercise Progress
    exercisesCompleted: [{
        lessonIndex: Number,
        exerciseIndex: Number,
        completedAt: Date,
        score: Number
    }],
    // Quiz Attempts
    quizAttempts: [{
        attemptNumber: Number,
        startedAt: Date,
        completedAt: Date,
        answers: [{
            questionIndex: Number,
            userAnswer: mongoose.Schema.Types.Mixed,
            isCorrect: Boolean,
            pointsEarned: Number
        }],
        score: Number,
        percentage: Number,
        passed: Boolean,
        timeSpent: Number // in seconds
    }],
    bestQuizScore: {
        type: Number,
        default: 0
    },
    quizPassed: {
        type: Boolean,
        default: false
    },
    // Jargon Mastery
    jargonsMastered: [{
        jargon: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Jargon'
        },
        masteredAt: Date,
        correctCount: Number,
        totalAttempts: Number
    }],
    // Overall Progress
    progressPercentage: {
        type: Number,
        default: 0
    },
    isStarted: {
        type: Boolean,
        default: false
    },
    startedAt: Date,
    isCompleted: {
        type: Boolean,
        default: false
    },
    completedAt: Date,
    // Time tracking
    totalTimeSpent: {
        type: Number, // in seconds
        default: 0
    },
    lastAccessedAt: Date
}, {
    timestamps: true
});

// Compound index for unique progress per user per module
ModuleProgressSchema.index({ user: 1, module: 1 }, { unique: true });

// Calculate progress percentage
ModuleProgressSchema.methods.calculateProgress = function(totalLessons, quizRequired = true) {
    let progress = 0;
    
    // Lesson completion (70% if quiz required, 100% if not)
    const lessonWeight = quizRequired ? 70 : 100;
    const lessonProgress = totalLessons > 0 
        ? (this.totalLessonsCompleted / totalLessons) * lessonWeight 
        : 0;
    progress += lessonProgress;
    
    // Quiz completion (30%)
    if (quizRequired && this.quizPassed) {
        progress += 30;
    }
    
    this.progressPercentage = Math.min(Math.round(progress), 100);
    return this.progressPercentage;
};

// Check if module is complete
ModuleProgressSchema.methods.checkCompletion = function(module) {
    const allLessonsComplete = this.totalLessonsCompleted >= module.lessons.length;
    const quizPassed = !module.quiz?.questions?.length || this.quizPassed;
    
    if (allLessonsComplete && quizPassed && !this.isCompleted) {
        this.isCompleted = true;
        this.completedAt = new Date();
    }
    
    return this.isCompleted;
};

module.exports = mongoose.model('ModuleProgress', ModuleProgressSchema);