const Certificate = require('../models/Certificate');
const RecommendationLetter = require('../models/RecommendationLetter');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Submission = require('../models/Submission');
const ModuleProgress = require('../models/ModuleProgress');
const Notification = require('../models/Notification');
const PDFGeneratorService = require('./pdfGeneratorService');

class CertificateService {

    // Check eligibility for completion certificate
    static async checkCompletionEligibility(userId, courseId) {
        const enrollment = await Enrollment.findOne({
            user: userId,
            course: courseId
        }).populate('course');

        if (!enrollment) {
            return { eligible: false, reason: 'Not enrolled in this course' };
        }

        if (enrollment.status !== 'completed') {
            return { 
                eligible: false, 
                reason: 'Course not completed',
                progress: enrollment.progressPercentage
            };
        }

        if (enrollment.grades.overallGrade < enrollment.course.passingScore) {
            return { 
                eligible: false, 
                reason: `Grade ${enrollment.grades.overallGrade}% is below passing score of ${enrollment.course.passingScore}%`
            };
        }

        // Check if certificate already issued
        const existingCert = await Certificate.findOne({
            user: userId,
            course: courseId,
            type: 'completion',
            isRevoked: false
        });

        if (existingCert) {
            return { 
                eligible: false, 
                reason: 'Certificate already issued',
                certificate: existingCert
            };
        }

        return { 
            eligible: true, 
            enrollment,
            course: enrollment.course
        };
    }

    // Generate completion certificate
    static async generateCompletionCertificate(userId, courseId) {
        const eligibility = await this.checkCompletionEligibility(userId, courseId);
        
        if (!eligibility.eligible) {
            throw new Error(eligibility.reason);
        }

        const user = await User.findById(userId);
        const { enrollment, course } = eligibility;

        // Determine grade letter
        const percentage = enrollment.grades.overallGrade;
        let gradeLetter;
        if (percentage >= 90) gradeLetter = 'A';
        else if (percentage >= 80) gradeLetter = 'B';
        else if (percentage >= 70) gradeLetter = 'C';
        else if (percentage >= 60) gradeLetter = 'D';
        else gradeLetter = 'F';

        // Create certificate
        const certificate = await Certificate.create({
            user: userId,
            type: 'completion',
            course: courseId,
            title: `Certificate of Completion - ${course.title}`,
            description: `has successfully completed the ${course.title} course in the CS Jargon Learning Platform, demonstrating proficiency in Computer Science terminology at the ${course.level} level.`,
            recipientName: user.fullName,
            performanceData: {
                courseName: course.title,
                level: course.levelCode,
                duration: `${course.duration.weeks} weeks`,
                completionDate: enrollment.completedAt,
                finalGrade: gradeLetter,
                percentage: percentage
            },
            issuedAt: new Date()
        });

        // Generate PDF
        const pdfResult = await PDFGeneratorService.generateCertificatePDF(certificate);
        certificate.pdfUrl = pdfResult.url;
        certificate.pdfGeneratedAt = new Date();
        await certificate.save();

        // Update user's certificates
        user.certificates.push({
            type: 'completion',
            course: courseId,
            issuedAt: new Date(),
            certificateUrl: pdfResult.url,
            certificateId: certificate.certificateId
        });
        await user.save();

        // Create notification
        await Notification.create({
            recipient: userId,
            type: 'certificate-issued',
            title: '🎓 Certificate Issued!',
            message: `Congratulations! Your Certificate of Completion for "${course.title}" is ready to download.`,
            link: `/certificates/${certificate.certificateId}`,
            priority: 'high'
        });

        return certificate;
    }

