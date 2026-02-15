const PlacementTest = require('../models/PlacementTest');
const PlacementQuestion = require('../models/PlacementQuestion');
const User = require('../models/User');
const Course = require('../models/Course');
const Notification = require('../models/Notification');
const BadgeService = require('../services/badgeService');

// @desc    Start placement test
// @route   POST /api/placement-test/start
// @access  Private
exports.startPlacementTest = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        // Check if user already completed placement test
        if (user.placementTestCompleted) {
            return res.status(400).json({
                success: false,
                message: 'You have already completed the placement test',
                data: {
                    assignedLevel: user.assignedLevel,
                    score: user.placementTestScore
                }
            });
        }

        // Check for existing in-progress test
        const existingTest = await PlacementTest.findOne({
            user: req.user.id,
            status: 'in-progress'
        });

        if (existingTest) {
            // Return existing test to continue
            const populatedTest = await PlacementTest.findById(existingTest._id)
                .populate('questions.question');

            return res.status(200).json({
                success: true,
                message: 'Continuing existing test',
                data: {
                    testId: existingTest._id,
                    questions: formatQuestionsForClient(populatedTest.questions),
                    startedAt: existingTest.startedAt,
                    totalQuestions: existingTest.totalQuestions
                }
            });
        }

        // Generate new test questions
        const questions = await generateTestQuestions();

        // Create new placement test
        const placementTest = await PlacementTest.create({
            user: req.user.id,
            questions: questions.map(q => ({
                question: q._id,
                userAnswer: null,
                isCorrect: null,
                pointsEarned: 0,
                timeSpent: 0
            })),
            totalQuestions: questions.length,
            totalPoints: questions.reduce((sum, q) => sum + q.points, 0),
            status: 'in-progress'
        });

        res.status(201).json({
            success: true,
            message: 'Placement test started',
            data: {
                testId: placementTest._id,
                questions: formatQuestionsForClient(
                    questions.map((q, i) => ({
                        question: q,
                        index: i
                    }))
                ),
                startedAt: placementTest.startedAt,
                totalQuestions: questions.length,
                estimatedTime: Math.ceil(questions.reduce((sum, q) => sum + q.timeAllocation, 0) / 60) // in minutes
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Submit answer for a question
// @route   PUT /api/placement-test/:testId/answer
// @access  Private
exports.submitAnswer = async (req, res, next) => {
    try {
        const { questionIndex, answer, timeSpent } = req.body;

        const test = await PlacementTest.findOne({
            _id: req.params.testId,
            user: req.user.id,
            status: 'in-progress'
        }).populate('questions.question');

        if (!test) {
            return res.status(404).json({
                success: false,
                message: 'Test not found or already completed'
            });
        }

        if (questionIndex < 0 || questionIndex >= test.questions.length) {
            return res.status(400).json({
                success: false,
                message: 'Invalid question index'
            });
        }

        // Save answer
        test.questions[questionIndex].userAnswer = answer;
        test.questions[questionIndex].timeSpent = timeSpent || 0;

        await test.save();

        res.status(200).json({
            success: true,
            message: 'Answer saved',
            data: {
                questionIndex,
                saved: true
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Submit placement test
// @route   POST /api/placement-test/:testId/submit
// @access  Private
exports.submitPlacementTest = async (req, res, next) => {
    try {
        const { answers, totalTimeSpent } = req.body;

        const test = await PlacementTest.findOne({
            _id: req.params.testId,
            user: req.user.id,
            status: 'in-progress'
        }).populate('questions.question');

        if (!test) {
            return res.status(404).json({
                success: false,
                message: 'Test not found or already completed'
            });
        }

        // Save all answers if provided
        if (answers && Array.isArray(answers)) {
            answers.forEach((ans, index) => {
                if (index < test.questions.length) {
                    test.questions[index].userAnswer = ans.answer;
                    test.questions[index].timeSpent = ans.timeSpent || 0;
                }
            });
        }

        // Grade the test
        const gradingResult = gradeTest(test);

        // Update test with results
        test.completedAt = new Date();
        test.totalTimeSpent = totalTimeSpent || gradingResult.totalTimeSpent;
        test.correctAnswers = gradingResult.correctAnswers;
        test.earnedPoints = gradingResult.earnedPoints;
        test.percentageScore = gradingResult.percentageScore;
        test.categoryScores = gradingResult.categoryScores;
        test.skillScores = gradingResult.skillScores;
        test.difficultyScores = gradingResult.difficultyScores;
        test.status = 'completed';

        // Determine level
        const levelAssignment = determineLevel(gradingResult);
        test.assignedLevel = levelAssignment.level;
        test.levelCode = levelAssignment.levelCode;

        // Analyze strengths and weaknesses
        const analysis = analyzePerformance(gradingResult);
        test.strengthAreas = analysis.strengths;
        test.improvementAreas = analysis.weaknesses;

        // Generate personalized feedback
        test.feedback = generateFeedback(gradingResult, levelAssignment, analysis);

        // Update question results
        gradingResult.questionResults.forEach((result, index) => {
            test.questions[index].isCorrect = result.isCorrect;
            test.questions[index].pointsEarned = result.pointsEarned;
        });

        await test.save();

        // Update user profile
        const user = await User.findById(req.user.id);
        user.placementTestCompleted = true;
        user.placementTestScore = gradingResult.percentageScore;
        user.assignedLevel = levelAssignment.level;
        user.levelAssignedDate = new Date();
        user.strengthAreas = analysis.strengths;
        user.improvementAreas = analysis.weaknesses;

        // Assign course based on level
        const course = await Course.findOne({ level: levelAssignment.level, isActive: true });
        if (course) {
            user.currentCourse = course._id;
            course.enrolledStudents += 1;
            await course.save();
        }

        await user.save();

        // Award placement completion badge
        await BadgeService.checkAndAwardBadges(user._id, 'placement-complete');

        // Create notification
        await Notification.create({
            recipient: user._id,
            type: 'level-promoted',
            title: 'Placement Test Completed! 🎯',
            message: `Congratulations! You've been placed in the ${levelAssignment.level.charAt(0).toUpperCase() + levelAssignment.level.slice(1)} level (${levelAssignment.levelCode}). Your journey to mastering CS jargons begins now!`,
            priority: 'high'
        });

        res.status(200).json({
            success: true,
            message: 'Placement test completed successfully',
            data: {
                testId: test._id,
                score: {
                    percentage: gradingResult.percentageScore,
                    correct: gradingResult.correctAnswers,
                    total: test.totalQuestions,
                    earnedPoints: gradingResult.earnedPoints,
                    totalPoints: test.totalPoints
                },
                level: {
                    assigned: levelAssignment.level,
                    code: levelAssignment.levelCode,
                    duration: levelAssignment.duration
                },
                analysis: {
                    strengths: analysis.strengths,
                    weaknesses: analysis.weaknesses
                },
                feedback: test.feedback,
                categoryBreakdown: gradingResult.categoryScores,
                skillBreakdown: gradingResult.skillScores,
                nextStep: 'dashboard'
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get placement test result
// @route   GET /api/placement-test/result
// @access  Private
exports.getPlacementResult = async (req, res, next) => {
    try {
        const test = await PlacementTest.findOne({
            user: req.user.id,
            status: 'completed'
        })
        .sort({ completedAt: -1 })
        .populate('questions.question');

        if (!test) {
            return res.status(404).json({
                success: false,
                message: 'No completed placement test found'
            });
        }

        // Format detailed results
        const detailedResults = test.questions.map((q, index) => ({
            questionNumber: index + 1,
            questionType: q.question.questionType,
            category: q.question.category,
            difficulty: q.question.difficulty,
            questionText: q.question.questionText,
            userAnswer: q.userAnswer,
            correctAnswer: q.question.correctAnswer,
            isCorrect: q.isCorrect,
            explanation: q.question.explanation,
            pointsEarned: q.pointsEarned,
            maxPoints: q.question.points
        }));

        res.status(200).json({
            success: true,
            data: {
                testId: test._id,
                completedAt: test.completedAt,
                totalTimeSpent: test.totalTimeSpent,
                score: {
                    percentage: test.percentageScore,
                    correct: test.correctAnswers,
                    total: test.totalQuestions,
                    earnedPoints: test.earnedPoints,
                    totalPoints: test.totalPoints
                },
                level: {
                    assigned: test.assignedLevel,
                    code: test.levelCode
                },
                analysis: {
                    strengths: test.strengthAreas,
                    weaknesses: test.improvementAreas
                },
                feedback: test.feedback,
                categoryBreakdown: test.categoryScores,
                skillBreakdown: test.skillScores,
                difficultyBreakdown: test.difficultyScores,
                detailedResults
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get placement test questions (for retake - admin approved)
// @route   GET /api/placement-test/questions
// @access  Private/Admin
exports.getPlacementQuestions = async (req, res, next) => {
    try {
        const { category, difficulty, type } = req.query;

        const filter = { isActive: true };
        if (category) filter.category = category;
        if (difficulty) filter.difficulty = difficulty;
        if (type) filter.questionType = type;

        const questions = await PlacementQuestion.find(filter)
            .select('-correctAnswer -matchingPairs.correctMatches')
            .populate('jargonsTested', 'term definition');

        res.status(200).json({
            success: true,
            count: questions.length,
            data: { questions }
        });

    } catch (error) {
        next(error);
    }
};

// ============== HELPER FUNCTIONS ==============

// Generate test questions with balanced distribution
async function generateTestQuestions() {
    const questions = [];

    // Configuration for question distribution
    const distribution = {
        easy: { count: 8, categories: ['general', 'programming', 'web-development'] },
        medium: { count: 10, categories: ['programming', 'database', 'networking', 'data-structures'] },
        hard: { count: 7, categories: ['algorithms', 'security', 'ai-ml', 'software-engineering'] }
    };

    for (const [difficulty, config] of Object.entries(distribution)) {
        const difficultyQuestions = await PlacementQuestion.aggregate([
            {
                $match: {
                    difficulty,
                    isActive: true,
                    category: { $in: config.categories }
                }
            },
            { $sample: { size: config.count } }
        ]);

        questions.push(...difficultyQuestions);
    }

    // Shuffle questions
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }

    // Convert to full documents for population
    const questionIds = questions.map(q => q._id);
    return await PlacementQuestion.find({ _id: { $in: questionIds } });
}

// Format questions for client (remove correct answers)
function formatQuestionsForClient(questions) {
    return questions.map((q, index) => {
        const question = q.question || q;
        const formatted = {
            index,
            id: question._id,
            questionText: question.questionText,
            questionType: question.questionType,
            category: question.category,
            difficulty: question.difficulty,
            points: question.points,
            timeAllocation: question.timeAllocation
        };

        // Add type-specific fields
        switch (question.questionType) {
            case 'acronym-matching':
                formatted.matchingPairs = {
                    leftColumn: question.matchingPairs.leftColumn,
                    rightColumn: shuffleArray([...question.matchingPairs.rightColumn])
                };
                break;
            case 'definition-choice':
            case 'usage-in-sentence':
            case 'true-false':
                formatted.options = question.options;
                break;
            case 'comprehension':
                formatted.passage = question.passage;
                formatted.subQuestions = question.subQuestions.map(sq => ({
                    questionText: sq.questionText,
                    options: sq.options
                }));
                break;
            case 'fill-in-blank':
                formatted.options = question.options;
                break;
            case 'categorization':
                formatted.options = question.options;
                formatted.categories = question.categories;
                break;
        }

        return formatted;
    });
}

// Grade the test
function gradeTest(test) {
    let correctAnswers = 0;
    let earnedPoints = 0;
    let totalTimeSpent = 0;

    const questionResults = [];
    const categoryStats = {};
    const skillStats = {};
    const difficultyStats = {};

    test.questions.forEach((q, index) => {
        const question = q.question;
        const userAnswer = q.userAnswer;
        totalTimeSpent += q.timeSpent || 0;

        // Check answer based on question type
        const isCorrect = checkAnswer(question, userAnswer);
        const pointsEarned = isCorrect ? question.points : 0;

        if (isCorrect) {
            correctAnswers++;
            earnedPoints += question.points;
        }

        questionResults.push({
            index,
            isCorrect,
            pointsEarned
        });

        // Track category stats
        if (!categoryStats[question.category]) {
            categoryStats[question.category] = { total: 0, correct: 0 };
        }
        categoryStats[question.category].total++;
        if (isCorrect) categoryStats[question.category].correct++;

        // Track skill stats
        question.skillsTested?.forEach(skill => {
            if (!skillStats[skill]) {
                skillStats[skill] = { total: 0, correct: 0 };
            }
            skillStats[skill].total++;
            if (isCorrect) skillStats[skill].correct++;
        });

        // Track difficulty stats
        if (!difficultyStats[question.difficulty]) {
            difficultyStats[question.difficulty] = { total: 0, correct: 0 };
        }
        difficultyStats[question.difficulty].total++;
        if (isCorrect) difficultyStats[question.difficulty].correct++;
    });

    // Format category scores
    const categoryScores = Object.entries(categoryStats).map(([category, stats]) => ({
        category,
        totalQuestions: stats.total,
        correctAnswers: stats.correct,
        percentage: Math.round((stats.correct / stats.total) * 100)
    }));

    // Format skill scores
    const skillScores = Object.entries(skillStats).map(([skill, stats]) => ({
        skill,
        totalQuestions: stats.total,
        correctAnswers: stats.correct,
        percentage: Math.round((stats.correct / stats.total) * 100)
    }));

    // Format difficulty scores
    const difficultyScores = Object.entries(difficultyStats).map(([difficulty, stats]) => ({
        difficulty,
        totalQuestions: stats.total,
        correctAnswers: stats.correct,
        percentage: Math.round((stats.correct / stats.total) * 100)
    }));

    return {
        correctAnswers,
        earnedPoints,
        totalTimeSpent,
        percentageScore: Math.round((correctAnswers / test.totalQuestions) * 100),
        questionResults,
        categoryScores,
        skillScores,
        difficultyScores
    };
}

// Check if answer is correct based on question type
function checkAnswer(question, userAnswer) {
    if (!userAnswer) return false;

    switch (question.questionType) {
        case 'acronym-matching':
            return checkMatchingAnswer(question.matchingPairs.correctMatches, userAnswer);

        case 'definition-choice':
        case 'usage-in-sentence':
        case 'true-false':
        case 'fill-in-blank':
            return userAnswer === question.correctAnswer;

        case 'comprehension':
            return checkComprehensionAnswer(question.subQuestions, userAnswer);

        case 'categorization':
            return JSON.stringify(userAnswer.sort()) === JSON.stringify(question.correctAnswer.sort());

        default:
            return userAnswer === question.correctAnswer;
    }
}

// Check matching answer
function checkMatchingAnswer(correctMatches, userMatches) {
    if (!Array.isArray(userMatches)) return false;
    if (userMatches.length !== correctMatches.length) return false;

    const sortedCorrect = [...correctMatches].sort((a, b) => a.leftId.localeCompare(b.leftId));
    const sortedUser = [...userMatches].sort((a, b) => a.leftId.localeCompare(b.leftId));

    return sortedCorrect.every((match, index) =>
        match.leftId === sortedUser[index].leftId &&
        match.rightId === sortedUser[index].rightId
    );
}

// Check comprehension answer
function checkComprehensionAnswer(subQuestions, userAnswers) {
    if (!Array.isArray(userAnswers)) return false;

    let correctCount = 0;
    subQuestions.forEach((sq, index) => {
        if (userAnswers[index] === sq.correctAnswer) {
            correctCount++;
        }
    });

    // Consider correct if more than 50% of sub-questions are correct
    return correctCount >= Math.ceil(subQuestions.length / 2);
}

// Determine level based on score
function determineLevel(gradingResult) {
    const score = gradingResult.percentageScore;
    const difficultyPerformance = {};

    gradingResult.difficultyScores.forEach(d => {
        difficultyPerformance[d.difficulty] = d.percentage;
    });

    // Level determination logic
    let level, levelCode, duration;

    if (score >= 80 && (difficultyPerformance.hard || 0) >= 60) {
        level = 'advanced';
        levelCode = 'C1-C2';
        duration = 14;
    } else if (score >= 50 && (difficultyPerformance.medium || 0) >= 50) {
        level = 'intermediate';
        levelCode = 'B1-B2';
        duration = 8;
    } else {
        level = 'beginner';
        levelCode = 'A1-A2';
        duration = 6;
    }

    return { level, levelCode, duration };
}

// Analyze performance to find strengths and weaknesses
function analyzePerformance(gradingResult) {
    const strengths = [];
    const weaknesses = [];

    // Analyze categories
    gradingResult.categoryScores.forEach(cat => {
        if (cat.percentage >= 75) {
            strengths.push(`${formatCategoryName(cat.category)} (${cat.percentage}%)`);
        } else if (cat.percentage < 50) {
            weaknesses.push(`${formatCategoryName(cat.category)} (${cat.percentage}%)`);
        }
    });

    // Analyze skills
    gradingResult.skillScores.forEach(skill => {
        if (skill.percentage >= 75) {
            if (!strengths.some(s => s.includes(formatSkillName(skill.skill)))) {
                strengths.push(formatSkillName(skill.skill));
            }
        } else if (skill.percentage < 50) {
            if (!weaknesses.some(w => w.includes(formatSkillName(skill.skill)))) {
                weaknesses.push(formatSkillName(skill.skill));
            }
        }
    });

    // Limit to top 5 each
    return {
        strengths: strengths.slice(0, 5),
        weaknesses: weaknesses.slice(0, 5)
    };
}

// Generate personalized feedback
function generateFeedback(gradingResult, levelAssignment, analysis) {
    const score = gradingResult.percentageScore;

    // Summary based on score
    let summary;
    if (score >= 80) {
        summary = `Excellent performance! You demonstrated strong understanding of CS terminology with a score of ${score}%. You've been placed in the Advanced level where you'll master professional and academic jargon usage.`;
    } else if (score >= 60) {
        summary = `Good job! You scored ${score}% showing solid foundational knowledge. You've been placed in the Intermediate level to strengthen your contextual usage of CS terms.`;
    } else if (score >= 40) {
        summary = `You scored ${score}%. There's room for improvement, and that's exactly what we're here for! The Beginner level will help you build a strong foundation in CS vocabulary.`;
    } else {
        summary = `You scored ${score}%. Don't worry - everyone starts somewhere! The Beginner level is designed to help you learn CS jargon from the ground up.`;
    }

    // Strength feedback
    const strengthFeedback = analysis.strengths.length > 0
        ? analysis.strengths.map(s => `Strong in ${s}`)
        : ['Keep practicing to develop your strengths!'];

    // Weakness feedback
    const weaknessFeedback = analysis.weaknesses.length > 0
        ? analysis.weaknesses.map(w => `Focus on improving ${w}`)
        : ['Well-rounded performance across all areas!'];

    // Recommendations based on level
    const recommendations = getRecommendations(levelAssignment.level, analysis);

    return {
        summary,
        strengths: strengthFeedback,
        weaknesses: weaknessFeedback,
        recommendations
    };
}

// Get recommendations based on level and analysis
function getRecommendations(level, analysis) {
    const baseRecommendations = {
        beginner: [
            'Start with flashcards to memorize basic terms',
            'Focus on understanding acronyms and their meanings',
            'Practice identifying terms in simple contexts',
            'Complete all beginner modules before moving on',
            'Use the glossary frequently for reference'
        ],
        intermediate: [
            'Practice using jargon in sentences and paragraphs',
            'Read technical documentation to see terms in context',
            'Focus on understanding nuanced differences between similar terms',
            'Attempt comprehension exercises with technical passages',
            'Participate in peer review activities'
        ],
        advanced: [
            'Read research papers and technical articles',
            'Practice explaining complex concepts using proper terminology',
            'Focus on professional communication and documentation',
            'Work on advanced comprehension and application exercises',
            'Prepare for technical interviews using proper jargon'
        ]
    };

    return baseRecommendations[level] || baseRecommendations.beginner;
}

// Helper: Format category name
function formatCategoryName(category) {
    const names = {
        'programming': 'Programming Concepts',
        'networking': 'Networking',
        'database': 'Database Systems',
        'security': 'Cybersecurity',
        'ai-ml': 'AI & Machine Learning',
        'web-development': 'Web Development',
        'data-structures': 'Data Structures',
        'algorithms': 'Algorithms',
        'software-engineering': 'Software Engineering',
        'operating-systems': 'Operating Systems',
        'general': 'General CS Terms'
    };
    return names[category] || category;
}

// Helper: Format skill name
function formatSkillName(skill) {
    const names = {
        'recognition': 'Term Recognition',
        'definition': 'Definition Knowledge',
        'context-usage': 'Contextual Usage',
        'application': 'Practical Application',
        'comprehension': 'Reading Comprehension'
    };
    return names[skill] || skill;
}

// Helper: Shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

module.exports = exports;