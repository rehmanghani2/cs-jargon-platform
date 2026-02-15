const crypto = require('crypto');
const User = require('../models/User');
const { sendEmail, emailTemplates } = require('../utils/emailService');
const { validationResult } = require('express-validator');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { fullName, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists'
            });
        }

        // Handle profile picture
        let profilePicture = 'default-avatar.png';
        if (req.file) {
            profilePicture = req.file.filename;
        }

        // Create user
        const user = await User.create({
            fullName,
            email,
            password,
            profilePicture,
            authProvider: 'local'
        });

        // Generate verification token
        const verificationToken = user.generateVerificationToken();
        await user.save({ validateBeforeSave: false });

        // Create verification URL
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

        // Send verification email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Verify Your Email - CS Jargon Platform',
                html: emailTemplates.verificationEmail(user.fullName, verificationUrl)
            });

            res.status(201).json({
                success: true,
                message: 'Registration successful! Please check your email to verify your account.',
                data: {
                    userId: user._id,
                    email: user.email
                }
            });
        } catch (emailError) {
            // If email fails, still create user but inform about verification
            console.error('Email sending failed:', emailError);
            
            res.status(201).json({
                success: true,
                message: 'Registration successful! However, we could not send verification email. Please request a new one.',
                data: {
                    userId: user._id,
                    email: user.email,
                    emailSent: false
                }
            });
        }

    } catch (error) {
        next(error);
    }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res, next) => {
    try {
        // Hash the token from params
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        // Find user with valid token
        const user = await User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token'
            });
        }

        // Verify user
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpire = undefined;
        await user.save();

        // Send welcome email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Welcome to CS Jargon Platform! 🎉',
                html: emailTemplates.welcomeEmail(user.fullName)
            });
        } catch (emailError) {
            console.error('Welcome email failed:', emailError);
        }

        // Generate token for auto-login
        const token = user.getSignedJwtToken();

        res.status(200).json({
            success: true,
            message: 'Email verified successfully! Welcome to CS Jargon Platform.',
            token,
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    profilePicture: user.profilePicture,
                    isEmailVerified: user.isEmailVerified,
                    isProfileComplete: user.isProfileComplete,
                    placementTestCompleted: user.placementTestCompleted
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
exports.resendVerification = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email'
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: 'This email is already verified'
            });
        }

        // Generate new verification token
        const verificationToken = user.generateVerificationToken();
        await user.save({ validateBeforeSave: false });

        // Create verification URL
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

        // Send email
        await sendEmail({
            email: user.email,
            subject: 'Verify Your Email - CS Jargon Platform',
            html: emailTemplates.verificationEmail(user.fullName, verificationUrl)
        });

        res.status(200).json({
            success: true,
            message: 'Verification email sent successfully'
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        // Find user and include password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user registered with OAuth
        if (user.authProvider !== 'local') {
            return res.status(400).json({
                success: false,
                message: `This account was registered using ${user.authProvider}. Please use ${user.authProvider} to login.`
            });
        }

        // Check password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if email is verified
        if (!user.isEmailVerified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email before logging in',
                isEmailVerified: false,
                email: user.email
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated. Please contact support.'
            });
        }

        // Update streak and login info
        user.updateStreak();
        await user.save();

        // Generate token
        const token = user.getSignedJwtToken();

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    profilePicture: user.profilePicture,
                    role: user.role,
                    isProfileComplete: user.isProfileComplete,
                    placementTestCompleted: user.placementTestCompleted,
                    assignedLevel: user.assignedLevel,
                    currentStreak: user.currentStreak,
                    points: user.points
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email'
            });
        }

        if (user.authProvider !== 'local') {
            return res.status(400).json({
                success: false,
                message: `This account was registered using ${user.authProvider}. Password reset is not available for OAuth accounts.`
            });
        }

        // Generate reset token
        const resetToken = user.generateResetToken();
        await user.save({ validateBeforeSave: false });

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Request - CS Jargon Platform',
                html: emailTemplates.passwordResetEmail(user.fullName, resetUrl)
            });

            res.status(200).json({
                success: true,
                message: 'Password reset email sent successfully'
            });

        } catch (emailError) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                success: false,
                message: 'Email could not be sent. Please try again later.'
            });
        }

    } catch (error) {
        next(error);
    }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        // Hash token from params
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        // Find user with valid token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        // Send confirmation email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Changed Successfully - CS Jargon Platform',
                html: emailTemplates.passwordChangedEmail(user.fullName)
            });
        } catch (emailError) {
            console.error('Password change confirmation email failed:', emailError);
        }

        // Generate new token
        const token = user.getSignedJwtToken();

        res.status(200).json({
            success: true,
            message: 'Password reset successful',
            token
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('badges.badge')
            .populate('currentCourse');

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    profilePicture: user.profilePicture,
                    age: user.age,
                    gender: user.gender,
                    educationalBackground: user.educationalBackground,
                    currentField: user.currentField,
                    learningPreferences: user.learningPreferences,
                    weeklyTimeCommitment: user.weeklyTimeCommitment,
                    role: user.role,
                    isProfileComplete: user.isProfileComplete,
                    placementTestCompleted: user.placementTestCompleted,
                    assignedLevel: user.assignedLevel,
                    currentCourse: user.currentCourse,
                    currentStreak: user.currentStreak,
                    longestStreak: user.longestStreak,
                    totalLoginDays: user.totalLoginDays,
                    points: user.points,
                    badges: user.badges,
                    strengthAreas: user.strengthAreas,
                    improvementAreas: user.improvementAreas,
                    createdAt: user.createdAt
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        const isMatch = await user.matchPassword(req.body.currentPassword);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        user.password = req.body.newPassword;
        await user.save();

        // Send confirmation email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Changed Successfully - CS Jargon Platform',
                html: emailTemplates.passwordChangedEmail(user.fullName)
            });
        } catch (emailError) {
            console.error('Password change confirmation email failed:', emailError);
        }

        const token = user.getSignedJwtToken();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
            token
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
    try {
        // Update last activity time
        await User.findByIdAndUpdate(req.user.id, {
            lastLogoutTime: new Date()
        });

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
exports.googleCallback = async (req, res, next) => {
    try {
        const { googleId, email, fullName, profilePicture } = req.user;

        // Check if user exists
        let user = await User.findOne({ 
            $or: [{ googleId }, { email }] 
        });

        if (user) {
            // Update Google ID if not set
            if (!user.googleId) {
                user.googleId = googleId;
                user.authProvider = 'google';
                await user.save();
            }
        } else {
            // Create new user
            user = await User.create({
                fullName,
                email,
                googleId,
                profilePicture: profilePicture || 'default-avatar.png',
                authProvider: 'google',
                isEmailVerified: true, // Google accounts are pre-verified
                password: crypto.randomBytes(32).toString('hex') // Random password for OAuth users
            });
        }

        // Update streak
        user.updateStreak();
        await user.save();

        // Generate token
        const token = user.getSignedJwtToken();

        // Redirect to frontend with token
        res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?token=${token}`);

    } catch (error) {
        res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
};

// @desc    Check if email exists
// @route   POST /api/auth/check-email
// @access  Public
exports.checkEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        
        const user = await User.findOne({ email });
        
        res.status(200).json({
            success: true,
            exists: !!user,
            isVerified: user ? user.isEmailVerified : false
        });

    } catch (error) {
        next(error);
    }
};