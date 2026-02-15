const { body } = require('express-validator');

exports.registerValidation = [
    body('fullName')
        .trim()
        .notEmpty()
        .withMessage('Full name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),
    
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
    body('confirmPassword')
        .notEmpty()
        .withMessage('Please confirm your password')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
];

exports.loginValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

exports.resetPasswordValidation = [
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
    body('confirmPassword')
        .notEmpty()
        .withMessage('Please confirm your password')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
];

exports.updatePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    
    body('newPassword')
        .notEmpty()
        .withMessage('New password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
        .custom((value, { req }) => {
            if (value === req.body.currentPassword) {
                throw new Error('New password must be different from current password');
            }
            return true;
        }),
    
    body('confirmNewPassword')
        .notEmpty()
        .withMessage('Please confirm your new password')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
];

exports.emailValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
];

// ... existing validations ...

exports.completeProfileValidation = [
    body('age')
        .notEmpty()
        .withMessage('Age is required')
        .isInt({ min: 10, max: 100 })
        .withMessage('Age must be between 10 and 100'),
    
    body('gender')
        .notEmpty()
        .withMessage('Gender is required')
        .isIn(['male', 'female', 'other', 'prefer-not-to-say'])
        .withMessage('Invalid gender option'),
    
    body('educationalBackground')
        .notEmpty()
        .withMessage('Educational background is required')
        .isIn(['high-school', 'undergraduate', 'graduate', 'postgraduate', 'phd', 'professional'])
        .withMessage('Invalid educational background'),
    
    body('currentField')
        .notEmpty()
        .withMessage('Current field of study/profession is required')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Current field must be between 2 and 100 characters'),
    
    body('learningPreferences')
        .notEmpty()
        .withMessage('Learning preferences are required')
        .isArray({ min: 1 })
        .withMessage('Select at least one learning preference'),
    
    body('learningPreferences.*')
        .isIn(['flashcards', 'quizzes', 'reading', 'videos', 'interactive-exercises'])
        .withMessage('Invalid learning preference'),
    
    body('weeklyTimeCommitment')
        .notEmpty()
        .withMessage('Weekly time commitment is required')
        .isInt({ min: 1, max: 40 })
        .withMessage('Weekly time commitment must be between 1 and 40 hours')
];

exports.updateProfileValidation = [
    body('fullName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),
    
    body('age')
        .optional()
        .isInt({ min: 10, max: 100 })
        .withMessage('Age must be between 10 and 100'),
    
    body('gender')
        .optional()
        .isIn(['male', 'female', 'other', 'prefer-not-to-say'])
        .withMessage('Invalid gender option'),
    
    body('educationalBackground')
        .optional()
        .isIn(['high-school', 'undergraduate', 'graduate', 'postgraduate', 'phd', 'professional'])
        .withMessage('Invalid educational background'),
    
    body('currentField')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Current field must be between 2 and 100 characters'),
    
    body('learningPreferences')
        .optional()
        .isArray()
        .withMessage('Learning preferences must be an array'),
    
    body('learningPreferences.*')
        .optional()
        .isIn(['flashcards', 'quizzes', 'reading', 'videos', 'interactive-exercises'])
        .withMessage('Invalid learning preference'),
    
    body('weeklyTimeCommitment')
        .optional()
        .isInt({ min: 1, max: 40 })
        .withMessage('Weekly time commitment must be between 1 and 40 hours')
];

exports.learningPreferencesValidation = [
    body('learningPreferences')
        .notEmpty()
        .withMessage('Learning preferences are required')
        .isArray({ min: 1 })
        .withMessage('Select at least one learning preference'),
    
    body('learningPreferences.*')
        .isIn(['flashcards', 'quizzes', 'reading', 'videos', 'interactive-exercises'])
        .withMessage('Invalid learning preference'),
    
    body('weeklyTimeCommitment')
        .notEmpty()
        .withMessage('Weekly time commitment is required')
        .isInt({ min: 1, max: 40 })
        .withMessage('Weekly time commitment must be between 1 and 40 hours')
];