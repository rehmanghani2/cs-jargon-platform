const Badge = require('../models/Badge');
const User = require('../models/User');
const Notification = require('../models/Notification');

class BadgeService {
    
    // Check and award badges based on user activity
    static async checkAndAwardBadges(userId, activityType, value = null) {
        try {
            const user = await User.findById(userId).populate('badges.badge');
            if (!user) return [];

            const awardedBadges = [];

            switch (activityType) {
                case 'streak':
                    awardedBadges.push(...await this.checkStreakBadges(user));
                    break;
                case 'module-complete':
                    awardedBadges.push(...await this.checkModuleBadges(user));
                    break;
                case 'assignment-complete':
                    awardedBadges.push(...await this.checkAssignmentBadges(user));
                    break;
                case 'quiz-score':
                    awardedBadges.push(...await this.checkQuizBadges(user, value));
                    break;
                case 'course-complete':
                    awardedBadges.push(...await this.checkCourseBadges(user, value));
                    break;
                case 'time-spent':
                    awardedBadges.push(...await this.checkTimeBadges(user));
                    break;
                case 'jargon-mastery':
                    awardedBadges.push(...await this.checkJargonBadges(user, value));
                    break;
                case 'peer-review':
                    awardedBadges.push(...await this.checkPeerReviewBadges(user));
                    break;
                case 'login':
                    awardedBadges.push(...await this.checkLoginBadges(user));
                    break;
            }

            return awardedBadges;

        } catch (error) {
            console.error('Error checking badges:', error);
            return [];
        }
    }

    // Check streak badges
    static async checkStreakBadges(user) {
        const streakThresholds = [3, 7, 14, 30, 60];
        const badgeNames = ['streak-3', 'streak-7', 'streak-14', 'streak-30', 'streak-master'];
        
        return await this.checkThresholdBadges(
            user, 
            user.currentStreak, 
            streakThresholds, 
            badgeNames
        );
    }

    // Check module completion badges
    static async checkModuleBadges(user) {
        const completedModules = user.moduleProgress.filter(m => m.isCompleted).length;
        const thresholds = [1, 5, 10];
        const badgeNames = ['first-module', 'module-5', 'module-10'];
        
        return await this.checkThresholdBadges(user, completedModules, thresholds, badgeNames);
    }

    // Check assignment badges
    static async checkAssignmentBadges(user) {
        // Count would need to be fetched from submissions
        const Submission = require('../models/Submission');
        const completedAssignments = await Submission.countDocuments({
            student: user._id,
            status: 'graded'
        });

        const thresholds = [1, 5, 10];
        const badgeNames = ['first-assignment', 'assignment-5', 'assignment-10'];
        
        return await this.checkThresholdBadges(user, completedAssignments, thresholds, badgeNames);
    }

    // Check quiz badges
    static async checkQuizBadges(user, score) {
        const awarded = [];

        if (score === 100) {
            // Count perfect scores
            let perfectScores = 0;
            user.moduleProgress.forEach(m => {
                if (m.quizScores) {
                    perfectScores += m.quizScores.filter(s => s === 100).length;
                }
            });

            if (perfectScores >= 1) {
                const badge = await this.awardBadge(user, 'quiz-ace');
                if (badge) awarded.push(badge);
            }
            if (perfectScores >= 5) {
                const badge = await this.awardBadge(user, 'quiz-master');
                if (badge) awarded.push(badge);
            }
        }

        return awarded;
    }

    // Check course completion badges
    static async checkCourseBadges(user, courseLevel) {
        const awarded = [];
        const badgeMap = {
            'beginner': 'beginner-complete',
            'intermediate': 'intermediate-complete',
            'advanced': 'advanced-complete'
        };

        const badgeName = badgeMap[courseLevel];
        if (badgeName) {
            const badge = await this.awardBadge(user, badgeName);
            if (badge) awarded.push(badge);
        }

        return awarded;
    }

