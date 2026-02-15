const Certificate = require('../models/Certificate');
const RecommendationLetter = require('../models/RecommendationLetter');
const CertificateService = require('../services/certificateService');
const User = require('../models/User');

// @desc    Get all certificates (admin)
// @route   GET /api/admin/certificates
// @access  Private/Admin
exports.getAllCertificates = async (req, res, next) => {
    try {
        const { type, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (type) filter.type = type;

        const total = await Certificate.countDocuments(filter);

        const certificates = await Certificate.find(filter)
            .populate('user', 'fullName email')
            .populate('course', 'title level')
            .sort({ issuedAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            data: {
                certificates,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Issue appreciation certificate (admin)
// @route   POST /api/admin/certificates/appreciation
// @access  Private/Admin
exports.issueAppreciationCertificate = async (req, res, next) => {
    try {
        const { userId, reason, achievement } = req.body;

        if (!userId || !reason) {
            return res.status(400).json({
                success: false,
                message: 'User ID and reason are required'
            });
        }

        const certificate = await CertificateService.generateAppreciationCertificate(
            userId,
            reason,
            achievement
        );

        res.status(201).json({
            success: true,
            message: 'Appreciation certificate issued successfully',
            data: { certificate }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Revoke certificate (admin)
// @route   PUT /api/admin/certificates/:certificateId/revoke
// @access  Private/Admin
exports.revokeCertificate = async (req, res, next) => {
    try {
        const { reason } = req.body;

        const certificate = await Certificate.findOne({
            certificateId: req.params.certificateId
        });

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found'
            });
        }

        certificate.isRevoked = true;
        certificate.revokedAt = new Date();
        certificate.revokeReason = reason || 'Revoked by administrator';
        await certificate.save();

        res.status(200).json({
            success: true,
            message: 'Certificate revoked successfully',
            data: { certificate }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get certificate statistics (admin)
// @route   GET /api/admin/certificates/stats
// @access  Private/Admin
exports.getCertificateStats = async (req, res, next) => {
    try {
        const totalCertificates = await Certificate.countDocuments({ isRevoked: false });
        const revokedCertificates = await Certificate.countDocuments({ isRevoked: true });

        const byType = await Certificate.aggregate([
            { $match: { isRevoked: false } },
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]);

        const recentCertificates = await Certificate.find({ isRevoked: false })
            .sort({ issuedAt: -1 })
            .limit(10)
            .populate('user', 'fullName')
            .select('certificateId type recipientName issuedAt');

        // Monthly trend (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyTrend = await Certificate.aggregate([
            { $match: { issuedAt: { $gte: sixMonthsAgo }, isRevoked: false } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$issuedAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Recommendation letters stats
        const totalLetters = await RecommendationLetter.countDocuments({ isRevoked: false });

        res.status(200).json({
            success: true,
            data: {
                certificates: {
                    total: totalCertificates,
                    revoked: revokedCertificates,
                    byType: byType.reduce((acc, item) => {
                        acc[item._id] = item.count;
                        return acc;
                    }, {})
                },
                recommendationLetters: {
                    total: totalLetters
                },
                recentCertificates,
                monthlyTrend
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get all recommendation letters (admin)
// @route   GET /api/admin/recommendations
// @access  Private/Admin
exports.getAllRecommendations = async (req, res, next) => {
    try {
        const { purpose, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (purpose) filter.purpose = purpose;

        const total = await RecommendationLetter.countDocuments(filter);

        const letters = await RecommendationLetter.find(filter)
            .populate('user', 'fullName email')
            .sort({ issuedAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            data: {
                letters,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Revoke recommendation letter (admin)
// @route   PUT /api/admin/recommendations/:letterId/revoke
// @access  Private/Admin
exports.revokeRecommendationLetter = async (req, res, next) => {
    try {
        const { reason } = req.body;

        const letter = await RecommendationLetter.findOne({
            letterId: req.params.letterId
        });

        if (!letter) {
            return res.status(404).json({
                success: false,
                message: 'Recommendation letter not found'
            });
        }

        letter.isRevoked = true;
        letter.revokedAt = new Date();
        letter.revokeReason = reason || 'Revoked by administrator';
        await letter.save();

        res.status(200).json({
            success: true,
            message: 'Recommendation letter revoked successfully'
        });

    } catch (error) {
        next(error);
    }
};

module.exports = exports;