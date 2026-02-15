const mongoose = require('mongoose');

const ExampleSchema = new mongoose.Schema({
    sentence: {
        type: String,
        required: true
    },
    context: {
        type: String,
        enum: [
            'academic',      // Research papers, textbooks
            'professional',  // Documentation, code comments
            'interview',     // Technical interviews
            'conversation',  // Discussions, forums
            'code'           // Code snippets
        ],
        required: true
    },
    source: String, // URL or citation
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'intermediate'
    }
});

const MultimediaSchema = new mongoose.Schema({
    image: String,
    video: String,
    audio: String,
    diagram: String,
    interactive: String
});

const JargonSchema = new mongoose.Schema({
    // Core information
    term: {
        type: String,
        required: [true, 'Jargon term is required'],
        unique: true,
        trim: true,
        index: true
    },
    acronym: {
        type: String,
        uppercase: true,
        trim: true
    },
    pronunciation: String,
    category: {
        type: String,
        enum: [
            'programming',
            'networking',
            'database',
            'security',
            'ai-ml',
            'web-development',
            'mobile-development',
            'cloud-computing',
            'data-structures',
            'algorithms',
            'software-engineering',
            'hardware',
            'operating-systems',
            'general'
        ],
        required: true
    },
    subcategory: String,
    
    // Definitions
    definition: {
        simple: {
            type: String,
            required: [true, 'Simple definition is required']
        },
        technical: String,
        expanded: String, // Detailed explanation
        etymology: String // Origin of the term
    },
    
    // Grammar
    partOfSpeech: {
        type: String,
        enum: ['noun', 'verb', 'adjective', 'adverb', 'acronym', 'phrase'],
        default: 'noun'
    },
    pluralForm: String,
    verbForms: {
        present: String,
        past: String,
        pastParticiple: String,
        gerund: String
    },
    
    // Examples
    examples: [ExampleSchema],
    
    // Related terms
    relatedTerms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jargon'
    }],
    antonyms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jargon'
    }],
    synonyms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jargon'
    }],
    similarTerms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jargon'
    }],
    
    // Usage contexts
    usageInContext: {
        researchPaper: String,
        documentation: String,
        interview: String,
        conversation: String,
        codeSnippet: String
    },
    
    // Learning resources
    multimedia: MultimediaSchema,
    learningResources: [{
        title: String,
        url: String,
        type: {
            type: String,
            enum: ['video', 'article', 'tutorial', 'interactive', 'quiz']
        },
        difficulty: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced']
        },
        duration: Number // minutes
    }],
    
    // Difficulty and level
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    },
    level: {
        type: String,
        enum: ['A1-A2', 'B1-B2', 'C1-C2'],
        required: true
    },
    
    // Common mistakes
    commonMistakes: [String],
    commonConfusions: [String], // Terms often confused with this one
    
    // Tips and mnemonics
    tips: [String],
    mnemonics: [String],
    
    // Metadata
    isJargonOfWeek: {
        type: Boolean,
        default: false
    },
    jargonOfWeekDate: Date,
    featuredInModule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module'
    },
    usedInAssignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment'
    },
    
    // Statistics
    viewCount: {
        type: Number,
        default: 0
    },
    searchPopularity: {
        type: Number,
        default: 0
    },
    masteryScore: {
        type: Number,
        default: 0 // Average score from quizzes using this jargon
    },
    lastUsed: Date,
    
    // Status
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    verificationNotes: String,
    
    // Creator
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Index for full-text search
JargonSchema.index({ 
    term: 'text', 
    'definition.simple': 'text', 
    'definition.technical': 'text',
    acronym: 'text'
});

// Generate level based on difficulty
JargonSchema.pre('save', function(next) {
    const levelMap = {
        'beginner': 'A1-A2',
        'intermediate': 'B1-B2',
        'advanced': 'C1-C2'
    };
    this.level = levelMap[this.difficulty];
    next();
});

module.exports = mongoose.model('Jargon', JargonSchema);