const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Badge = require('../models/Badge');

dotenv.config();

const badges = [
    // Profile & Getting Started
    {
        name: 'profile-complete',
        description: 'Completed your profile setup',
        icon: '👤',
        category: 'achievement',
        criteria: { type: 'profile-complete', value: 1 },
        points: 10,
        rarity: 'common'
    },
    {
        name: 'first-login',
        description: 'Logged in for the first time',
        icon: '🎉',
        category: 'achievement',
        criteria: { type: 'login-days', value: 1 },
        points: 5,
        rarity: 'common'
    },
    {
        name: 'placement-complete',
        description: 'Completed the placement test',
        icon: '📝',
        category: 'achievement',
        criteria: { type: 'placement-complete', value: 1 },
        points: 15,
        rarity: 'common'
    },

    // Streak Badges
    {
        name: 'streak-3',
        description: 'Maintained a 3-day learning streak',
        icon: '🔥',
        category: 'streak',
        criteria: { type: 'streak-days', value: 3 },
        points: 15,
        rarity: 'common'
    },
    {
        name: 'streak-7',
        description: 'Maintained a 7-day learning streak',
        icon: '🔥',
        category: 'streak',
        criteria: { type: 'streak-days', value: 7 },
        points: 30,
        rarity: 'uncommon'
    },
    {
        name: 'streak-14',
        description: 'Maintained a 14-day learning streak',
        icon: '🔥',
        category: 'streak',
        criteria: { type: 'streak-days', value: 14 },
        points: 50,
        rarity: 'rare'
    },
    {
        name: 'streak-30',
        description: 'Maintained a 30-day learning streak',
        icon: '🔥',
        category: 'streak',
        criteria: { type: 'streak-days', value: 30 },
        points: 100,
        rarity: 'epic'
    },
    {
        name: 'streak-master',
        description: 'Maintained a 60-day learning streak',
        icon: '👑',
        category: 'streak',
        criteria: { type: 'streak-days', value: 60 },
        points: 200,
        rarity: 'legendary'
    },

    // Module Completion
    {
        name: 'first-module',
        description: 'Completed your first module',
        icon: '📚',
        category: 'completion',
        criteria: { type: 'modules-completed', value: 1 },
        points: 20,
        rarity: 'common'
    },
    {
        name: 'module-5',
        description: 'Completed 5 modules',
        icon: '📚',
        category: 'completion',
        criteria: { type: 'modules-completed', value: 5 },
        points: 50,
        rarity: 'uncommon'
    },
    {
        name: 'module-10',
        description: 'Completed 10 modules',
        icon: '📚',
        category: 'completion',
        criteria: { type: 'modules-completed', value: 10 },
        points: 100,
        rarity: 'rare'
    },

    // Quiz Achievements
    {
        name: 'quiz-ace',
        description: 'Scored 100% on a quiz',
        icon: '🎯',
        category: 'achievement',
        criteria: { type: 'quiz-perfect-score', value: 1 },
        points: 25,
        rarity: 'uncommon'
    },
    {
        name: 'quiz-master',
        description: 'Scored 100% on 5 quizzes',
        icon: '🎯',
        category: 'achievement',
        criteria: { type: 'quiz-perfect-score', value: 5 },
        points: 75,
        rarity: 'rare'
    },

    // Assignment Badges
    {
        name: 'first-assignment',
        description: 'Completed your first assignment',
        icon: '✍️',
        category: 'completion',
        criteria: { type: 'assignments-completed', value: 1 },
        points: 15,
        rarity: 'common'
    },
    {
        name: 'assignment-5',
        description: 'Completed 5 assignments',
        icon: '✍️',
        category: 'completion',
        criteria: { type: 'assignments-completed', value: 5 },
        points: 40,
        rarity: 'uncommon'
    },
    {
        name: 'assignment-10',
        description: 'Completed 10 assignments',
        icon: '✍️',
        category: 'completion',
        criteria: { type: 'assignments-completed', value: 10 },
        points: 80,
        rarity: 'rare'
    },

    // Course Completion
    {
        name: 'beginner-complete',
        description: 'Completed the Beginner course',
        icon: '🥉',
        category: 'completion',
        criteria: { type: 'course-completed', value: 1 },
        points: 150,
        rarity: 'rare'
    },
    {
        name: 'intermediate-complete',
        description: 'Completed the Intermediate course',
        icon: '🥈',
        category: 'completion',
        criteria: { type: 'course-completed', value: 2 },
        points: 250,
        rarity: 'epic'
    },
    {
        name: 'advanced-complete',
        description: 'Completed the Advanced course',
        icon: '🥇',
        category: 'completion',
        criteria: { type: 'course-completed', value: 3 },
        points: 500,
        rarity: 'legendary'
    },

    // Jargon Mastery
    {
        name: 'jargon-10',
        description: 'Mastered 10 jargons',
        icon: '💡',
        category: 'achievement',
        criteria: { type: 'jargons-mastered', value: 10 },
        points: 20,
        rarity: 'common'
    },
    {
        name: 'jargon-50',
        description: 'Mastered 50 jargons',
        icon: '💡',
        category: 'achievement',
        criteria: { type: 'jargons-mastered', value: 50 },
        points: 75,
        rarity: 'uncommon'
    },
    {
        name: 'jargon-100',
        description: 'Mastered 100 jargons',
        icon: '💡',
        category: 'achievement',
        criteria: { type: 'jargons-mastered', value: 100 },
        points: 150,
        rarity: 'rare'
    },
    {
        name: 'jargon-expert',
        description: 'Mastered 200 jargons',
        icon: '🧠',
        category: 'achievement',
        criteria: { type: 'jargons-mastered', value: 200 },
        points: 300,
        rarity: 'epic'
    },

    // Engagement Badges
    {
        name: 'early-bird',
        description: 'Logged in before 7 AM',
        icon: '🌅',
        category: 'engagement',
        criteria: { type: 'special', value: 'early-bird' },
        points: 10,
        rarity: 'uncommon'
    },
    {
        name: 'night-owl',
        description: 'Logged in after 11 PM',
        icon: '🦉',
        category: 'engagement',
        criteria: { type: 'special', value: 'night-owl' },
        points: 10,
        rarity: 'uncommon'
    },
    {
        name: 'weekend-warrior',
        description: 'Studied on 4 consecutive weekends',
        icon: '⚔️',
        category: 'engagement',
        criteria: { type: 'special', value: 'weekend-warrior' },
        points: 30,
        rarity: 'rare'
    },

    // Peer Review
    {
        name: 'helpful-peer',
        description: 'Completed 5 peer reviews',
        icon: '🤝',
        category: 'engagement',
        criteria: { type: 'peer-reviews', value: 5 },
        points: 25,
        rarity: 'uncommon'
    },
    {
        name: 'peer-mentor',
        description: 'Completed 20 peer reviews',
        icon: '🤝',
        category: 'engagement',
        criteria: { type: 'peer-reviews', value: 20 },
        points: 75,
        rarity: 'rare'
    },

    // Time Spent
    {
        name: 'dedicated-10',
        description: 'Spent 10 hours learning',
        icon: '⏰',
        category: 'engagement',
        criteria: { type: 'time-spent', value: 600 }, // in minutes
        points: 30,
        rarity: 'uncommon'
    },
    {
        name: 'dedicated-50',
        description: 'Spent 50 hours learning',
        icon: '⏰',
        category: 'engagement',
        criteria: { type: 'time-spent', value: 3000 },
        points: 100,
        rarity: 'rare'
    },
    {
        name: 'dedicated-100',
        description: 'Spent 100 hours learning',
        icon: '⏰',
        category: 'engagement',
        criteria: { type: 'time-spent', value: 6000 },
        points: 200,
        rarity: 'epic'
    }
];

const seedBadges = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing badges
        await Badge.deleteMany({});
        console.log('Cleared existing badges');

        // Insert new badges
        await Badge.insertMany(badges);
        console.log(`Inserted ${badges.length} badges`);

        console.log('Badge seeding completed!');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding badges:', error);
        process.exit(1);
    }
};

seedBadges();