    // Check time spent badges
    static async checkTimeBadges(user) {
        const thresholds = [600, 3000, 6000]; // in minutes
        const badgeNames = ['dedicated-10', 'dedicated-50', 'dedicated-100'];
        
        return await this.checkThresholdBadges(user, user.totalTimeSpent, thresholds, badgeNames);
    }

    // Check jargon mastery badges
    static async checkJargonBadges(user, masteredCount) {
        const thresholds = [10, 50, 100, 200];
        const badgeNames = ['jargon-10', 'jargon-50', 'jargon-100', 'jargon-expert'];
        
        return await this.checkThresholdBadges(user, masteredCount, thresholds, badgeNames);
    }

    // Check peer review badges
    static async checkPeerReviewBadges(user) {
        const Submission = require('../models/Submission');
        
        // Count peer reviews given by user
        const peerReviewCount = await Submission.aggregate([
            { $unwind: '$peerReviews' },
            { $match: { 'peerReviews.reviewer': user._id } },
            { $count: 'total' }
        ]);

        const count = peerReviewCount[0]?.total || 0;
        const thresholds = [5, 20];
        const badgeNames = ['helpful-peer', 'peer-mentor'];
        
        return await this.checkThresholdBadges(user, count, thresholds, badgeNames);
    }

    // Check login badges
    static async checkLoginBadges(user) {
        const awarded = [];

        // First login badge
        if (user.totalLoginDays === 1) {
            const badge = await this.awardBadge(user, 'first-login');
            if (badge) awarded.push(badge);
        }

        // Check for special time-based badges
        const currentHour = new Date().getHours();
        
        if (currentHour < 7) {
            const badge = await this.awardBadge(user, 'early-bird');
            if (badge) awarded.push(badge);
        }
        
        if (currentHour >= 23) {
            const badge = await this.awardBadge(user, 'night-owl');
            if (badge) awarded.push(badge);
        }

        return awarded;
    }

    // Helper: Check threshold-based badges
    static async checkThresholdBadges(user, currentValue, thresholds, badgeNames) {
        const awarded = [];

        for (let i = 0; i < thresholds.length; i++) {
            if (currentValue >= thresholds[i]) {
                const badge = await this.awardBadge(user, badgeNames[i]);
                if (badge) awarded.push(badge);
            }
        }

        return awarded;
    }

    // Award a specific badge to user
    static async awardBadge(user, badgeName) {
        try {
            const badge = await Badge.findOne({ name: badgeName, isActive: true });
            if (!badge) return null;

            // Check if user already has this badge
            const hasBadge = user.badges.some(
                b => b.badge.toString() === badge._id.toString()
            );
            if (hasBadge) return null;

            // Award badge
            user.badges.push({
                badge: badge._id,
                earnedAt: new Date()
            });
            user.points += badge.points;
            await user.save();

            // Create notification
            await Notification.create({
                recipient: user._id,
                type: 'badge-earned',
                title: 'New Badge Earned! 🏆',
                message: `Congratulations! You've earned the "${badge.name}" badge: ${badge.description}`,
                priority: 'medium'
            });

            return badge;

        } catch (error) {
            console.error('Error awarding badge:', error);
            return null;
        }
    }

    // Get all available badges with user progress
    static async getBadgesWithProgress(userId) {
        try {
            const user = await User.findById(userId);
            const allBadges = await Badge.find({ isActive: true });
            
            const userBadgeIds = user.badges.map(b => b.badge.toString());

            return allBadges.map(badge => ({
                ...badge.toObject(),
                earned: userBadgeIds.includes(badge._id.toString()),
                earnedAt: user.badges.find(
                    b => b.badge.toString() === badge._id.toString()
                )?.earnedAt
            }));

        } catch (error) {
            console.error('Error getting badges with progress:', error);
            return [];
        }
    }
}

module.exports = BadgeService;