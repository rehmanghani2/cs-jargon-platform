const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update attendance on each request
        await updateUserActivity(req.user);
        
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role '${req.user.role}' is not authorized to access this route`
            });
        }
        next();
    };
};

// Check if profile is complete
exports.requireCompleteProfile = async (req, res, next) => {
    if (!req.user.isProfileComplete) {
        return res.status(403).json({
            success: false,
            message: 'Please complete your profile first',
            redirect: '/introduction'
        });
    }
    next();
};

// Check if placement test is completed
exports.requirePlacementTest = async (req, res, next) => {
    if (!req.user.placementTestCompleted) {
        return res.status(403).json({
            success: false,
            message: 'Please complete the placement test first',
            redirect: '/placement-test'
        });
    }
    next();
};

// Helper function to update user activity
async function updateUserActivity(user) {
    const today = new Date().toDateString();
    const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate).toDateString() : null;
    
    if (lastLogin !== today) {
        user.updateStreak();
        await user.save();
    }
}