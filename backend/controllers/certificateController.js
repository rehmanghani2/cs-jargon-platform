const Certificate = require('../models/Certificate');
const RecommendationLetter = require('../models/RecommendationLetter');
const CertificateService = require('../services/certificateService');
const path = require('path');
const fs = require('fs');

// @desc    Get user's certificates
// @route   GET /api/certificates
// @access  Private
exports.getMyCertificates = async (req, res, next) => {
    try {
        const certificates = await CertificateService.getUserCertificates(req.user.id);

        res.status(200).json({
            success: true,
            count: certificates.length,
            data: { certificates }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get specific certificate
// @route   GET /api/certificates/:certificateId
// @access  Private
exports.getCertificate = async (req, res, next) => {
    try {
        const certificate = await Certificate.findOne({
            certificateId: req.params.certificateId
        })
        .populate('user', 'fullName email profilePicture')
        .populate('course', 'title level levelCode');

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found'
            });
        }

        // Check access (owner or public)
        const isOwner = certificate.user._id.toString() === req.user.id;
        if (!isOwner && !certificate.isPublic) {
            return res.status(403).json({
                success: false,
                message: 'This certificate is private'
            });
        }

        res.status(200).json({
            success: true,
            data: { certificate }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Check certificate eligibility
// @route   GET /api/certificates/check-eligibility/:courseId
// @access  Private
exports.checkEligibility = async (req, res, next) => {
    try {
        const eligibility = await CertificateService.checkCompletionEligibility(
            req.user.id,
            req.params.courseId
        );

        res.status(200).json({
            success: true,
            data: eligibility
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Request completion certificate
// @route   POST /api/certificates/request/completion/:courseId
// @access  Private
exports.requestCompletionCertificate = async (req, res, next) => {
    try {
        const certificate = await CertificateService.generateCompletionCertificate(
            req.user.id,
            req.params.courseId
        );

        res.status(201).json({
            success: true,
            message: 'Completion certificate generated successfully!',
            data: { certificate }
        });

    } catch (error) {
        if (error.message.includes('already issued') || 
            error.message.includes('not completed') ||
            error.message.includes('Not enrolled')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
};

// @desc    Request character certificate
// @route   POST /api/certificates/request/character
// @access  Private
exports.requestCharacterCertificate = async (req, res, next) => {
    try {
        const { qualities, period } = req.body;

        const certificate = await CertificateService.generateCharacterCertificate(
            req.user.id,
            qualities,
            period
        );

        res.status(201).json({
            success: true,
            message: 'Character certificate generated successfully!',
            data: { certificate }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Download certificate PDF
// @route   GET /api/certificates/:certificateId/download
// @access  Private
exports.downloadCertificate = async (req, res, next) => {
    try {
        const certificate = await Certificate.findOne({
            certificateId: req.params.certificateId
        });

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found'
            });
        }

        // Check access
        const isOwner = certificate.user.toString() === req.user.id;
        if (!isOwner && !certificate.isPublic && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to download this certificate'
            });
        }

        // Get file path
        const filePath = path.join(__dirname, '..', certificate.pdfUrl);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'Certificate file not found. Please regenerate.'
            });
        }

        // Update download stats
        certificate.downloadCount += 1;
        certificate.lastDownloadedAt = new Date();
        await certificate.save();

        // Set headers for download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition', 
            `attachment; filename="${certificate.certificateId}.pdf"`
        );

        // Stream file
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

    } catch (error) {
        next(error);
    }
};

// @desc    Verify certificate (public)
// @route   GET /api/certificates/verify/:certificateId
// @access  Public
exports.verifyCertificate = async (req, res, next) => {
    try {
        const result = await Certificate.verify(req.params.certificateId);

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Toggle certificate visibility
// @route   PUT /api/certificates/:certificateId/visibility
// @access  Private
exports.toggleVisibility = async (req, res, next) => {
    try {
        const certificate = await Certificate.findOne({
            certificateId: req.params.certificateId,
            user: req.user.id
        });

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found'
            });
        }

        certificate.isPublic = !certificate.isPublic;
        await certificate.save();

        res.status(200).json({
            success: true,
            message: `Certificate is now ${certificate.isPublic ? 'public' : 'private'}`,
            data: { isPublic: certificate.isPublic }
        });

    } catch (error) {
        next(error);
    }
};

// =================== RECOMMENDATION LETTERS ===================

// @desc    Get user's recommendation letters
// @route   GET /api/certificates/recommendations
// @access  Private
exports.getMyRecommendations = async (req, res, next) => {
    try {
        const letters = await CertificateService.getUserRecommendations(req.user.id);

        res.status(200).json({
            success: true,
            count: letters.length,
            data: { letters }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Check recommendation letter eligibility
// @route   GET /api/certificates/recommendations/check-eligibility
// @access  Private
exports.checkRecommendationEligibility = async (req, res, next) => {
    try {
        const eligibility = await CertificateService.checkRecommendationEligibility(
            req.user.id
        );

        res.status(200).json({
            success: true,
            data: eligibility
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Request recommendation letter
// @route   POST /api/certificates/recommendations/request
// @access  Private
exports.requestRecommendationLetter = async (req, res, next) => {
    try {
        const { purpose, addressedTo } = req.body;

        const letter = await CertificateService.generateRecommendationLetter(
            req.user.id,
            purpose,
            addressedTo
        );

        res.status(201).json({
            success: true,
            message: 'Recommendation letter generated successfully!',
            data: { letter }
        });

    } catch (error) {
        if (error.message.includes('Must complete') || 
            error.message.includes('below') ||
            error.message.includes('Minimum') ||
            error.message.includes('already issued')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
};

// @desc    Get specific recommendation letter
// @route   GET /api/certificates/recommendations/:letterId
// @access  Private
exports.getRecommendationLetter = async (req, res, next) => {
    try {
        const letter = await RecommendationLetter.findOne({
            letterId: req.params.letterId
        }).populate('user', 'fullName email profilePicture');

        if (!letter) {
            return res.status(404).json({
                success: false,
                message: 'Recommendation letter not found'
            });
        }

        // Check access
        const isOwner = letter.user._id.toString() === req.user.id;
        if (!isOwner && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this letter'
            });
        }

        res.status(200).json({
            success: true,
            data: { letter }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Download recommendation letter PDF
// @route   GET /api/certificates/recommendations/:letterId/download
// @access  Private
exports.downloadRecommendationLetter = async (req, res, next) => {
    try {
        const letter = await RecommendationLetter.findOne({
            letterId: req.params.letterId
        });

        if (!letter) {
            return res.status(404).json({
                success: false,
                message: 'Recommendation letter not found'
            });
        }

        // Check access
        const isOwner = letter.user.toString() === req.user.id;
        if (!isOwner && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to download this letter'
            });
        }

        // Get file path
        const filePath = path.join(__dirname, '..', letter.pdfUrl);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'Letter file not found. Please regenerate.'
            });
        }

        // Update download stats
        letter.downloadCount += 1;
        letter.lastDownloadedAt = new Date();
        await letter.save();

        // Set headers for download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition', 
            `attachment; filename="${letter.letterId}.pdf"`
        );

        // Stream file
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

    } catch (error) {
        next(error);
    }
};

// @desc    Verify recommendation letter (public)
// @route   GET /api/certificates/recommendations/verify/:letterId
// @access  Public
exports.verifyRecommendationLetter = async (req, res, next) => {
    try {
        const letter = await RecommendationLetter.findOne({
            letterId: req.params.letterId
        });

        if (!letter) {
            return res.status(404).json({
                success: true,
                data: { valid: false, message: 'Letter not found' }
            });
        }

        if (letter.isRevoked) {
            return res.status(200).json({
                success: true,
                data: { valid: false, message: 'Letter has been revoked' }
            });
        }

        if (letter.validUntil && new Date() > letter.validUntil) {
            return res.status(200).json({
                success: true,
                data: { valid: false, message: 'Letter has expired' }
            });
        }

        res.status(200).json({
            success: true,
            data: {
                valid: true,
                letter: {
                    letterId: letter.letterId,
                    recipientName: letter.recipientDetails.fullName,
                    purpose: letter.purpose,
                    issuedAt: letter.issuedAt,
                    validUntil: letter.validUntil,
                    issuedBy: letter.issuedBy
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = exports;