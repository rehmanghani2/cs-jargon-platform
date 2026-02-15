const mongoose = require('mongoose');
const crypto = require('crypto');

const CertificateSchema = new mongoose.Schema({
    // Unique certificate ID for verification
    certificateId: {
        type: String,
        unique: true,
        required: true
    },
    // Certificate holder
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Certificate type
    type: {
        type: String,
        enum: ['completion', 'appreciation', 'character', 'achievement', 'participation'],
        required: true
    },
    // Associated course (for completion certificates)
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    // Certificate details
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    // Recipient details (stored for certificate generation)
    recipientName: {
        type: String,
        required: true
    },
    // Performance data
    performanceData: {
        // For completion certificates
        courseName: String,
        level: String,
        duration: String,
        completionDate: Date,
        finalGrade: String,
        percentage: Number,
        // For appreciation certificates
        reason: String,
        achievement: String,
        // For character certificates
        qualities: [String],
        period: String
    },
    // Issue details
    issuedAt: {
        type: Date,
        default: Date.now
    },
    issuedBy: {
        name: {
            type: String,
            default: 'CS Jargon Platform'
        },
        title: {
            type: String,
            default: 'Academic Director'
        },
        signature: String
    },
    // Validity
    validFrom: {
        type: Date,
        default: Date.now
    },
    validUntil: Date, // null means no expiry
    isRevoked: {
        type: Boolean,
        default: false
    },
    revokedAt: Date,
    revokeReason: String,
    // File storage
    pdfUrl: String,
    pdfGeneratedAt: Date,
    thumbnailUrl: String,
    // Verification
    verificationUrl: String,
    qrCodeUrl: String,
    // Download tracking
    downloadCount: {
        type: Number,
        default: 0
    },
    lastDownloadedAt: Date,
    // Sharing
    isPublic: {
        type: Boolean,
        default: true
    },
    shareableLink: String,
    linkedInAdded: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Generate unique certificate ID before saving
CertificateSchema.pre('save', function(next) {
    if (!this.certificateId) {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = crypto.randomBytes(4).toString('hex').toUpperCase();
        this.certificateId = `CSJP-${timestamp}-${random}`;
    }
    
    if (!this.verificationUrl) {
        this.verificationUrl = `${process.env.FRONTEND_URL}/verify/${this.certificateId}`;
    }
    
    if (!this.shareableLink) {
        this.shareableLink = `${process.env.FRONTEND_URL}/certificates/${this.certificateId}`;
    }
    
    next();
});

// Static method to verify certificate
CertificateSchema.statics.verify = async function(certificateId) {
    const certificate = await this.findOne({ certificateId })
        .populate('user', 'fullName email profilePicture')
        .populate('course', 'title level');
    
    if (!certificate) {
        return { valid: false, message: 'Certificate not found' };
    }
    
    if (certificate.isRevoked) {
        return { 
            valid: false, 
            message: 'Certificate has been revoked',
            revokedAt: certificate.revokedAt,
            reason: certificate.revokeReason
        };
    }
    
    if (certificate.validUntil && new Date() > certificate.validUntil) {
        return { valid: false, message: 'Certificate has expired' };
    }
    
    return {
        valid: true,
        certificate: {
            certificateId: certificate.certificateId,
            type: certificate.type,
            title: certificate.title,
            recipientName: certificate.recipientName,
            issuedAt: certificate.issuedAt,
            courseName: certificate.performanceData?.courseName,
            grade: certificate.performanceData?.finalGrade
        }
    };
};

module.exports = mongoose.model('Certificate', CertificateSchema);