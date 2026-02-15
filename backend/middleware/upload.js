const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        let folder = 'uploads/';
        
        if (file.fieldname === 'profilePicture') {
            folder += 'profiles/';
        } else if (file.fieldname === 'assignment') {
            folder += 'assignments/';
        } else {
            folder += 'misc/';
        }
        
        cb(null, folder);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'profilePicture') {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Please upload an image file'), false);
        }
    } else if (file.fieldname === 'assignment') {
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Please upload a valid document file'), false);
        }
    } else {
        cb(null, true);
    }
};

// Export configured multer
exports.uploadProfile = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: fileFilter
}).single('profilePicture');

exports.uploadAssignment = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: fileFilter
}).single('assignment');