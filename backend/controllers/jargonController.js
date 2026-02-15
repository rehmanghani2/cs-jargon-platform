const Jargon = require('../models/Jargon');
const User = require('../models/User');
const PlacementQuestion = require('../models/PlacementQuestion');
const Module = require('../models/Module');
const Assignment = require('../models/Assignment');
const BadgeService = require('../services/badgeService');
const Notification = require('../models/Notification');

// @desc    Get all jargons with filtering
// @route   GET /api/jargons
// @access  Private
exports.getJargons = async (req, res, next) => {
    try {
        const {
            category,
            difficulty,
            level,
            search,
            sortBy = 'term',
            order = 'asc',
            page = 1,
            limit = 20,
            featuredOnly = false,
            jargonOfWeek = false
        } = req.query;

        const filter = { isActive: true };

        if (category) filter.category = category;
        if (difficulty) filter.difficulty = difficulty;
        if (level) filter.level = level;
        if (featuredOnly) filter.featuredInModule = { $exists: true, $ne: null };
        if (jargonOfWeek) filter.isJargonOfWeek = true;

        // Search functionality
        if (search && search.trim()) {
            const searchTerm = search.trim();
            filter.$or = [
                { term: { $regex: searchTerm, $options: 'i' } },
                { acronym: { $regex: searchTerm, $options: 'i' } },
                { 'definition.simple': { $regex: searchTerm, $options: 'i' } },
                { 'definition.technical': { $regex: searchTerm, $options: 'i' } }
            ];
        }

        const total = await Jargon.countDocuments(filter);

        // Sort options
        const sortOptions = {};
        sortOptions[sortBy] = order === 'desc' ? -1 : 1;
        if (sortBy !== 'viewCount') {
            sortOptions.viewCount = -1; // Secondary sort by popularity
        }

        const jargons = await Jargon.find(filter)
            .populate('relatedTerms', 'term acronym')
            .populate('synonyms', 'term acronym')
            .populate('antonyms', 'term acronym')
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Update search popularity
        if (search && search.trim()) {
            await Jargon.updateMany(
                { _id: { $in: jargons.map(j => j._id) } },
                { $inc: { searchPopularity: 1 } }
            );
        }

        res.status(200).json({
            success: true,
            count: jargons.length,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            },
            data: {
                jargons,
                filters: { category, difficulty, level, search }
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get single jargon
// @route   GET /api/jargons/:id
// @access  Private
exports.getJargon = async (req, res, next) => {
    try {
        const jargon = await Jargon.findById(req.params.id)
            .populate('relatedTerms', 'term acronym')
            .populate('synonyms', 'term acronym')
            .populate('antonyms', 'term acronym')
            .populate('similarTerms', 'term acronym')
            .populate('featuredInModule', 'title course')
            .populate('usedInAssignment', 'title');

        if (!jargon) {
            return res.status(404).json({
                success: false,
                message: 'Jargon not found'
            });
        }

        // Increment view count
        jargon.viewCount += 1;
        jargon.lastUsed = new Date();
        await jargon.save();

        // Award badge for viewing jargon
        if (req.user) {
            await BadgeService.checkAndAwardBadges(req.user.id, 'jargon-mastery', 1);
        }

        res.status(200).json({
            success: true,
            data: { jargon }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get jargon of the week
// @route   GET /api/jargons/jargon-of-week
// @access  Private
exports.getJargonOfWeek = async (req, res, next) => {
    try {
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 7);

        const jargon = await Jargon.findOne({
            isJargonOfWeek: true,
            jargonOfWeekDate: { $gte: startOfWeek, $lt: endOfWeek }
        })
        .populate('relatedTerms', 'term acronym')
        .populate('synonyms', 'term acronym')
        .populate('antonyms', 'term acronym');

        if (!jargon) {
            // If no jargon of the week, get a random one
            const randomJargon = await Jargon.aggregate([
                { $match: { isActive: true } },
                { $sample: { size: 1 } }
            ]);
            
            const jargonData = randomJargon[0];
            if (jargonData) {
                jargonData.isRandom = true;
                jargonData.message = 'No jargon of the week set. Here\'s a random CS term.';
            }
            
            return res.status(200).json({
                success: true,
                data: { jargon: jargonData }
            });
        }

        res.status(200).json({
            success: true,
            data: { jargon }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get jargon statistics
// @route   GET /api/jargons/stats
// @access  Private/Admin
exports.getJargonStats = async (req, res, next) => {
    try {
        const stats = {};

        // Total jargons
        stats.total = await Jargon.countDocuments({ isActive: true });
        stats.inactive = await Jargon.countDocuments({ isActive: false });
        stats.unverified = await Jargon.countDocuments({ isVerified: false });

        // By category
        stats.byCategory = await Jargon.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        // By difficulty
        stats.byDifficulty = await Jargon.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$difficulty', count: { $sum: 1 } } }
        ]);

        // Most viewed
        stats.mostViewed = await Jargon.find({ isActive: true })
            .sort({ viewCount: -1 })
            .limit(10)
            .select('term acronym category difficulty viewCount');

        // Most searched
        stats.mostSearched = await Jargon.find({ isActive: true })
            .sort({ searchPopularity: -1 })
            .limit(10)
            .select('term acronym category searchPopularity');

        // Recently added
        stats.recentlyAdded = await Jargon.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('term acronym category difficulty createdAt');

        // Mastery scores
        stats.averageMastery = await Jargon.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: null, avgMastery: { $avg: '$masteryScore' } } }
        ]).then(result => result[0]?.avgMastery || 0);

        res.status(200).json({
            success: true,
            data: stats
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get user's mastered jargons
// @route   GET /api/jargons/mastered
// @access  Private
exports.getMasteredJargons = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        
        // This would be enhanced in a real implementation
        // For now, we'll just return all jargons as an example
        
        const jargons = await Jargon.find({ isActive: true })
            .sort({ masteryScore: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            count: jargons.length,
            data: { jargons }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Search jargons
// @route   GET /api/jargons/search
// @access  Private
exports.searchJargons = async (req, res, next) => {
    try {
        const { q, category, difficulty } = req.query;

        if (!q || q.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Search query must be at least 2 characters'
            });
        }

        const filter = { isActive: true };
        if (category) filter.category = category;
        if (difficulty) filter.difficulty = difficulty;

        const regex = new RegExp(q.trim(), 'i');
        filter.$or = [
            { term: regex },
            { acronym: regex },
            { 'definition.simple': regex },
            { 'definition.technical': regex }
        ];

        const jargons = await Jargon.find(filter)
            .populate('relatedTerms', 'term acronym')
            .populate('synonyms', 'term acronym')
            .limit(25);

        // Update search popularity
        if (jargons.length > 0) {
            await Jargon.updateMany(
                { _id: { $in: jargons.map(j => j._id) } },
                { $inc: { searchPopularity: 1 } }
            );
        }

        res.status(200).json({
            success: true,
            count: jargons.length,
            data: { jargons, query: q }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get jargon categories
// @route   GET /api/jargons/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Jargon.distinct('category', { isActive: true });

        // Category details
        const categoryDetails = [
            {
                name: 'programming',
                displayName: 'Programming Concepts',
                description: 'Core programming languages, paradigms, and development concepts',
                icon: '💻',
                color: '#FF6B6B'
            },
            {
                name: 'networking',
                displayName: 'Networking',
                description: 'Network protocols, infrastructure, and communication systems',
                icon: '🌐',
                color: '#4ECDC4'
            },
            {
                name: 'database',
                displayName: 'Database Systems',
                description: 'Database technologies, SQL, NoSQL, and data management',
                icon: '🗄️',
                color: '#45B7D1'
            },
            {
                name: 'security',
                displayName: 'Cybersecurity',
                description: 'Security principles, threats, and protection mechanisms',
                icon: '🔒',
                color: '#96CEB4'
            },
            {
                name: 'ai-ml',
                displayName: 'AI & Machine Learning',
                description: 'Artificial intelligence, machine learning algorithms, and neural networks',
                icon: '🤖',
                color: '#FFEAA7'
            },
            {
                name: 'web-development',
                displayName: 'Web Development',
                description: 'Frontend and backend web technologies, frameworks, and tools',
                icon: '🌐',
                color: '#DDA0DD'
            },
            {
                name: 'mobile-development',
                displayName: 'Mobile Development',
                description: 'Android, iOS, and cross-platform mobile application development',
                icon: '📱',
                color: '#98D8C8'
            },
            {
                name: 'cloud-computing',
                displayName: 'Cloud Computing',
                description: 'Cloud platforms, services, and distributed computing',
                icon: '☁️',
                color: '#F7DC6F'
            },
            {
                name: 'data-structures',
                displayName: 'Data Structures',
                description: 'Arrays, linked lists, trees, graphs, and other data organization methods',
                icon: '📊',
                color: '#BB8FCE'
            },
            {
                name: 'algorithms',
                displayName: 'Algorithms',
                description: 'Sorting, searching, optimization, and algorithm design patterns',
                icon: '🔍',
                color: '#85C1E9'
            },
            {
                name: 'software-engineering',
                displayName: 'Software Engineering',
                description: 'Development methodologies, architecture, and engineering practices',
                icon: '🏗️',
                color: '#F8C471'
            },
            {
                name: 'hardware',
                displayName: 'Computer Hardware',
                description: 'Physical components, computer architecture, and hardware systems',
                icon: '🔧',
                color: '#82E0AA'
            },
            {
                name: 'operating-systems',
                displayName: 'Operating Systems',
                description: 'OS fundamentals, process management, and system calls',
                icon: '⚙️',
                color: '#F1948A'
            },
            {
                name: 'general',
                displayName: 'General CS Terms',
                description: 'Foundational computer science terminology and concepts',
                icon: '📚',
                color: '#AED6F1'
            }
        ];

        // Add counts to each category
        for (const detail of categoryDetails) {
            const count = await Jargon.countDocuments({
                category: detail.name,
                isActive: true
            });
            detail.count = count;
        }

        res.status(200).json({
            success: true,
            count: categoryDetails.length,
            data: { categories: categoryDetails }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get jargon suggestions
// @route   GET /api/jargons/suggestions
// @access  Private
exports.getSuggestions = async (req, res, next) => {
    try {
        const { q } = req.query;

        if (!q || q.trim().length < 2) {
            return res.status(200).json({
                success: true,
                data: { suggestions: [] }
            });
        }

        const regex = new RegExp(`^${q.trim()}`, 'i');
        const suggestions = await Jargon.find(
            { 
                term: regex,
                isActive: true
            },
            { term: 1, acronym: 1 }
        )
        .sort({ viewCount: -1 })
        .limit(10)
        .lean();

        const formattedSuggestions = suggestions.map(suggestion => ({
            id: suggestion._id,
            term: suggestion.term,
            acronym: suggestion.acronym
        }));

        res.status(200).json({
            success: true,
            data: { suggestions: formattedSuggestions }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get jargon flashcards
// @route   GET /api/jargons/flashcards
// @access  Private
exports.getFlashcards = async (req, res, next) => {
    try {
        const {
            category,
            difficulty,
            level,
            limit = 20,
            includeExamples = false
        } = req.query;

        const filter = { isActive: true };

        if (category) filter.category = category;
        if (difficulty) filter.difficulty = difficulty;
        if (level) filter.level = level;

        const jargons = await Jargon.find(filter)
            .select(includeExamples === 'true' ? '' : '-examples')
            .sort({ viewCount: -1 })
            .limit(parseInt(limit));

        const flashcards = jargons.map(j => ({
            front: j.term,
            back: j.definition.simple,
            category: j.category,
            difficulty: j.difficulty,
            examples: includeExamples === 'true' ? j.examples : undefined,
            relatedTerms: j.relatedTerms
        }));

        res.status(200).json({
            success: true,
            count: flashcards.length,
            data: { flashcards }
        });

    } catch (error) {
        next(error);
    }
};