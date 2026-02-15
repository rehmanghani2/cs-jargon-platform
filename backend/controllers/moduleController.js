const Module = require('../models/Module');
const ModuleProgress = require('../models/ModuleProgress');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const BadgeService = require('../services/badgeService');
const Notification = require('../models/Notification');
const AttendanceService = require('../utils/attendanceService');

// @desc    Get module with lessons
// @route   GET /api/modules/:id
// @access  Private
exports.getModule = async (req, res, next) => {
    try {
        const module = await Module.findById(req.params.id)
            .populate('jargonsToLearn', 'term definition examples')
            .populate('course', 'title level');

        if (!module) {
            return res.status(404).json({
                success: false,
                message: 'Module not found'
            });
        }

        // Check enrollment
        const enrollment = await Enrollment.findOne({
            user: req.user.id,
            course: module.course._id
        });

        if (!enrollment) {
            return res.status(403).json({
                success: false,
                message: 'You must be enrolled in this course to access the module'
            });
        }

        // Get or create module progress
        let progress = await ModuleProgress.findOne({
            user: req.user.id,
            module: module._id
        });

        if (!progress) {
            progress = await ModuleProgress.create({
                user: req.user.id,
                course: module.course._id,
                module: module._id,
                isStarted: true,
                startedAt: new Date()
            });
        }

        // Check if module is unlocked
        const isUnlocked = await checkModuleAccess(module, req.user.id);
        if (!isUnlocked) {
            return res.status(403).json({
                success: false,
                message: 'This module is locked. Complete previous modules first.'
            });
        }

        // Format lessons with completion status
        const lessonsWithProgress = module.lessons.map((lesson, index) => {
            const isCompleted = progress.lessonsCompleted.some(
                lc => lc.lessonIndex === index
            );
            return {
                ...lesson.toObject(),
                index,
                isCompleted,
                isLocked: index > 0 && !progress.lessonsCompleted.some(
                    lc => lc.lessonIndex === index - 1
                ) && module.lessons[index - 1]?.isRequired
            };
        });

        // Update last accessed
        progress.lastAccessedAt = new Date();
        await progress.save();


        res.status(200).json({
            success: true,
            data: {
                module: {
                    ...module.toObject(),
                    lessons: lessonsWithProgress
                },
                progress: {
                    lessonsCompleted: progress.totalLessonsCompleted,
                    totalLessons: module.lessons.length,
                    progressPercentage: progress.progressPercentage,
                    quizAttempts: progress.quizAttempts.length,
                    bestQuizScore: progress.bestQuizScore,
                    quizPassed: progress.quizPassed,
                    isCompleted: progress.isCompleted
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get specific lesson
// @route   GET /api/modules/:moduleId/lessons/:lessonIndex
// @access  Private
exports.getLesson = async (req, res, next) => {
    try {
        const { moduleId, lessonIndex } = req.params;
        const index = parseInt(lessonIndex);

        const module = await Module.findById(moduleId)
            .populate('lessons.jargonsIntroduced', 'term definition pronunciation examples');

        if (!module) {
            return res.status(404).json({
                success: false,
                message: 'Module not found'
            });
        }

        if (index < 0 || index >= module.lessons.length) {
            return res.status(404).json({
                success: false,
                message: 'Lesson not found'
            });
        }

        const lesson = module.lessons[index];

        // Check access
        const progress = await ModuleProgress.findOne({
            user: req.user.id,
            module: moduleId
        });

        if (!progress) {
            return res.status(403).json({
                success: false,
                message: 'Start the module first'
            });
        }

        // Check if lesson is unlocked
        if (index > 0 && !lesson.isPreview) {
            const prevLessonComplete = progress.lessonsCompleted.some(
                lc => lc.lessonIndex === index - 1
            );
            if (!prevLessonComplete && module.lessons[index - 1]?.isRequired) {
                return res.status(403).json({
                    success: false,
                    message: 'Complete the previous lesson first'
                });
            }
        }

        const isCompleted = progress.lessonsCompleted.some(
            lc => lc.lessonIndex === index
        );

        res.status(200).json({
            success: true,
            data: {
                lesson: {
                    ...lesson.toObject(),
                    index,
                    isCompleted
                },
                navigation: {
                    hasPrevious: index > 0,
                    hasNext: index < module.lessons.length - 1,
                    previousIndex: index > 0 ? index - 1 : null,
                    nextIndex: index < module.lessons.length - 1 ? index + 1 : null,
                    totalLessons: module.lessons.length
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Complete a lesson
// @route   POST /api/modules/:moduleId/lessons/:lessonIndex/complete
// @access  Private
exports.completeLesson = async (req, res, next) => {
    try {
        const { moduleId, lessonIndex } = req.params;
        const { timeSpent } = req.body;
        const index = parseInt(lessonIndex);

        const module = await Module.findById(moduleId);
        if (!module || index < 0 || index >= module.lessons.length) {
            return res.status(404).json({
                success: false,
                message: 'Module or lesson not found'
            });
        }

        let progress = await ModuleProgress.findOne({
            user: req.user.id,
            module: moduleId
        });

        if (!progress) {
            return res.status(400).json({
                success: false,
                message: 'Start the module first'
            });
        }

        // Check if already completed
        const alreadyCompleted = progress.lessonsCompleted.some(
            lc => lc.lessonIndex === index
        );

        if (!alreadyCompleted) {
            progress.lessonsCompleted.push({
                lessonIndex: index,
                lessonId: module.lessons[index]._id,
                completedAt: new Date(),
                timeSpent: timeSpent || 0
            });
            progress.totalLessonsCompleted = progress.lessonsCompleted.length;
            progress.totalTimeSpent += timeSpent || 0;

            // Update current lesson index
            if (index >= progress.currentLessonIndex) {
                progress.currentLessonIndex = index + 1;
            }
        }

        // Calculate progress
        progress.calculateProgress(module.lessons.length, module.quiz?.questions?.length > 0);

        // Check completion
        progress.checkCompletion(module);

        await progress.save();

         // ... inside completeLesson, after progress.save():

        await AttendanceService.recordActivity(req.user.id, {
            type: 'lesson',
            itemId: module.lessons[index]._id,
            moduleId: module._id
        })

        // Update course progress
        await updateCourseProgress(req.user.id, module.course);

        // Check for badges
        await BadgeService.checkAndAwardBadges(req.user.id, 'module-complete');

        res.status(200).json({
            success: true,
            message: 'Lesson completed',
            data: {
                lessonsCompleted: progress.totalLessonsCompleted,
                totalLessons: module.lessons.length,
                progressPercentage: progress.progressPercentage,
                moduleCompleted: progress.isCompleted,
                nextLessonIndex: index < module.lessons.length - 1 ? index + 1 : null,
                quizAvailable: index === module.lessons.length - 1 && module.quiz?.questions?.length > 0
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get module quiz
// @route   GET /api/modules/:id/quiz
// @access  Private
exports.getModuleQuiz = async (req, res, next) => {
    try {
        const module = await Module.findById(req.params.id);

        if (!module) {
            return res.status(404).json({
                success: false,
                message: 'Module not found'
            });
        }

        if (!module.quiz || !module.quiz.questions?.length) {
            return res.status(404).json({
                success: false,
                message: 'This module has no quiz'
            });
        }

        // Check if all lessons completed
        const progress = await ModuleProgress.findOne({
            user: req.user.id,
            module: req.params.id
        });

        if (!progress) {
            return res.status(400).json({
                success: false,
                message: 'Start the module first'
            });
        }

        const allLessonsComplete = progress.totalLessonsCompleted >= module.lessons.length;
        if (!allLessonsComplete) {
            return res.status(403).json({
                success: false,
                message: 'Complete all lessons before taking the quiz',
                lessonsCompleted: progress.totalLessonsCompleted,
                totalLessons: module.lessons.length
            });
        }

        // Check attempts
        if (progress.quizAttempts.length >= module.quiz.attemptsAllowed) {
            return res.status(403).json({
                success: false,
                message: `You have used all ${module.quiz.attemptsAllowed} attempts for this quiz`,
                bestScore: progress.bestQuizScore,
                passed: progress.quizPassed
            });
        }

        // Format quiz questions (remove correct answers)
        let questions = module.quiz.questions.map((q, index) => {
            const formatted = {
                index,
                question: q.question,
                questionType: q.questionType,
                points: q.points
            };

            switch (q.questionType) {
                case 'multiple-choice':
                case 'true-false':
                    formatted.options = q.options;
                    break;
                case 'matching':
                    formatted.matchingPairs = {
                        leftColumn: q.matchingPairs.leftColumn,
                        rightColumn: shuffleArray([...q.matchingPairs.rightColumn])
                    };
                    break;
                case 'fill-blank':
                    formatted.options = q.options;
                    break;
            }

            return formatted;
        });

        // Shuffle questions if enabled
        if (module.quiz.shuffleQuestions) {
            questions = shuffleArray(questions);
        }

        res.status(200).json({
            success: true,
            data: {
                quiz: {
                    title: module.quiz.title,
                    description: module.quiz.description,
                    instructions: module.quiz.instructions,
                    totalQuestions: module.quiz.totalQuestions,
                    totalPoints: module.quiz.totalPoints,
                    timeLimit: module.quiz.timeLimit,
                    passingScore: module.quiz.passingScore,
                    attemptsAllowed: module.quiz.attemptsAllowed,
                    attemptsUsed: progress.quizAttempts.length,
                    questions
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Submit module quiz
// @route   POST /api/modules/:id/quiz/submit
// @access  Private
exports.submitModuleQuiz = async (req, res, next) => {
    try {
        const { answers, timeSpent } = req.body;

        const module = await Module.findById(req.params.id);
        if (!module || !module.quiz) {
            return res.status(404).json({
                success: false,
                message: 'Module or quiz not found'
            });
        }

        let progress = await ModuleProgress.findOne({
            user: req.user.id,
            module: req.params.id
        });

        if (!progress) {
            return res.status(400).json({
                success: false,
                message: 'Start the module first'
            });
        }

        // Check attempts
        if (progress.quizAttempts.length >= module.quiz.attemptsAllowed) {
            return res.status(403).json({
                success: false,
                message: 'No attempts remaining'
            });
        }

        // Grade quiz
        const gradingResult = gradeQuiz(module.quiz.questions, answers);

        // Create attempt record
        const attempt = {
            attemptNumber: progress.quizAttempts.length + 1,
            startedAt: new Date(Date.now() - (timeSpent || 0) * 1000),
            completedAt: new Date(),
            answers: gradingResult.answers,
            score: gradingResult.earnedPoints,
            percentage: gradingResult.percentage,
            passed: gradingResult.percentage >= module.quiz.passingScore,
            timeSpent: timeSpent || 0
        };

        progress.quizAttempts.push(attempt);

        // Update best score
        if (gradingResult.percentage > progress.bestQuizScore) {
            progress.bestQuizScore = gradingResult.percentage;
        }

        // Check if passed
        if (attempt.passed && !progress.quizPassed) {
            progress.quizPassed = true;

            // Award badge for perfect score
            if (gradingResult.percentage === 100) {
                await BadgeService.checkAndAwardBadges(req.user.id, 'quiz-score', 100);
            }
        }

        // Recalculate progress
        progress.calculateProgress(module.lessons.length, true);
        progress.checkCompletion(module);

        await progress.save();

        // Update course progress
        await updateCourseProgress(req.user.id, module.course);

        // Check module completion badge
        if (progress.isCompleted) {
            await BadgeService.checkAndAwardBadges(req.user.id, 'module-complete');
        }

        // Format results
        let detailedResults = null;
        if (module.quiz.showCorrectAnswers) {
            detailedResults = module.quiz.questions.map((q, index) => ({
                questionIndex: index,
                question: q.question,
                userAnswer: answers[index],
                correctAnswer: q.correctAnswer || q.matchingPairs?.correctMatches,
                isCorrect: gradingResult.answers[index]?.isCorrect,
                explanation: q.explanation,
                pointsEarned: gradingResult.answers[index]?.pointsEarned,
                maxPoints: q.points
            }));
        }

        res.status(200).json({
            success: true,
            message: attempt.passed ? 'Quiz passed!' : 'Quiz completed',
            data: {
                attempt: {
                    attemptNumber: attempt.attemptNumber,
                    score: gradingResult.earnedPoints,
                    totalPoints: gradingResult.totalPoints,
                    percentage: gradingResult.percentage,
                    passed: attempt.passed,
                    correctAnswers: gradingResult.correctCount,
                    totalQuestions: module.quiz.totalQuestions
                },
                progress: {
                    bestScore: progress.bestQuizScore,
                    quizPassed: progress.quizPassed,
                    attemptsRemaining: module.quiz.attemptsAllowed - progress.quizAttempts.length,
                    moduleCompleted: progress.isCompleted,
                    moduleProgressPercentage: progress.progressPercentage
                },
                detailedResults
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get quiz results
// @route   GET /api/modules/:id/quiz/results
// @access  Private
exports.getQuizResults = async (req, res, next) => {
    try {
        const progress = await ModuleProgress.findOne({
            user: req.user.id,
            module: req.params.id
        });

        if (!progress || !progress.quizAttempts.length) {
            return res.status(404).json({
                success: false,
                message: 'No quiz attempts found'
            });
        }

        const module = await Module.findById(req.params.id);

        res.status(200).json({
            success: true,
            data: {
                quizTitle: module.quiz.title,
                passingScore: module.quiz.passingScore,
                attemptsAllowed: module.quiz.attemptsAllowed,
                bestScore: progress.bestQuizScore,
                passed: progress.quizPassed,
                attempts: progress.quizAttempts.map(attempt => ({
                    attemptNumber: attempt.attemptNumber,
                    completedAt: attempt.completedAt,
                    score: attempt.score,
                    percentage: attempt.percentage,
                    passed: attempt.passed,
                    timeSpent: attempt.timeSpent
                }))
            }
        });

    } catch (error) {
        next(error);
    }
};

// ============== HELPER FUNCTIONS ==============

// Check if user can access module
async function checkModuleAccess(module, userId) {
    if (module.order === 1) {
        return true;
    }

    // Get all module progress for the course
    const allProgress = await ModuleProgress.find({
        user: userId,
        course: module.course
    }).populate('module', 'order');

    // Check if previous module is completed
    const previousModuleProgress = allProgress.find(
        p => p.module.order === module.order - 1
    );

    if (!previousModuleProgress || !previousModuleProgress.isCompleted) {
        return false;
    }

    // Check minimum quiz score if required
    if (module.unlockCriteria?.minimumQuizScore) {
        if (previousModuleProgress.bestQuizScore < module.unlockCriteria.minimumQuizScore) {
            return false;
        }
    }

    return true;
}

// Update course progress after module activity
async function updateCourseProgress(userId, courseId) {
    const enrollment = await Enrollment.findOne({
        user: userId,
        course: courseId
    });

    if (!enrollment) return;

    const course = await Course.findById(courseId);
    const allProgress = await ModuleProgress.find({
        user: userId,
        course: courseId
    });

    const completedModules = allProgress.filter(p => p.isCompleted).length;
    const totalProgress = course.totalModules > 0
        ? Math.round((completedModules / course.totalModules) * 100)
        : 0;

    const quizScores = allProgress
        .filter(p => p.bestQuizScore > 0)
        .map(p => p.bestQuizScore);
    const quizAverage = quizScores.length > 0
        ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
        : 0;

    enrollment.totalModulesCompleted = completedModules;
    enrollment.progressPercentage = totalProgress;
    enrollment.grades.quizAverage = quizAverage;
    enrollment.lastAccessedAt = new Date();

    // Find current module index
    const incompleteModules = allProgress
        .filter(p => !p.isCompleted)
        .sort((a, b) => a.module.order - b.module.order);
    
    if (incompleteModules.length > 0) {
        const currentModule = await Module.findById(incompleteModules[0].module);
        enrollment.currentModuleIndex = currentModule?.order || 0;
    }

    await enrollment.save();
}

// Grade quiz
function gradeQuiz(questions, userAnswers) {
    let correctCount = 0;
    let earnedPoints = 0;
    const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0);

    const answers = questions.map((question, index) => {
        const userAnswer = userAnswers[index];
        let isCorrect = false;

        switch (question.questionType) {
            case 'multiple-choice':
            case 'true-false':
            case 'fill-blank':
                isCorrect = userAnswer === question.correctAnswer;
                break;
            case 'matching':
                isCorrect = checkMatchingAnswer(
                    question.matchingPairs.correctMatches,
                    userAnswer
                );
                break;
            case 'short-answer':
                // Case-insensitive comparison for short answers
                isCorrect = userAnswer?.toLowerCase().trim() === 
                    question.correctAnswer?.toLowerCase().trim();
                break;
        }

        const pointsEarned = isCorrect ? (question.points || 1) : 0;
        if (isCorrect) correctCount++;
        earnedPoints += pointsEarned;

        return {
            questionIndex: index,
            userAnswer,
            isCorrect,
            pointsEarned
        };
    });

    return {
        answers,
        correctCount,
        earnedPoints,
        totalPoints,
        percentage: Math.round((earnedPoints / totalPoints) * 100)
    };
}

// Check matching answers
function checkMatchingAnswer(correctMatches, userMatches) {
    if (!Array.isArray(userMatches) || userMatches.length !== correctMatches.length) {
        return false;
    }

    const sortedCorrect = [...correctMatches].sort((a, b) => 
        a.leftId.localeCompare(b.leftId)
    );
    const sortedUser = [...userMatches].sort((a, b) => 
        a.leftId.localeCompare(b.leftId)
    );

    return sortedCorrect.every((match, index) =>
        match.leftId === sortedUser[index]?.leftId &&
        match.rightId === sortedUser[index]?.rightId
    );
}

// Shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

module.exports = exports;