    // Generate appreciation certificate
    static async generateAppreciationCertificate(userId, reason, achievement) {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        const certificate = await Certificate.create({
            user: userId,
            type: 'appreciation',
            title: 'Certificate of Appreciation',
            description: `is recognized and appreciated for ${reason}. This certificate is awarded in recognition of outstanding contribution to the CS Jargon Learning community.`,
            recipientName: user.fullName,
            performanceData: {
                reason,
                achievement
            },
            issuedAt: new Date()
        });

        // Generate PDF
        const pdfResult = await PDFGeneratorService.generateCertificatePDF(certificate);
        certificate.pdfUrl = pdfResult.url;
        certificate.pdfGeneratedAt = new Date();
        await certificate.save();

        // Update user
        user.certificates.push({
            type: 'appreciation',
            issuedAt: new Date(),
            certificateUrl: pdfResult.url,
            certificateId: certificate.certificateId
        });
        await user.save();

        // Notification
        await Notification.create({
            recipient: userId,
            type: 'certificate-issued',
            title: '🏆 Appreciation Certificate!',
            message: `You've received a Certificate of Appreciation! Thank you for your contribution.`,
            link: `/certificates/${certificate.certificateId}`,
            priority: 'high'
        });

        return certificate;
    }

    // Generate character certificate
    static async generateCharacterCertificate(userId, qualities, period) {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        // Get user's activity data for character assessment
        const enrollments = await Enrollment.find({ user: userId, status: 'completed' });
        const submissions = await Submission.find({ student: userId, status: 'graded' });
        
        // Calculate peer review participation
        const peerReviews = submissions.reduce((count, sub) => 
            count + (sub.peerReviewsCompleted || 0), 0
        );

        const defaultQualities = [
            'Dedication to Learning',
            'Consistent Academic Performance',
            'Active Participation',
            'Professional Conduct'
        ];

        const certificateQualities = qualities?.length > 0 ? qualities : defaultQualities;

        const certificate = await Certificate.create({
            user: userId,
            type: 'character',
            title: 'Character Certificate',
            description: `has been a dedicated learner on the CS Jargon Platform. During their time with us, they have demonstrated exceptional character and commitment to academic excellence.`,
            recipientName: user.fullName,
            performanceData: {
                qualities: certificateQualities,
                period: period || `${new Date(user.createdAt).toLocaleDateString()} - Present`,
                coursesCompleted: enrollments.length,
                peerContributions: peerReviews
            },
            issuedAt: new Date()
        });

        // Generate PDF
        const pdfResult = await PDFGeneratorService.generateCertificatePDF(certificate);
        certificate.pdfUrl = pdfResult.url;
        certificate.pdfGeneratedAt = new Date();
        await certificate.save();

        // Update user
        user.certificates.push({
            type: 'character',
            issuedAt: new Date(),
            certificateUrl: pdfResult.url,
            certificateId: certificate.certificateId
        });
        await user.save();

        // Notification
        await Notification.create({
            recipient: userId,
            type: 'certificate-issued',
            title: '📜 Character Certificate Ready!',
            message: `Your Character Certificate has been generated and is ready for download.`,
            link: `/certificates/${certificate.certificateId}`,
            priority: 'medium'
        });

        return certificate;
    }

    // Check eligibility for recommendation letter
    static async checkRecommendationEligibility(userId) {
        const user = await User.findById(userId);
        if (!user) {
            return { eligible: false, reason: 'User not found' };
        }

        // Minimum requirements
        const enrollments = await Enrollment.find({ 
            user: userId, 
            status: 'completed' 
        });

        if (enrollments.length === 0) {
            return { 
                eligible: false, 
                reason: 'Must complete at least one course'
            };
        }

        // Check average performance
        const avgGrade = enrollments.reduce((sum, e) => 
            sum + (e.grades.overallGrade || 0), 0
        ) / enrollments.length;

        if (avgGrade < 70) {
            return { 
                eligible: false, 
                reason: `Average grade ${avgGrade.toFixed(1)}% is below 70% requirement`
            };
        }

        // Check minimum time investment
        if (user.totalTimeSpent < 600) { // 10 hours minimum
            return { 
                eligible: false, 
                reason: 'Minimum 10 hours of learning time required',
                currentHours: Math.round(user.totalTimeSpent / 60)
            };
        }

        // Check existing letter (one per 6 months)
        const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
        const recentLetter = await RecommendationLetter.findOne({
            user: userId,
            issuedAt: { $gte: sixMonthsAgo },
            isRevoked: false
        });

        if (recentLetter) {
            return { 
                eligible: false, 
                reason: 'Recommendation letter already issued within the last 6 months',
                existingLetter: recentLetter
            };
        }

        return { 
            eligible: true,
            enrollments,
            avgGrade,
            user
        };
    }

