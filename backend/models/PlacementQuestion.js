const mongoose = require('mongoose');

const PlacementQuestionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: [true, 'Question text is required']
    },
    questionType: {
        type: String,
        enum: [
            'acronym-matching',      // Match acronyms with meanings
            'definition-choice',     // Choose correct definition
            'usage-in-sentence',     // Pick correct usage in sentence
            'comprehension',         // Reading comprehension
            'fill-in-blank',         // Fill in the blank
            'true-false',            // True or False
            'categorization'         // Categorize terms
        ],
        required: true
    },
    category: {
        type: String,
        enum: [
            'programming',
            'networking',
            'database',
            'security',
            'ai-ml',
            'web-development',
            'data-structures',
            'algorithms',
            'software-engineering',
            'operating-systems',
            'general'
        ],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    // For multiple choice questions
    options: [{
        id: String,
        text: String
    }],
    // For matching questions (acronym-matching)
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
    // For comprehension questions
    passage: String,
    subQuestions: [{
        questionText: String,
        options: [{
            id: String,
            text: String
        }],
        correctAnswer: String
    }],
    // Correct answer (for single answer questions)
    correctAnswer: mongoose.Schema.Types.Mixed,
    // Explanation shown after test
    explanation: String,
    // Points for this question
    points: {
        type: Number,
        default: 1
    },
    // Time allocated (in seconds)
    timeAllocation: {
        type: Number,
        default: 60
    },
    // Related jargons being tested
    jargonsTested: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jargon'
    }],
    // Tags for analysis
    skillsTested: [{
        type: String,
        enum: [
            'recognition',      // Recognizing terms
            'definition',       // Knowing definitions
            'context-usage',    // Using in context
            'application',      // Practical application
            'comprehension'     // Understanding in passages
        ]
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('PlacementQuestion', PlacementQuestionSchema);