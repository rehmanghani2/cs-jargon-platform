const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    // Basic Info
    title: {
        type: String,
        required: [true, 'Resource title is required'],
        trim: true
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Resource description is required']
    },
    // Type and Category
    type: {
        type: String,
        enum: [
            'book',
            'article',
            'journal',
            'tutorial',
            'video',
            'podcast',
            'tool',
            'app',
            'website',
            'documentation',
            'cheatsheet',
            'glossary',
            'course-external',
            'research-paper'
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
    // For Books
    bookDetails: {
        authors: [String],
        publisher: String,
        publishedYear: Number,
        isbn: String,
        edition: String,
        pages: Number,
        language: String
    },
    // For Articles/Journals
    articleDetails: {
        authors: [String],
        publication: String,
        publishedDate: Date,
        doi: String,
        volume: String,
        issue: String,
        pages: String
    },
    // For Apps/Tools
    appDetails: {
        developer: String,
        platforms: [String], // iOS, Android, Web, Windows, Mac, Linux
        pricing: {
            type: String,
            enum: ['free', 'freemium', 'paid', 'subscription'],
            default: 'free'
        },
        price: String,
        appStoreUrl: String,
        playStoreUrl: String,
        websiteUrl: String
    },
    // URLs
    url: {
        type: String,
        required: [true, 'Resource URL is required']
    },
    downloadUrl: String,
    previewUrl: String,
    // Media
    coverImage: String,
    thumbnail: String,
    screenshots: [String],
    // Difficulty
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'all-levels'],
        default: 'all-levels'
    },
    // Related Content
    relatedJargons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jargon'
    }],
    relatedCourse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    relatedResources: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource'
    }],
    // Learning Pathway
    pathway: {
        type: String,
        enum: [
            'fundamentals',
            'web-development',
            'mobile-development',
            'data-science',
            'machine-learning',
            'devops',
            'cybersecurity',
            'cloud',
            'system-design',
            'interview-prep'
        ]
    },
    pathwayOrder: Number,
    // Tags
    tags: [String],
    keywords: [String],
    // Ratings
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        review: String,
        helpfulVotes: {
            type: Number,
            default: 0
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    // Engagement
    viewCount: {
        type: Number,
        default: 0
    },
    clickCount: {
        type: Number,
        default: 0
    },
    savedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    savedCount: {
        type: Number,
        default: 0
    },
    // Featured
    isFeatured: {
        type: Boolean,
        default: false
    },
    featuredOrder: Number,
    // Recommended
    isRecommended: {
        type: Boolean,
        default: false
    },
    recommendedFor: [{
        type: String,
        enum: ['beginner', 'intermediate', 'advanced']
    }],
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
    // Creator
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Generate slug
ResourceSchema.pre('save', function(next) {
    if (this.isModified('title') || !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    
    // Update saved count
    this.savedCount = this.savedBy?.length || 0;
    
    next();
});

// Calculate average rating
ResourceSchema.methods.calculateRating = function() {
    if (!this.reviews || this.reviews.length === 0) {
        this.rating.average = 0;
        this.rating.count = 0;
        return;
    }
    
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating.average = Math.round((sum / this.reviews.length) * 10) / 10;
    this.rating.count = this.reviews.length;
};

// Indexes
ResourceSchema.index({ type: 1, category: 1, isActive: 1 });
ResourceSchema.index({ pathway: 1, pathwayOrder: 1 });
ResourceSchema.index({ tags: 1 });
ResourceSchema.index({ 'rating.average': -1 });

// Text search index
ResourceSchema.index({
    title: 'text',
    description: 'text',
    tags: 'text',
    keywords: 'text'
});

module.exports = mongoose.model('Resource', ResourceSchema);