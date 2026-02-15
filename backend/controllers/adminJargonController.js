const Jargon = require('../models/Jargon');
const User = require('../models/User');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Assignment = require('../models/Assignment');
const PlacementQuestion = require('../models/PlacementQuestion');
const Notification = require('../models/Notification');

// @desc    Create jargon
// @route   POST /api/admin/jargons
// @access  Private/Admin
exports.createJargon = async (req, res, next) => {
    try {
        const jargon = await Jargon.create({
            ...req.body,
            createdBy: req.user.id
        });

        res.status(201).json({
            success: true,
            message: 'Jargon created successfully',
            data: { jargon }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Update jargon
// @route   PUT /api/admin/jargons/:id
// @access  Private/Admin
exports.updateJargon = async (req, res, next) => {
    try {
        const jargon = await Jargon.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!jargon) {
            return res.status(404).json({
                success: false,
                message: 'Jargon not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Jargon updated successfully',
            data: { jargon }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Delete jargon
// @route   DELETE /api/admin/jargons/:id
// @access  Private/Admin
exports.deleteJargon = async (req, res, next) => {
    try {
        const jargon = await Jargon.findByIdAndDelete(req.params.id);

        if (!jargon) {
            return res.status(404).json({
                success: false,
                message: 'Jargon not found'
            });
        }

        // Remove references from placement questions
        await PlacementQuestion.updateMany(
            { 'matchingPairs.leftColumn.text': jargon.term },
            { $pull: { 'matchingPairs.leftColumn': { text: jargon.term } } }
        );

        await PlacementQuestion.updateMany(
            { 'matchingPairs.rightColumn.text': jargon.term },
            { $pull: { 'matchingPairs.rightColumn': { text: jargon.term } } }
        );

        await PlacementQuestion.updateMany(
            { 'questions.options.text': jargon.term },
            { $pull: { 'questions.options': { text: jargon.term } } }
        );

        res.status(200).json({
            success: true,
            message: 'Jargon deleted successfully'
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Set jargon of the week
// @route   PUT /api/admin/jargons/:id/set-jargon-of-week
// @access  Private/Admin
exports.setJargonOfWeek = async (req, res, next) => {
    try {
        // Clear current jargon of the week
        await Jargon.updateMany(
            { isJargonOfWeek: true },
            { isJargonOfWeek: false }
        );

        // Set new jargon of the week
        const jargon = await Jargon.findByIdAndUpdate(
            req.params.id,
            {
                isJargonOfWeek: true,
                jargonOfWeekDate: new Date()
            },
            { new: true }
        );

        if (!jargon) {
            return res.status(404).json({
                success: false,
                message: 'Jargon not found'
            });
        }

        // Notify all users
        const users = await User.find({}, '_id');
        for (const user of users) {
            await Notification.create({
                recipient: user._id,
                type: 'announcement',
                title: '🧠 New Jargon of the Week!',
                message: `This week's featured term is "${jargon.term}"! Learn more about it in the Jargon Library.`,
                priority: 'high'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Jargon of the week set successfully',
            data: { jargon }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Verify jargon
// @route   PUT /api/admin/jargons/:id/verify
// @access  Private/Admin
exports.verifyJargon = async (req, res, next) => {
    try {
        const { notes } = req.body;

        const jargon = await Jargon.findByIdAndUpdate(
            req.params.id,
            {
                isVerified: true,
                verifiedBy: req.user.id,
                verificationNotes: notes,
                verifiedAt: new Date()
            },
            { new: true }
        );

        if (!jargon) {
            return res.status(404).json({
                success: false,
                message: 'Jargon not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Jargon verified successfully',
            data: { jargon }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Bulk import jargons
// @route   POST /api/admin/jargons/import
// @access  Private/Admin
exports.importJargons = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a CSV file'
            });
        }

        // Parse CSV file
        const csv = require('csv-parser');
        const fs = require('fs');
        const path = require('path');
        
        const filePath = path.join(__dirname, '..', '..', 'uploads', 'imports', req.file.filename);
        const results = [];

        await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', resolve)
                .on('error', reject);
        });

        // Validate and create jargons
        const errors = [];
        const importedJargons = [];

        for (const [index, row] of results.entries()) {
            try {
                // Basic validation
                if (!row.term) {
                    errors.push({ row: index + 1, error: 'Term is required' });
                    continue;
                }

                // Transform data
                const jargonData = {
                    term: row.term.trim(),
                    acronym: row.acronym?.trim().toUpperCase(),
                    definition: {
                        simple: row.simple_definition?.trim() || '',
                        technical: row.technical_definition?.trim(),
                        expanded: row.expanded_definition?.trim()
                    },
                    category: row.category?.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                    difficulty: row.difficulty || 'beginner',
                    partOfSpeech: row.part_of_speech || 'noun',
                    examples: []
                };

                // Add examples if provided
                if (row.example_sentence && row.example_context) {
                    jargonData.examples.push({
                        sentence: row.example_sentence,
                        context: row.example_context,
                        difficulty: row.example_difficulty || 'intermediate'
                    });
                }

                // Create jargon
                const jargon = await Jargon.create(jargonData);
                importedJargons.push(jargon);

            } catch (err) {
                errors.push({ row: index + 1, error: err.message });
            }
        }

        res.status(200).json({
            success: true,
            message: `Import completed: ${importedJargons.length} jargons imported`,
            data: {
                imported: importedJargons.length,
                errors,
                total: results.length
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Export jargons
// @route   GET /api/admin/jargons/export
// @access  Private/Admin
exports.exportJargons = async (req, res, next) => {
    try {
        const jargons = await Jargon.find({})
            .populate('relatedTerms', 'term acronym')
            .populate('synonyms', 'term acronym')
            .populate('antonyms', 'term acronym');

        // Convert to CSV
        const json2csv = require('json2csv').parse;
        
        const fields = [
            'term', 'acronym', 'pronunciation', 'partOfSpeech', 'category',
            'definition.simple', 'definition.technical', 'definition.expanded',
            'etymology', 'pluralForm', 'verbForms.present', 'verbForms.past',
            'verbForms.pastParticiple', 'verbForms.gerund', 'difficulty', 'level',
            'commonMistakes', 'commonConfusions', 'tips', 'mnemonics',
            'usageInContext.researchPaper', 'usageInContext.documentation',
            'usageInContext.interview', 'usageInContext.conversation', 'usageInContext.codeSnippet',
            'multimedia.image', 'multimedia.video', 'multimedia.audio',
            'isJargonOfWeek', 'jargonOfWeekDate', 'featuredInModule', 'usedInAssignment',
            'viewCount', 'searchPopularity', 'masteryScore', 'lastUsed',
            'isActive', 'isVerified', 'verificationNotes', 'createdBy'
        ];

        const opts = { fields };
        const csv = json2csv(jargons, opts);

        res.header('Content-Type', 'text/csv');
        res.attachment('cs_jargons_export.csv');
        res.send(csv);

    } catch (error) {
        next(error);
    }
};

// @desc    Get jargon dashboard
// @route   GET /api/admin/jargons/dashboard
// @access  Private/Admin
exports.getJargonDashboard = async (req, res, next) => {
    try {
        const stats = await require('./jargonController').getJargonStats(req, res, next);

        // Pending verification
        const pendingVerification = await Jargon.countDocuments({
            isVerified: false,
            isActive: true
        });

        // Recently added
        const recentAdditions = await Jargon.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('term acronym category difficulty createdAt');

        // Top contributors
        const topContributors = await Jargon.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$createdBy', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Get user names for contributors
        const userIds = topContributors.map(c => c._id);
        const users = await User.find({ _id: { $in: userIds } }, 'fullName');
        const userMap = users.reduce((map, user) => {
            map[user._id.toString()] = user.fullName;
            return map;
        }, {});

        const contributorList = topContributors.map(contributor => ({
            userId: contributor._id,
            userName: userMap[contributor._id.toString()],
            contributionCount: contributor.count
        }));

        res.status(200).json({
            success: true,
            data: {
                stats: stats.data,
                pendingVerification,
                recentAdditions,
                topContributors: contributorList
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = exports;