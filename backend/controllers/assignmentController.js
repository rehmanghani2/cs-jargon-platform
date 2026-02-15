const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const Notification = require('../models/Notification');
const BadgeService = require('../services/badgeService');
const { validationResult } = require('express-validator');

// @desc    Get all assignments for a course
// @route   GET /api/assignments/course/:courseId
// @access  Private
exports.getCourseAssignments = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const { status, type, module } = req.query;

        // Verify enrollment
        const enrollment = await Enrollment.findOne({
            user: req.user.id,
            course: courseId
        });

        if (!enrollment) {
            return res.status(403).json({
                success: false,
                message: 'You must be enrolled in this course to view assignments'
            });
        }

        // Build filter
        const filter = { 
            course: courseId,
            status: 'published'
        };
        
        if (type) filter.type = type;
        if (module) filter.module = module;

        const assignments = await Assignment.find(filter)
            .populate('module', 'title weekNumber')
            .populate('jargonsFocused', 'term')
            .sort({ dueDate: 1 });

        // Get user's submissions for these assignments
        const assignmentIds = assignments.map(a => a._id);
        const submissions = await Submission.find({
            assignment: { $in: assignmentIds },
            student: req.user.id
        }).select('assignment status finalScore percentage submittedAt');

        // Create a map of assignment submissions
        const submissionMap = {};
        submissions.forEach(sub => {
            submissionMap[sub.assignment.toString()] = sub;
        });

        // Add submission status to each assignment
        const assignmentsWithStatus = assignments.map(assignment => {
            const submission = submissionMap[assignment._id.toString()];
            const now = new Date();
            
            return {
                ...assignment.toObject(),
                submission: submission ? {
                    id: submission._id,
                    status: submission.status,
                    score: submission.finalScore,
                    percentage: submission.percentage,
                    submittedAt: submission.submittedAt
                } : null,
                isOpen: assignment.isOpen(),
                isOverdue: now > assignment.dueDate && !submission,
                canSubmit: assignment.isOpen() && (!submission || submission.status === 'resubmit-requested'),
                daysUntilDue: Math.ceil((assignment.dueDate - now) / (1000 * 60 * 60 * 24))
            };
        });

        res.status(200).json({
            success: true,
            count: assignments.length,
            data: { assignments: assignmentsWithStatus }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get single assignment with questions
// @route   GET /api/assignments/:id
// @access  Private
exports.getAssignment = async (req, res, next) => {
    try {
        const assignment = await Assignment.findById(req.params.id)
            .populate('course', 'title level')
            .populate('module', 'title weekNumber')
            .populate('jargonsFocused', 'term definition examples')
            .populate('createdBy', 'fullName');

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        // Check enrollment
        const enrollment = await Enrollment.findOne({
            user: req.user.id,
            course: assignment.course._id
        });

        if (!enrollment && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You must be enrolled in this course'
            });
        }

        // Get user's submission if exists
        const submission = await Submission.findOne({
            assignment: assignment._id,
            student: req.user.id
        }).sort({ attemptNumber: -1 });

        // Format questions (hide correct answers for students)
        let formattedQuestions = assignment.questions;
        if (req.user.role !== 'admin') {
            formattedQuestions = assignment.questions.map(q => {
                const formatted = {
                    _id: q._id,
                    questionNumber: q.questionNumber,
                    questionText: q.questionText,
                    questionType: q.questionType,
                    instructions: q.instructions,
                    points: q.points
                };

                switch (q.questionType) {
                    case 'multiple-choice':
                        formatted.options = q.options;
                        break;
                    case 'matching':
                        formatted.matchingPairs = {
                            leftColumn: q.matchingPairs.leftColumn,
                            rightColumn: shuffleArray([...q.matchingPairs.rightColumn])
                        };
                        break;
                    case 'fill-blank':
                        formatted.blankSentence = q.blankSentence;
                        break;
                    case 'definition':
                        formatted.termToDefine = q.termToDefine;
                        break;
                    case 'paraphrase':
                        formatted.originalText = q.originalText;
                        break;
                }

                return formatted;
            });
        }

        res.status(200).json({
            success: true,
            data: {
                assignment: {
                    ...assignment.toObject(),
                    questions: formattedQuestions
                },
                submission: submission ? {
                    id: submission._id,
                    status: submission.status,
                    attemptNumber: submission.attemptNumber,
                    submittedAt: submission.submittedAt,
                    score: submission.finalScore,
                    percentage: submission.percentage,
                    grading: submission.grading
                } : null,
                canSubmit: assignment.isOpen() && 
                    (!submission || 
                     submission.status === 'resubmit-requested' ||
                     (submission.attemptNumber < assignment.maxAttempts)),
                attemptsRemaining: assignment.maxAttempts - (submission?.attemptNumber || 0)
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Start assignment (create draft submission)
// @route   POST /api/assignments/:id/start
// @access  Private
exports.startAssignment = async (req, res, next) => {
    try {
        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        if (!assignment.isOpen()) {
            return res.status(400).json({
                success: false,
                message: 'This assignment is not currently open for submissions'
            });
        }

        // Check for existing submission
        const existingSubmission = await Submission.findOne({
            assignment: assignment._id,
            student: req.user.id,
            status: { $in: ['draft', 'submitted', 'graded'] }
        }).sort({ attemptNumber: -1 });

        if (existingSubmission) {
            if (existingSubmission.status === 'draft') {
                // Return existing draft
                return res.status(200).json({
                    success: true,
                    message: 'Continuing existing draft',
                    data: { submission: existingSubmission }
                });
            }
            
            if (existingSubmission.attemptNumber >= assignment.maxAttempts) {
                return res.status(400).json({
                    success: false,
                    message: 'You have used all available attempts'
                });
            }
        }

        // Create new draft submission
        const attemptNumber = existingSubmission 
            ? existingSubmission.attemptNumber + 1 
            : 1;

        const submission = await Submission.create({
            assignment: assignment._id,
            student: req.user.id,
            course: assignment.course,
            attemptNumber,
            startedAt: new Date(),
            status: 'draft',
            answers: assignment.questions.map((q, index) => ({
                questionIndex: index,
                questionId: q._id,
                answer: null
            }))
        });

        res.status(201).json({
            success: true,
            message: 'Assignment started',
            data: {
                submission: {
                    id: submission._id,
                    attemptNumber: submission.attemptNumber,
                    startedAt: submission.startedAt
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Save draft answer
// @route   PUT /api/assignments/:id/save-draft
// @access  Private
exports.saveDraft = async (req, res, next) => {
    try {
        const { submissionId, answers, textContent } = req.body;

        const submission = await Submission.findOne({
            _id: submissionId,
            student: req.user.id,
            status: 'draft'
        });

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Draft submission not found'
            });
        }

        // Update answers
        if (answers && Array.isArray(answers)) {
            answers.forEach(answer => {
                const existingAnswer = submission.answers.find(
                    a => a.questionIndex === answer.questionIndex
                );
                if (existingAnswer) {
                    existingAnswer.answer = answer.answer;
                }
            });
        }

        // Update text content if provided
        if (textContent !== undefined) {
            submission.textContent = textContent;
        }

        await submission.save();

        res.status(200).json({
            success: true,
            message: 'Draft saved',
            data: { savedAt: new Date() }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Submit assignment
// @route   POST /api/assignments/:id/submit
// @access  Private
exports.submitAssignment = async (req, res, next) => {
    try {
        const { submissionId, answers, textContent, timeSpent } = req.body;

        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        let submission = await Submission.findOne({
            _id: submissionId,
            assignment: assignment._id,
            student: req.user.id,
            status: 'draft'
        });

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Draft submission not found'
            });
        }

        // Update answers
        if (answers && Array.isArray(answers)) {
            answers.forEach(answer => {
                const existingAnswer = submission.answers.find(
                    a => a.questionIndex === answer.questionIndex
                );
                if (existingAnswer) {
                    existingAnswer.answer = answer.answer;
                    if (answer.fileUrl) {
                        existingAnswer.fileUrl = answer.fileUrl;
                        existingAnswer.fileName = answer.fileName;
                    }
                }
            });
        }

        // Update text content
        if (textContent !== undefined) {
            submission.textContent = textContent;
        }

        // Check if late
        const now = new Date();
        submission.submittedAt = now;
        submission.timeSpent = timeSpent || 0;
        
        if (assignment.isLate(now)) {
            submission.isLate = true;
            submission.daysLate = Math.ceil((now - assignment.dueDate) / (1000 * 60 * 60 * 24));
            submission.latePenalty = assignment.calculateLatePenalty(now);
        }

        // Auto-grade if applicable
        if (assignment.isAutoGraded || assignment.autoGradePercentage > 0) {
            const autoGradeResult = autoGradeSubmission(assignment, submission);
            submission.autoGradedScore = autoGradeResult.score;
            submission.autoGradedAt = now;
            submission.answers = autoGradeResult.answers;
        }

        // Update status
        submission.status = assignment.isAutoGraded && assignment.autoGradePercentage === 100
            ? 'auto-graded'
            : 'submitted';

        // If fully auto-graded, calculate final score
        if (submission.status === 'auto-graded') {
            submission.calculateFinalScore(assignment.totalPoints, assignment.passingScore);
            submission.status = 'graded';
        }

        await submission.save();

        // After submission.save()
        await AttendanceService.recordActivity(req.user.id, {
            type: 'assignment',
            itemId: submission._id
        });


        // Update assignment stats
        assignment.totalSubmissions += 1;
        if (submission.status === 'graded') {
            assignment.gradedSubmissions += 1;
            // Update average score
            const allSubmissions = await Submission.find({
                assignment: assignment._id,
                status: 'graded'
            });
            const avgScore = allSubmissions.reduce((sum, s) => sum + s.percentage, 0) / allSubmissions.length;
            assignment.averageScore = Math.round(avgScore);
        }
        await assignment.save();

        // Check for badge
        await BadgeService.checkAndAwardBadges(req.user.id, 'assignment-complete');

        // Assign peer reviews if enabled
        if (assignment.isPeerReviewEnabled && submission.status !== 'graded') {
            await assignPeerReviews(assignment, submission);
            submission.status = 'pending-review';
            await submission.save();
        }

        // Create notification
        await Notification.create({
            recipient: req.user.id,
            type: 'assignment-graded',
            title: 'Assignment Submitted! ✅',
            message: `Your submission for "${assignment.title}" has been received.${
                submission.isLate ? ' (Late submission - ' + submission.latePenalty + '% penalty applied)' : ''
            }`,
            link: `/assignments/${assignment._id}/submission/${submission._id}`,
            priority: 'medium'
        });

        res.status(200).json({
            success: true,
            message: submission.isLate 
                ? `Assignment submitted late (${submission.latePenalty}% penalty applied)`
                : 'Assignment submitted successfully',
            data: {
                submission: {
                    id: submission._id,
                    status: submission.status,
                    submittedAt: submission.submittedAt,
                    isLate: submission.isLate,
                    latePenalty: submission.latePenalty,
                    score: submission.status === 'graded' ? submission.finalScore : null,
                    percentage: submission.status === 'graded' ? submission.percentage : null,
                    passed: submission.status === 'graded' ? submission.passed : null
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get submission details
// @route   GET /api/assignments/:assignmentId/submission/:submissionId
// @access  Private
exports.getSubmission = async (req, res, next) => {
    try {
        const { assignmentId, submissionId } = req.params;

        const submission = await Submission.findOne({
            _id: submissionId,
            assignment: assignmentId
        })
        .populate('assignment')
        .populate('student', 'fullName email profilePicture')
        .populate('grading.gradedBy', 'fullName')
        .populate('peerReviews.reviewer', 'fullName profilePicture');

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        // Check authorization
        const isOwner = submission.student._id.toString() === req.user.id;
        const isAdmin = req.user.role === 'admin';
        
        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this submission'
            });
        }

        // Include answer details with correct answers if graded
        let answersWithDetails = submission.answers;
        if (submission.status === 'graded' || submission.status === 'returned') {
            answersWithDetails = submission.answers.map((answer, index) => {
                const question = submission.assignment.questions[index];
                return {
                    ...answer.toObject(),
                    question: {
                        questionText: question.questionText,
                        questionType: question.questionType,
                        points: question.points
                    },
                    correctAnswer: question.correctAnswer,
                    explanation: question.explanation
                };
            });
        }

        res.status(200).json({
            success: true,
            data: {
                submission: {
                    ...submission.toObject(),
                    answers: answersWithDetails
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get peer review assignments
// @route   GET /api/assignments/peer-reviews
// @access  Private
exports.getPeerReviewAssignments = async (req, res, next) => {
    try {
        const submissions = await Submission.find({
            'assignedPeerReviews.isCompleted': false,
            student: { $ne: req.user.id }
        });

        // Find submissions where this user is assigned as reviewer
        const myReviewAssignments = await Submission.find({
            student: req.user.id,
            'assignedPeerReviews.0': { $exists: true }
        })
        .populate('assignedPeerReviews.submission')
        .populate({
            path: 'assignment',
            select: 'title peerReviewSettings'
        });

        const pendingReviews = [];
        
        myReviewAssignments.forEach(submission => {
            submission.assignedPeerReviews.forEach(review => {
                if (!review.isCompleted) {
                    pendingReviews.push({
                        submissionToReview: review.submission._id,
                        assignmentTitle: submission.assignment.title,
                        deadline: submission.assignment.peerReviewSettings?.reviewDeadline,
                        assignedAt: review.assignedAt,
                        rubric: submission.assignment.peerReviewSettings?.reviewRubric
                    });
                }
            });
        });

        res.status(200).json({
            success: true,
            count: pendingReviews.length,
            data: { pendingReviews }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Submit peer review
// @route   POST /api/assignments/:assignmentId/submission/:submissionId/peer-review
// @access  Private
exports.submitPeerReview = async (req, res, next) => {
    try {
        const { submissionId } = req.params;
        const { scores, overallFeedback, strengths, improvements, timeSpent } = req.body;

        // Find the submission being reviewed
        const submissionToReview = await Submission.findById(submissionId)
            .populate('assignment');

        if (!submissionToReview) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        // Verify this user is assigned to review
        const mySubmission = await Submission.findOne({
            assignment: submissionToReview.assignment._id,
            student: req.user.id,
            'assignedPeerReviews.submission': submissionId
        });

        if (!mySubmission) {
            return res.status(403).json({
                success: false,
                message: 'You are not assigned to review this submission'
            });
        }

        // Check if already reviewed
        const alreadyReviewed = submissionToReview.peerReviews.some(
            r => r.reviewer.toString() === req.user.id
        );

        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this submission'
            });
        }

        // Calculate total score
        const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
        const maxScore = scores.reduce((sum, s) => sum + s.maxScore, 0);
        const normalizedScore = Math.round((totalScore / maxScore) * 100);

        // Add peer review
        submissionToReview.peerReviews.push({
            reviewer: req.user.id,
            scores,
            totalScore: normalizedScore,
            overallFeedback,
            strengths,
            improvements,
            timeSpent,
            reviewedAt: new Date()
        });

        // Update peer review score
        submissionToReview.calculatePeerReviewScore();

        // Check if all reviews received
        const requiredReviews = submissionToReview.assignment.peerReviewSettings.reviewsRequired;
        if (submissionToReview.peerReviewsReceived >= requiredReviews) {
            // Calculate final score including peer review weight
            const peerWeight = submissionToReview.assignment.peerReviewSettings.peerReviewWeight;
            const instructorWeight = 100 - peerWeight;
            
            const weightedScore = (
                (submissionToReview.rawScore * instructorWeight / 100) +
                (submissionToReview.peerReviewScore * peerWeight / 100)
            );
            
            submissionToReview.finalScore = Math.round(weightedScore);
            submissionToReview.percentage = submissionToReview.finalScore;
            submissionToReview.passed = submissionToReview.percentage >= submissionToReview.assignment.passingScore;
            submissionToReview.status = 'graded';
        }

        await submissionToReview.save();

        // Update reviewer's assigned reviews
        const reviewIndex = mySubmission.assignedPeerReviews.findIndex(
            r => r.submission.toString() === submissionId
        );
        if (reviewIndex !== -1) {
            mySubmission.assignedPeerReviews[reviewIndex].isCompleted = true;
            mySubmission.assignedPeerReviews[reviewIndex].completedAt = new Date();
            mySubmission.peerReviewsCompleted += 1;
            await mySubmission.save();
        }

        // Award badge for peer reviews
        await BadgeService.checkAndAwardBadges(req.user.id, 'peer-review');

        // Notify the submission owner
        await Notification.create({
            recipient: submissionToReview.student,
            type: 'assignment-graded',
            title: 'New Peer Review Received 📝',
            message: `You've received a peer review for your "${submissionToReview.assignment.title}" submission.`,
            priority: 'medium'
        });

        res.status(200).json({
            success: true,
            message: 'Peer review submitted successfully',
            data: {
                reviewsCompleted: mySubmission.peerReviewsCompleted
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get user's assignment statistics
// @route   GET /api/assignments/my-stats
// @access  Private
exports.getMyAssignmentStats = async (req, res, next) => {
    try {
        const submissions = await Submission.find({
            student: req.user.id,
            status: { $in: ['graded', 'returned'] }
        }).populate('assignment', 'title type totalPoints');

        const stats = {
            totalAssignments: submissions.length,
            completed: submissions.filter(s => s.status === 'graded').length,
            averageScore: 0,
            byType: {},
            recentSubmissions: []
        };

        if (submissions.length > 0) {
            // Calculate average score
            const totalScore = submissions.reduce((sum, s) => sum + s.percentage, 0);
            stats.averageScore = Math.round(totalScore / submissions.length);

            // Group by type
            submissions.forEach(sub => {
                const type = sub.assignment.type;
                if (!stats.byType[type]) {
                    stats.byType[type] = { count: 0, totalScore: 0 };
                }
                stats.byType[type].count += 1;
                stats.byType[type].totalScore += sub.percentage;
            });

            // Calculate average by type
            Object.keys(stats.byType).forEach(type => {
                stats.byType[type].averageScore = Math.round(
                    stats.byType[type].totalScore / stats.byType[type].count
                );
            });

            // Recent submissions
            stats.recentSubmissions = submissions
                .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
                .slice(0, 5)
                .map(sub => ({
                    assignmentTitle: sub.assignment.title,
                    type: sub.assignment.type,
                    score: sub.percentage,
                    submittedAt: sub.submittedAt
                }));
        }

        res.status(200).json({
            success: true,
            data: { stats }
        });

    } catch (error) {
        next(error);
    }
};

// ============== HELPER FUNCTIONS ==============

// Auto-grade submission
function autoGradeSubmission(assignment, submission) {
    let totalAutoScore = 0;
    
    const gradedAnswers = submission.answers.map((answer, index) => {
        const question = assignment.questions[index];
        
        if (!question.isAutoGraded) {
            return answer;
        }

        let isCorrect = false;
        
        switch (question.questionType) {
            case 'multiple-choice':
                isCorrect = answer.answer === question.correctAnswer;
                break;
                
            case 'fill-blank':
                const userAnswer = answer.answer?.toLowerCase().trim();
                isCorrect = question.acceptableAnswers?.some(
                    a => a.toLowerCase().trim() === userAnswer
                );
                break;
                
            case 'matching':
                isCorrect = checkMatchingAnswer(
                    question.matchingPairs.correctMatches,
                    answer.answer
                );
                break;
                
            default:
                isCorrect = answer.answer === question.correctAnswer;
        }

        const autoScore = isCorrect ? question.points : 0;
        totalAutoScore += autoScore;

        return {
            ...answer.toObject(),
            isAutoGraded: true,
            isCorrect,
            autoScore
        };
    });

    return {
        score: totalAutoScore,
        answers: gradedAnswers
    };
}

// Check matching answers
function checkMatchingAnswer(correctMatches, userMatches) {
    if (!Array.isArray(userMatches) || !correctMatches) return false;
    if (userMatches.length !== correctMatches.length) return false;

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

// Assign peer reviews
async function assignPeerReviews(assignment, submission) {
    const requiredReviews = assignment.peerReviewSettings.reviewsRequired;

    // Find other submissions for the same assignment
    const otherSubmissions = await Submission.find({
        assignment: assignment._id,
        student: { $ne: submission.student },
        status: { $in: ['submitted', 'pending-review', 'graded'] }
    }).limit(requiredReviews * 2);

    // Randomly select reviewers
    const shuffled = shuffleArray(otherSubmissions);
    const selectedSubmissions = shuffled.slice(0, requiredReviews);

    // Assign reviews to the selected students
    for (const otherSubmission of selectedSubmissions) {
        otherSubmission.assignedPeerReviews.push({
            submission: submission._id,
            assignedAt: new Date(),
            isCompleted: false
        });
        await otherSubmission.save();

        // Notify the reviewer
        await Notification.create({
            recipient: otherSubmission.student,
            type: 'assignment-due',
            title: 'New Peer Review Assignment 📋',
            message: `You have been assigned to review a submission for "${assignment.title}".`,
            link: `/assignments/${assignment._id}/peer-review`,
            priority: 'medium'
        });
    }
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