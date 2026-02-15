const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { uploadProfile } = require('../middleware/upload');
const { protect } = require('../middleware/auth');

const {
    register,
    verifyEmail,
    resendVerification,
    login,
    forgotPassword,
    resetPassword,
    getMe,
    updatePassword,
    logout,
    googleCallback,
    checkEmail
} = require('../controllers/authController');

const {
    registerValidation,
    loginValidation,
    resetPasswordValidation,
    updatePasswordValidation,
    emailValidation
} = require('../utils/validators');

// Public routes
router.post('/register', uploadProfile, registerValidation, register);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', emailValidation, resendVerification);
router.post('/login', loginValidation, login);
router.post('/forgot-password', emailValidation, forgotPassword);
router.put('/reset-password/:token', resetPasswordValidation, resetPassword);
router.post('/check-email', emailValidation, checkEmail);

// Google OAuth routes
router.get('/google', 
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        session: false 
    })
);

router.get('/google/callback',
    passport.authenticate('google', { 
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed`
    }),
    googleCallback
);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePasswordValidation, updatePassword);
router.post('/logout', protect, logout);

module.exports = router;