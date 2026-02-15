const mongoose = require('mongoose');

const PlacementTestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Questions presented to user
    questions: [{
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PlacementQuestion'
        },
        userAnswer: mongoose.Schema.Types.Mixed,
        isCorrect: Boolean,
        pointsEarned: Number,
        timeSpent: Number // in seconds
    }],
    // Test metadata
    startedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: Date,
    totalTimeSpent: Number, // in seconds
    // Scoring
    totalQuestions: Number,
    correctAnswers: Number,
    totalPoints: Number,
    earnedPoints: Number,
    percentageScore: Number,
    // Category-wise performance
    categoryScores: [{
        category: String,
        totalQuestions: Number,
        correctAnswers: Number,
        percentage: Number
    }],
    // Skill-wise performance
    skillScores: [{
        skill: String,
        totalQuestions: Number,
        correctAnswers: Number,
        percentage: Number
    }],
    // Difficulty-wise performance
    difficultyScores: [{
        difficulty: String,
        totalQuestions: Number,
        correctAnswers: Number,
        percentage: Number
    }],
    // Level assignment
    assignedLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced']
    },
    levelCode: {
        type: String,
        enum: ['A1-A2', 'B1-B2', 'C1-C2']
    },
    // Analysis
    strengthAreas: [String],
    improvementAreas: [String],
    // Personalized feedback
    feedback: {
        summary: String,
        strengths: [String],
        weaknesses: [String],
        recommendations: [String]
    },
    // Status
    status: {
        type: String,
        enum: ['in-progress', 'completed', 'abandoned'],
        default: 'in-progress'
    },
    attemptNumber: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
});

// Index for finding user's tests
PlacementTestSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('PlacementTest', PlacementTestSchema);