    // Generate recommendation letter
    static async generateRecommendationLetter(userId, purpose = 'general', addressedTo = null) {
        const eligibility = await this.checkRecommendationEligibility(userId);
        
        if (!eligibility.eligible) {
            throw new Error(eligibility.reason);
        }

        const { user, enrollments, avgGrade } = eligibility;

        // Gather comprehensive performance data
        const submissions = await Submission.find({ 
            student: userId, 
            status: 'graded' 
        });

        const moduleProgress = await ModuleProgress.find({ 
            user: userId, 
            isCompleted: true 
        });

        // Calculate stats
        const quizScores = moduleProgress
            .flatMap(mp => mp.quizAttempts.map(qa => qa.percentage))
            .filter(Boolean);
        
        const quizAverage = quizScores.length > 0
            ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
            : 0;

        const assignmentAverage = submissions.length > 0
            ? Math.round(submissions.reduce((sum, s) => sum + s.percentage, 0) / submissions.length)
            : 0;

        const peerReviewsCompleted = submissions.reduce((count, sub) => 
            count + (sub.peerReviewsCompleted || 0), 0
        );

        // Prepare performance summary
        const performanceSummary = {
            coursesCompleted: enrollments.map(e => ({
                courseName: e.course?.title || 'Course',
                level: e.course?.levelCode || e.course?.level,
                grade: e.grades.letterGrade,
                percentage: e.grades.overallGrade,
                completedAt: e.completedAt
            })),
            totalJargonsMastered: moduleProgress.reduce((sum, mp) => 
                sum + (mp.jargonsMastered?.length || 0), 0
            ),
            totalTimeSpent: Math.round(user.totalTimeSpent / 60), // hours
            totalAssignments: submissions.length,
            assignmentAverage,
            totalQuizzes: quizScores.length,
            quizAverage,
            streakRecord: user.longestStreak,
            badgesEarned: user.badges.length,
            peerReviewsCompleted
        };

        // Identify strengths
        const strengths = this.identifyStrengths(performanceSummary, user);

        // Generate letter content
        const content = this.generateLetterContent(user, performanceSummary, strengths, purpose);

        // Create recommendation letter
        const letter = await RecommendationLetter.create({
            user: userId,
            recipientDetails: {
                fullName: user.fullName,
                email: user.email,
                currentLevel: user.assignedLevel,
                enrollmentDate: user.createdAt
            },
            performanceSummary,
            strengths,
            content,
            purpose,
            addressedTo: addressedTo || 'To Whom It May Concern',
            issuedAt: new Date()
        });

        // Generate PDF
        const pdfResult = await PDFGeneratorService.generateRecommendationPDF(letter);
        letter.pdfUrl = pdfResult.url;
        letter.pdfGeneratedAt = new Date();
        await letter.save();

        // Update user
        user.recommendationLetter = {
            isEligible: true,
            generatedAt: new Date(),
            letterUrl: pdfResult.url
        };
        await user.save();

        // Notification
        await Notification.create({
            recipient: userId,
            type: 'certificate-issued',
            title: '📄 Recommendation Letter Ready!',
            message: `Your personalized recommendation letter has been generated and is ready for download.`,
            link: `/recommendations/${letter.letterId}`,
            priority: 'high'
        });

        return letter;
    }

    // Identify user strengths based on performance
    static identifyStrengths(performance, user) {
        const strengths = [];

        if (performance.quizAverage >= 85) {
            strengths.push('Exceptional understanding of technical concepts');
        }
        if (performance.assignmentAverage >= 85) {
            strengths.push('Strong practical application skills');
        }
        if (user.longestStreak >= 30) {
            strengths.push('Outstanding dedication and consistency');
        }
        if (performance.peerReviewsCompleted >= 10) {
            strengths.push('Active contributor to peer learning');
        }
        if (performance.totalTimeSpent >= 50) {
            strengths.push('Significant investment in professional development');
        }
        if (performance.coursesCompleted.length >= 2) {
            strengths.push('Commitment to comprehensive learning');
        }
        if (user.badges.length >= 10) {
            strengths.push('Achievement-oriented learner');
        }

        // Default strengths if none identified
        if (strengths.length === 0) {
            strengths.push(
                'Dedicated approach to learning',
                'Completion of technical coursework'
            );
        }

        return strengths;
    }

