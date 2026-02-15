const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Notification = require('../models/Notification');

// @desc    Get submissions for grading
// @route   GET /api/grading/assignments/:assignmentId/submissions
// @access  Private/Admin
exports.getSubmissionsForGrading = async (req, res, next) => {
    try {
        const { assignmentId } = req.params;
        const { status, page = 1, limit = 20 } = req.query;

        const filter = { assignment: assignmentId };
        if (status) filter.status = status;

        const total = await Submission.countDocuments(filter);
        
        const submissions = await Submission.find(filter)
            .populate('student', 'fullName email profilePicture')
            .sort({ submittedAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const assignment = await Assignment.findById(assignmentId)
            .select('title totalPoints passingScore rubric');

        // Stats
        const stats = await Submission.aggregate([
            { $match: { assignment: require('mongoose').Types.ObjectId(assignmentId) } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const statusCounts = {};
        stats.forEach(s => {
            statusCounts[s._id] = s.count;
        });

        res.status(200).json({
            success: true,
            data: {
                assignment,
                submissions,
                stats: statusCounts,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Grade a submission
// @route   PUT /api/grading/submissions/:submissionId/grade
// @access  Private/Admin
exports.gradeSubmission = async (req, res, next) => {
    try {
        const { submissionId } = req.params;
        const { 
            answerScores, 
            rubricScores, 
            generalFeedback, 
            strengths, 
            areasForImprovement 
        } = req.body;

        const submission = await Submission.findById(submissionId)
            .populate('assignment');

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        // Update answer scores
        if (answerScores && Array.isArray(answerScores)) {
            answerScores.forEach(score => {
                const answer = submission.answers.find(
                    a => a.questionIndex === score.questionIndex
                );
                if (answer) {
                    answer.manualScore = score.score;
                    answer.feedback = score.feedback;
                    answer.isAutoGraded = false;
                }
            });
        }

        // Update grading details
        submission.grading = {
            rubricScores: rubricScores || [],
            generalFeedback,
            strengths: strengths || [],
            areasForImprovement: areasForImprovement || [],
            gradedBy: req.user.id,
            gradedAt: new Date()
        };

        // Calculate manual score from answer scores
        const manualScore = submission.answers.reduce((sum, a) => {
            return sum + (a.manualScore || a.autoScore || 0);
        }, 0);
        submission.manualScore = manualScore;

        // Calculate final score
        submission.calculateFinalScore(
            submission.assignment.totalPoints,
            submission.assignment.passingScore
        );

        submission.status = 'graded';
        await submission.save();

        // Update assignment stats
        const assignment = await Assignment.findById(submission.assignment._id);
        assignment.gradedSubmissions += 1;
        
        // Update average score
        const gradedSubmissions = await Submission.find({
            assignment: assignment._id,
            status: 'graded'
        });
        const avgScore = gradedSubmissions.reduce((sum, s) => sum + s.percentage, 0) / gradedSubmissions.length;
        assignment.averageScore = Math.round(avgScore);
        await assignment.save();

        // Update enrollment grades
        await updateEnrollmentGrades(submission.student, submission.course);

        // Notify student
        await Notification.create({
            recipient: submission.student,
            type: 'assignment-graded',
            title: 'Assignment Graded! 📊',
            message: `Your submission for "${assignment.title}" has been graded. Score: ${submission.percentage}%`,
            link: `/assignments/${assignment._id}/submission/${submission._id}`,
            priority: 'high'
        });

        res.status(200).json({
            success: true,
            message: 'Submission graded successfully',
            data: {
                submission: {
                    id: submission._id,
                    status: submission.status,
                    rawScore: submission.rawScore,
                    finalScore: submission.finalScore,
                    percentage: submission.percentage,
                    passed: submission.passed
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Batch grade submissions
// @route   PUT /api/grading/assignments/:assignmentId/batch-grade
// @access  Private/Admin
exports.batchGradeSubmissions = async (req, res, next) => {
    try {
        const { assignmentId } = req.params;
        const { grades } = req.body; // Array of { submissionId, score, feedback }

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        const results = [];

        for (const grade of grades) {
            const submission = await Submission.findById(grade.submissionId);
            if (!submission) continue;

            submission.manualScore = grade.score;
            submission.grading = {
                generalFeedback: grade.feedback,
                gradedBy: req.user.id,
                gradedAt: new Date()
            };

            submission.calculateFinalScore(
                assignment.totalPoints,
                assignment.passingScore
            );

            submission.status = 'graded';
            await submission.save();

            // Update enrollment grades
            await updateEnrollmentGrades(submission.student, submission.course);

            // Notify student
            await Notification.create({
                recipient: submission.student,
                type: 'assignment-graded',
                title: 'Assignment Graded! 📊',
                message: `Your submission for "${assignment.title}" has been graded.`,
                priority: 'medium'
            });

            results.push({
                submissionId: submission._id,
                status: 'graded',
                score: submission.finalScore
            });
        }

        res.status(200).json({
            success: true,
            message: `${results.length} submissions graded`,
            data: { results }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Request resubmission
// @route   PUT /api/grading/submissions/:submissionId/request-resubmit
// @access  Private/Admin
exports.requestResubmission = async (req, res, next) => {
    try {
        const { submissionId } = req.params;
        const { reason, feedback } = req.body;

        const submission = await Submission.findById(submissionId)
            .populate('assignment', 'title maxAttempts');

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        submission.status = 'resubmit-requested';
        submission.resubmissionReason = reason;
        submission.grading = {
            ...submission.grading,
            generalFeedback: feedback,
            gradedBy: req.user.id,
            gradedAt: new Date()
        };

        await submission.save();

        // Notify student
        await Notification.create({
            recipient: submission.student,
            type: 'assignment-graded',
            title: 'Resubmission Requested 🔄',
            message: `Your submission for "${submission.assignment.title}" requires resubmission. Reason: ${reason}`,
            link: `/assignments/${submission.assignment._id}`,
            priority: 'high'
        });

        res.status(200).json({
            success: true,
            message: 'Resubmission requested',
            data: { submission }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get grading statistics
// @route   GET /api/grading/assignments/:assignmentId/stats
// @access  Private/Admin
exports.getGradingStats = async (req, res, next) => {
    try {
        const { assignmentId } = req.params;

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        // Get all submissions
        const submissions = await Submission.find({ 
            assignment: assignmentId,
            status: 'graded'
        });

        if (submissions.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    stats: {
                        totalSubmissions: 0,
                        gradedSubmissions: 0,
                        averageScore: 0,
                        passRate: 0,
                        scoreDistribution: []
                    }
                }
            });
        }

        // Calculate statistics
        const scores = submissions.map(s => s.percentage);
        const passedCount = submissions.filter(s => s.passed).length;

        const stats = {
            totalSubmissions: await Submission.countDocuments({ assignment: assignmentId }),
            gradedSubmissions: submissions.length,
            averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
            highestScore: Math.max(...scores),
            lowestScore: Math.min(...scores),
            passRate: Math.round((passedCount / submissions.length) * 100),
            passedCount,
            failedCount: submissions.length - passedCount,
            // Score distribution
            scoreDistribution: [
                { range: '0-20', count: scores.filter(s => s >= 0 && s < 20).length },
                { range: '20-40', count: scores.filter(s => s >= 20 && s < 40).length },
                { range: '40-60', count: scores.filter(s => s >= 40 && s < 60).length },
                { range: '60-80', count: scores.filter(s => s >= 60 && s < 80).length },
                { range: '80-100', count: scores.filter(s => s >= 80 && s <= 100).length }
            ],
            // Late submissions
            lateSubmissions: submissions.filter(s => s.isLate).length,
            // Average time spent
            averageTimeSpent: Math.round(
                submissions.reduce((sum, s) => sum + (s.timeSpent || 0), 0) / submissions.length / 60
            ) // in minutes
        };

        // Question-wise analysis
        const questionAnalysis = assignment.questions.map((q, index) => {
            const answers = submissions.map(s => s.answers[index]);
            const correctCount = answers.filter(a => a?.isCorrect).length;
            
            return {
                questionIndex: index,
                questionText: q.questionText.substring(0, 50) + '...',
                correctRate: Math.round((correctCount / answers.length) * 100),
                averageScore: Math.round(
                    answers.reduce((sum, a) => sum + (a?.autoScore || a?.manualScore || 0), 0) / answers.length
                )
            };
        });

        res.status(200).json({
            success: true,
            data: {
                stats,
                questionAnalysis
            }
        });

    } catch (error) {
        next(error);
    }
};

// Helper: Update enrollment grades
async function updateEnrollmentGrades(studentId, courseId) {
    const enrollment = await Enrollment.findOne({
        user: studentId,
        course: courseId
    });

    if (!enrollment) return;

    // Get all graded submissions for this course
    const submissions = await Submission.find({
        student: studentId,
        course: courseId,
        status: 'graded'
    });

    if (submissions.length === 0) return;

    // Calculate assignment average
    const totalScore = submissions.reduce((sum, s) => sum + s.percentage, 0);
    enrollment.grades.assignmentAverage = Math.round(totalScore / submissions.length);

    // Recalculate overall grade
    const course = await require('../models/Course').findById(courseId);
    if (course) {
        enrollment.calculateOverallGrade(course.gradeWeights);
    }

    await enrollment.save();
}

module.exports = exports;