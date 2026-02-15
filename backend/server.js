const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const cron = require('node-cron');


// Load env vars
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const jargonRoutes = require('./routes/jargonRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
// Import middleware
const errorHandler = require('./middleware/errorHandler');
// Import cron jobs
const { updateStreaks, sendReminders } = require('./utils/cronJobs');
const adminAssignmentRoutes = require('./routes/adminAssignmentRoutes');
// Add with other route imports
const adminCertificateRoutes = require('./routes/adminCertificateRoutes');
const passport = require('./config/passport');
// Add this with other route imports
const badgeRoutes = require('./routes/badgeRoutes');
// Add this with other route imports
const placementTestRoutes = require('./routes/placementTestRoutes');
// Add this with other route imports
const moduleRoutes = require('./routes/moduleRoutes');
// Add these with other route imports
const gradingRoutes = require('./routes/gradingRoutes');
// Add with other route imports
const streakRoutes = require('./routes/streakRoutes');
// Add with other route imports
const noticeBoardRoutes = require('./routes/noticeBoardRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const adminNoticeBoardRoutes = require('./routes/adminNoticeBoardRoutes');

const app = express();

const uploadDirs = [
    'uploads', 
    'uploads/profiles', 
    'uploads/assignments', 
    'uploads/certificates',
    'uploads/recommendations',
    'uploads/misc'
];

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// Initialize Passport
app.use(passport.initialize());

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directories if they don't exist
const fs = require('fs');
uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/jargons', jargonRoutes);
app.use('/api/notifications', notificationRoutes);
// Add this with other route mounts
app.use('/api/badges', badgeRoutes);
// Add this with other route mounts
app.use('/api/placement-test', placementTestRoutes);
// Add this with other route mounts
app.use('/api/modules', moduleRoutes);
// Add these with other route mounts
app.use('/api/grading', gradingRoutes);
app.use('/api/admin/assignments', adminAssignmentRoutes);
// Add with other route mounts
app.use('/api/streaks', streakRoutes);
// Add with other route mounts
app.use('/api/admin', adminCertificateRoutes);
// Add with other route mounts
app.use('/api/notice-board', noticeBoardRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/admin', adminNoticeBoardRoutes);

// const uploadDirs = ['uploads', 'uploads/profiles', 'uploads/assignments', 'uploads/certificates', 'uploads/misc'];


// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Error handler
app.use(errorHandler);

// Connect to database
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully');
        
        // Start server
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    });

// Cron Jobs
// Update streaks daily at midnight
cron.schedule('0 0 * * *', () => {
    console.log('Running streak update job...');
    updateStreaks();
});

// Send reminders to inactive users every day at 9 AM
cron.schedule('0 9 * * *', () => {
    console.log('Running reminder job...');
    sendReminders();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
});

// Update cron jobs section
const { 
    // updateStreaks, 
    // sendReminders, 
    generateWeeklyReports,
    expireStreakFreezes 
} = require('./utils/cronJobs');

// Also ensure certificates directory exists in upload directories


// Cron Jobs Schedule:

// Update streaks daily at midnight
cron.schedule('0 0 * * *', () => {
    console.log('⏰ Running midnight streak update...');
    updateStreaks();
    expireStreakFreezes();
});

// Send reminders to inactive users every day at 9 AM
cron.schedule('0 9 * * *', () => {
    console.log('⏰ Running morning reminders...');
    sendReminders();
});

// Generate weekly reports every Sunday at 11 PM
cron.schedule('0 23 * * 0', () => {
    console.log('⏰ Running weekly report generation...');
    generateWeeklyReports();
});