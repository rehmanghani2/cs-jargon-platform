const Course = require('../models/Course');
const Module = require('../models/Module');
const Enrollment = require('../models/Enrollment');
const ModuleProgress = require('../models/ModuleProgress');
const User = require('../models/User');
const BadgeService = require('../services/badgeService');
const Notification = require('../models/Notification');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
exports.getCourses = async (req, res, next) => {
    try {
        const courses = await Course.find({ isActive: true, isPublished: true })
            .select('-modules')
            .sort({ level: 1 });

        // Add user enrollment status if authenticated
        let coursesWithEnrollment = courses;
        if (req.user) {
            const enrollments = await Enrollment.find({ user: req.user.id });
            const enrolledCourseIds = enrollments.map(e => e.course.toString());

            coursesWithEnrollment = courses.map(course => ({
                ...course.toObject(),
                isEnrolled: enrolledCourseIds.includes(course._id.toString()),
                enrollment: enrollments.find(e => e.course.toString() === course._id.toString())
            }));
        }

        res.status(200).json({
            success: true,
            count: courses.length,
            data: { courses: coursesWithEnrollment }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get single course with modules
// @route   GET /api/courses/:id
// @access  Private
exports.getCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate({
                path: 'modules',
                select: 'title description weekNumber order estimatedTime totalLessons totalJargons isLocked',
                match: { isActive: true, isPublished: true },
                options: { sort: { order: 1 } }
            });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Get enrollment status
        let enrollment = null;
        let moduleProgress = [];

        if (req.user) {
            enrollment = await Enrollment.findOne({
                user: req.user.id,
                course: course._id
            });

            if (enrollment) {
                moduleProgress = await ModuleProgress.find({
                    user: req.user.id,
                    course: course._id
                }).select('module progressPercentage isCompleted quizPassed');
            }
        }

        // Add progress to modules
        const modulesWithProgress = course.modules.map(module => {
            const progress = moduleProgress.find(
                p => p.module.toString() === module._id.toString()
            );
            return {
                ...module.toObject(),
                progress: progress || null,
                isUnlocked: checkModuleUnlock(module, moduleProgress, enrollment)
            };
        });

        res.status(200).json({
            success: true,
            data: {
                course: {
                    ...course.toObject(),
                    modules: modulesWithProgress
                },
                enrollment,
                isEnrolled: !!enrollment
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get user's enrolled courses
// @route   GET /api/courses/my-courses
// @access  Private
exports.getMyCourses = async (req, res, next) => {
    try {
        const enrollments = await Enrollment.find({
            user: req.user.id,
            status: { $in: ['active', 'completed'] }
        })
        .populate({
            path: 'course',
            select: 'title level levelCode description thumbnail duration totalModules'
        })
        .sort({ enrolledAt: -1 });

        const courses = enrollments.map(enrollment => ({
            ...enrollment.course.toObject(),
            enrollment: {
                enrolledAt: enrollment.enrolledAt,
                status: enrollment.status,
                progressPercentage: enrollment.progressPercentage,
                totalModulesCompleted: enrollment.totalModulesCompleted,
                currentModuleIndex: enrollment.currentModuleIndex,
                grades: enrollment.grades,
                lastAccessedAt: enrollment.lastAccessedAt
            }
        }));

        res.status(200).json({
            success: true,
            count: courses.length,
            data: { courses }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private
exports.enrollInCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({
            user: req.user.id,
            course: course._id
        });

        if (existingEnrollment) {
            return res.status(400).json({
                success: false,
                message: 'You are already enrolled in this course'
            });
        }

        // Check if user's level matches course level
        const user = await User.findById(req.user.id);
        if (user.assignedLevel !== course.level) {
            return res.status(400).json({
                success: false,
                message: `This course is for ${course.level} level. Your current level is ${user.assignedLevel}.`
            });
        }

        // Create enrollment
        const enrollment = await Enrollment.create({
            user: req.user.id,
            course: course._id,
            enrollmentType: 'self-enrolled',
            expectedCompletionDate: new Date(Date.now() + course.duration.weeks * 7 * 24 * 60 * 60 * 1000)
        });

        // Update course enrolled count
        course.enrolledStudents += 1;
        await course.save();

        // Update user's current course
        user.currentCourse = course._id;
        await user.save();

        // Create notification
        await Notification.create({
            recipient: user._id,
            type: 'announcement',
            title: 'Course Enrollment Successful! 📚',
            message: `You have been enrolled in "${course.title}". Start your learning journey now!`,
            link: `/courses/${course._id}`,
            priority: 'high'
        });

        res.status(201).json({
            success: true,
            message: `Successfully enrolled in ${course.title}`,
            data: { enrollment }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get course progress
// @route   GET /api/courses/:id/progress
// @access  Private
exports.getCourseProgress = async (req, res, next) => {
    try {
        const enrollment = await Enrollment.findOne({
            user: req.user.id,
            course: req.params.id
        }).populate('course');

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: 'Enrollment not found'
            });
        }

        const moduleProgress = await ModuleProgress.find({
            user: req.user.id,
            course: req.params.id
        })
        .populate('module', 'title order weekNumber')
        .sort({ 'module.order': 1 });

        // Calculate detailed progress
        const progressDetails = {
            overall: enrollment.progressPercentage,
            modulesCompleted: enrollment.totalModulesCompleted,
            totalModules: enrollment.course.totalModules,
            grades: enrollment.grades,
            timeSpent: enrollment.totalTimeSpent,
            moduleProgress: moduleProgress.map(mp => ({
                moduleId: mp.module._id,
                moduleTitle: mp.module.title,
                weekNumber: mp.module.weekNumber,
                lessonsCompleted: mp.totalLessonsCompleted,
                progressPercentage: mp.progressPercentage,
                quizPassed: mp.quizPassed,
                bestQuizScore: mp.bestQuizScore,
                isCompleted: mp.isCompleted,
                completedAt: mp.completedAt
            }))
        };

        res.status(200).json({
            success: true,
            data: { progress: progressDetails }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Update course progress (called when completing activities)
// @route   PUT /api/courses/:id/progress
// @access  Private
exports.updateCourseProgress = async (req, res, next) => {
    try {
        const enrollment = await Enrollment.findOne({
            user: req.user.id,
            course: req.params.id
        });

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: 'Enrollment not found'
            });
        }

        const course = await Course.findById(req.params.id);
        const moduleProgressList = await ModuleProgress.find({
            user: req.user.id,
            course: req.params.id
        });

        // Calculate overall progress
        const completedModules = moduleProgressList.filter(mp => mp.isCompleted).length;
        const totalProgress = course.totalModules > 0
            ? Math.round((completedModules / course.totalModules) * 100)
            : 0;

        // Calculate quiz average
        const quizScores = moduleProgressList
            .filter(mp => mp.bestQuizScore > 0)
            .map(mp => mp.bestQuizScore);
        const quizAverage = quizScores.length > 0
            ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
            : 0;

        // Update enrollment
        enrollment.totalModulesCompleted = completedModules;
        enrollment.progressPercentage = totalProgress;
        enrollment.grades.quizAverage = quizAverage;
        enrollment.lastAccessedAt = new Date();

        // Check for course completion
        if (completedModules >= course.totalModules && !enrollment.completedAt) {
            enrollment.status = 'completed';
            enrollment.completedAt = new Date();
            enrollment.actualCompletionDate = new Date();

            // Calculate final grade
            enrollment.calculateOverallGrade(course.gradeWeights);

            // Award course completion badge
            await BadgeService.checkAndAwardBadges(req.user.id, 'course-complete', course.level);

            // Update user
            const user = await User.findById(req.user.id);
            user.completedCourses.push({
                course: course._id,
                completedAt: new Date(),
                finalScore: enrollment.grades.overallGrade
            });
            await user.save();

            // Create notification
            await Notification.create({
                recipient: req.user.id,
                type: 'level-promoted',
                title: 'Course Completed! 🎉',
                message: `Congratulations! You have completed "${course.title}" with a grade of ${enrollment.grades.letterGrade}!`,
                priority: 'high'
            });
        }

        await enrollment.save();

        res.status(200).json({
            success: true,
            message: 'Progress updated',
            data: {
                progressPercentage: enrollment.progressPercentage,
                modulesCompleted: enrollment.totalModulesCompleted,
                status: enrollment.status,
                grades: enrollment.grades
            }
        });

    } catch (error) {
        next(error);
    }
};

// Helper function to check if module is unlocked
function checkModuleUnlock(module, moduleProgressList, enrollment) {
    // First module is always unlocked for enrolled users
    if (module.order === 1) {
        return !!enrollment;
    }

    // Check if previous module is completed
    if (module.unlockCriteria?.previousModuleCompleted) {
        const prevModuleProgress = moduleProgressList.find(mp => {
            // Find progress for the module with order = current order - 1
            return mp.isCompleted;
        });

        // This is simplified - in real implementation, 
        // you'd check specific previous module
        const completedModulesCount = moduleProgressList.filter(mp => mp.isCompleted).length;
        return completedModulesCount >= module.order - 1;
    }

    return false;
}

module.exports = exports;