    // Generate letter content
    static generateLetterContent(user, performance, strengths, purpose) {
        const firstName = user.fullName.split(' ')[0];
        const enrollmentDuration = Math.round(
            (Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24 * 30)
        );

        const introduction = `I am pleased to write this letter of recommendation for ${user.fullName}, who has been an active learner on the CS Jargon Platform at PAF-IAST for approximately ${enrollmentDuration} months. During this time, ${firstName} has demonstrated exceptional commitment to mastering Computer Science terminology and technical communication skills.`;

        const bodyParagraphs = [];

        // Academic performance paragraph
        if (performance.coursesCompleted.length > 0) {
            const courses = performance.coursesCompleted;
            const topCourse = courses.sort((a, b) => b.percentage - a.percentage)[0];
            bodyParagraphs.push(
                `${firstName} has successfully completed ${courses.length} course(s) on our platform, with their best performance being a ${topCourse.grade} grade (${topCourse.percentage}%) in the ${topCourse.courseName} course. Their consistent academic performance demonstrates a strong aptitude for technical learning and a thorough understanding of Computer Science concepts.`
            );
        }

        // Engagement paragraph
        if (performance.totalTimeSpent >= 10) {
            bodyParagraphs.push(
                `With over ${performance.totalTimeSpent} hours of dedicated learning time, ${firstName} has shown remarkable commitment to their professional development. They have mastered ${performance.totalJargonsMastered || 'numerous'} technical terms and maintained a learning streak of ${performance.streakRecord} consecutive days, demonstrating both discipline and enthusiasm for continuous learning.`
            );
        }

        // Collaboration paragraph (if applicable)
        if (performance.peerReviewsCompleted >= 5) {
            bodyParagraphs.push(
                `Beyond individual achievement, ${firstName} has actively contributed to our learning community by completing ${performance.peerReviewsCompleted} peer reviews, providing constructive feedback to fellow learners. This collaborative spirit highlights their ability to work effectively in team environments and support others' growth.`
            );
        }

        // Skills based on strengths
        const skills = [
            'Technical vocabulary and jargon proficiency',
            'Understanding of Computer Science fundamentals',
            'Professional technical communication',
            'Self-directed learning capabilities',
            'Time management and consistency'
        ];

        // Purpose-specific additions
        let purposeText = '';
        switch (purpose) {
            case 'academic':
                purposeText = `${firstName}'s academic performance and dedication make them an excellent candidate for further academic pursuits in Computer Science or related fields.`;
                break;
            case 'employment':
                purposeText = `${firstName}'s technical proficiency and commitment to professional development make them a valuable asset for any organization in the technology sector.`;
                break;
            case 'internship':
                purposeText = `${firstName}'s foundational knowledge and eagerness to learn make them an ideal candidate for internship opportunities where they can apply and expand their technical skills.`;
                break;
            default:
                purposeText = `${firstName}'s dedication and performance speak to their potential for success in future academic or professional endeavors.`;
        }

        const conclusion = `Based on ${firstName}'s performance and growth on our platform, I confidently recommend them for ${purpose === 'general' ? 'their future endeavors' : purpose + ' opportunities'}. ${purposeText} I believe they will continue to excel and contribute positively wherever they go.`;

        const closing = 'Should you require any additional information, please do not hesitate to contact us.';

        return {
            greeting: 'Dear Sir/Madam,',
            introduction,
            bodyParagraphs,
            skills,
            conclusion,
            closing
        };
    }

    // Get user's all certificates
    static async getUserCertificates(userId) {
        const certificates = await Certificate.find({
            user: userId,
            isRevoked: false
        })
        .populate('course', 'title level')
        .sort({ issuedAt: -1 });

        return certificates;
    }

    // Get user's recommendation letters
    static async getUserRecommendations(userId) {
        const letters = await RecommendationLetter.find({
            user: userId,
            isRevoked: false
        }).sort({ issuedAt: -1 });

        return letters;
    }
}

module.exports = CertificateService;