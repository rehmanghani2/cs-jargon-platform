const crypto = require('crypto');

// Generate random string
exports.generateRandomString = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};

// Generate unique ID for certificates
exports.generateCertificateId = () => {
    const timestamp = Date.now().toString(36);
    const random = crypto.randomBytes(4).toString('hex');
    return `CSJP-${timestamp}-${random}`.toUpperCase();
};

// Calculate level based on score
exports.calculateLevel = (score) => {
    if (score >= 80) return 'advanced';
    if (score >= 50) return 'intermediate';
    return 'beginner';
};

// Get level code
exports.getLevelCode = (level) => {
    const codes = {
        beginner: 'A1-A2',
        intermediate: 'B1-B2',
        advanced: 'C1-C2'
    };
    return codes[level] || 'A1-A2';
};

// Get level duration in weeks
exports.getLevelDuration = (level) => {
    const durations = {
        beginner: 6,
        intermediate: 8,
        advanced: 14
    };
    return durations[level] || 6;
};

// Format date for display
exports.formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Calculate week number
exports.getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return `${d.getFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
};

// Sanitize filename
exports.sanitizeFilename = (filename) => {
    return filename
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .replace(/_+/g, '_')
        .toLowerCase();
};

// Paginate results
exports.paginate = (page = 1, limit = 10) => {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;
    
    return {
        skip,
        limit: limitNum,
        page: pageNum
    };
};

// Build pagination response
exports.paginationResponse = (total, page, limit) => {
    return {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
    };
};