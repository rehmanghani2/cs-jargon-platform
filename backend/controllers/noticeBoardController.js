const Announcement = require('../models/Announcement');
const Event = require('../models/Event');
const Jargon = require('../models/Jargon');
const User = require('../models/User');
const Notification = require('../models/Notification');
const BadgeService = require('../services/badgeService');

// =================== ANNOUNCEMENTS ===================

// @desc    Get all announcements
// @route   GET /api/notice-board/announcements
// @access  Private
exports.getAnnouncements = async (req, res, next) => {
    try {
        const {
            type,
            category,
            priority,
            page = 1,
            limit = 10,
            includeExpired = false
        } = req.query;

        const filter = { status: 'published' };
        
        // Filter by user level
        const user = await User.findById(req.user.id);
        filter.$or = [
            { targetAudience: 'all' },
            { targetAudience: 'students' }
        ];
        
        if (user.assignedLevel) {
            filter.$or.push({ targetAudience: user.assignedLevel });
        }

        if (type) filter.type = type;
        if (category) filter.category = category;
        if (priority) filter.priority = priority;
        
        if (!includeExpired) {
            filter.$and = [
                { publishAt: { $lte: new Date() } },
                {
                    $or: [
                        { expiresAt: null },
                        { expiresAt: { $gt: new Date() } }
                    ]
                }
            ];
        }

        const total = await Announcement.countDocuments(filter);

        const announcements = await Announcement.find(filter)
            .populate('createdBy', 'fullName profilePicture')
            .populate('targetCourse', 'title')
            .sort({ isPinned: -1, priority: -1, publishAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Mark which announcements user has read
        const announcementsWithReadStatus = announcements.map(ann => {
            const hasRead = ann.readBy.some(
                r => r.user.toString() === req.user.id
            );
            return {
                ...ann.toObject(),
                isRead: hasRead
            };
        });

        res.status(200).json({
            success: true,
            count: announcements.length,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            },
            data: { announcements: announcementsWithReadStatus }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get single announcement
// @route   GET /api/notice-board/announcements/:id
// @access  Private
exports.getAnnouncement = async (req, res, next) => {
    try {
        const announcement = await Announcement.findById(req.params.id)
            .populate('createdBy', 'fullName profilePicture')
            .populate('targetCourse', 'title level');

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        // Increment view count and mark as read
        announcement.viewCount += 1;
        
        const hasRead = announcement.readBy.some(
            r => r.user.toString() === req.user.id
        );
        
        if (!hasRead) {
            announcement.readBy.push({
                user: req.user.id,
                readAt: new Date()
            });
        }
        
        await announcement.save();

        res.status(200).json({
            success: true,
            data: {
                announcement: {
                    ...announcement.toObject(),
                    isRead: true
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Mark announcement as read
// @route   PUT /api/notice-board/announcements/:id/read
// @access  Private
exports.markAnnouncementAsRead = async (req, res, next) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        const hasRead = announcement.readBy.some(
            r => r.user.toString() === req.user.id
        );

        if (!hasRead) {
            announcement.readBy.push({
                user: req.user.id,
                readAt: new Date()
            });
            await announcement.save();
        }

        res.status(200).json({
            success: true,
            message: 'Announcement marked as read'
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get unread announcements count
// @route   GET /api/notice-board/announcements/unread-count
// @access  Private
exports.getUnreadCount = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        
        const filter = {
            status: 'published',
            publishAt: { $lte: new Date() },
            $or: [
                { expiresAt: null },
                { expiresAt: { $gt: new Date() } }
            ],
            'readBy.user': { $ne: req.user.id }
        };

        // Filter by audience
        filter.$and = [
            {
                $or: [
                    { targetAudience: 'all' },
                    { targetAudience: 'students' },
                    { targetAudience: user.assignedLevel }
                ]
            }
        ];

        const count = await Announcement.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: { unreadCount: count }
        });

    } catch (error) {
        next(error);
    }
};

// =================== EVENTS ===================

// @desc    Get all events
// @route   GET /api/notice-board/events
// @access  Private
exports.getEvents = async (req, res, next) => {
    try {
        const {
            type,
            status,
            upcoming = true,
            page = 1,
            limit = 10
        } = req.query;

        const filter = { status: { $ne: 'draft' } };
        
        if (type) filter.type = type;
        if (status) filter.status = status;
        
        if (upcoming === 'true') {
            filter.startDate = { $gte: new Date() };
            filter.status = 'upcoming';
        }

        const total = await Event.countDocuments(filter);

        const events = await Event.find(filter)
            .populate('createdBy', 'fullName')
            .populate('relatedCourse', 'title')
            .populate('relatedJargons', 'term')
            .sort({ startDate: 1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Add registration status for current user
        const eventsWithStatus = events.map(event => {
            const isRegistered = event.registeredUsers.some(
                r => r.user.toString() === req.user.id
            );
            return {
                ...event.toObject(),
                isRegistered,
                registrationCount: event.registeredUsers.length,
                spotsRemaining: event.maxParticipants 
                    ? event.maxParticipants - event.registeredUsers.length 
                    : null
            };
        });

        res.status(200).json({
            success: true,
            count: events.length,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            },
            data: { events: eventsWithStatus }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get single event
// @route   GET /api/notice-board/events/:id
// @access  Private
exports.getEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('createdBy', 'fullName profilePicture')
            .populate('relatedCourse', 'title level')
            .populate('relatedJargons', 'term definition.simple')
            .populate('badgeAwarded', 'name icon');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Increment view count
        event.viewCount += 1;
        await event.save();

        // Check registration status
        const isRegistered = event.registeredUsers.some(
            r => r.user.toString() === req.user.id
        );

        // Get user's registration details if registered
        let userRegistration = null;
        if (isRegistered) {
            userRegistration = event.registeredUsers.find(
                r => r.user.toString() === req.user.id
            );
        }

        res.status(200).json({
            success: true,
            data: {
                event: {
                    ...event.toObject(),
                    isRegistered,
                    userRegistration,
                    registrationCount: event.registeredUsers.length,
                    spotsRemaining: event.maxParticipants 
                        ? event.maxParticipants - event.registeredUsers.length 
                        : null
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Register for event
// @route   POST /api/notice-board/events/:id/register
// @access  Private
exports.registerForEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if event is open for registration
        if (event.status !== 'upcoming') {
            return res.status(400).json({
                success: false,
                message: 'This event is not open for registration'
            });
        }

        // Check registration deadline
        if (event.registrationDeadline && new Date() > event.registrationDeadline) {
            return res.status(400).json({
                success: false,
                message: 'Registration deadline has passed'
            });
        }

        // Check if already registered
        const isRegistered = event.registeredUsers.some(
            r => r.user.toString() === req.user.id
        );

        if (isRegistered) {
            return res.status(400).json({
                success: false,
                message: 'You are already registered for this event'
            });
        }

        // Check capacity
        if (event.maxParticipants && event.registeredUsers.length >= event.maxParticipants) {
            return res.status(400).json({
                success: false,
                message: 'This event is fully booked'
            });
        }

        // Register user
        event.registeredUsers.push({
            user: req.user.id,
            registeredAt: new Date()
        });

        await event.save();

        // Create notification
        await Notification.create({
            recipient: req.user.id,
            type: 'announcement',
            title: 'Event Registration Confirmed! 🎉',
            message: `You are registered for "${event.title}" on ${new Date(event.startDate).toLocaleDateString()}`,
            link: `/events/${event._id}`,
            priority: 'high'
        });

        res.status(200).json({
            success: true,
            message: 'Successfully registered for the event',
            data: {
                event: {
                    id: event._id,
                    title: event.title,
                    startDate: event.startDate,
                    location: event.location
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Unregister from event
// @route   DELETE /api/notice-board/events/:id/register
// @access  Private
exports.unregisterFromEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if registered
        const registrationIndex = event.registeredUsers.findIndex(
            r => r.user.toString() === req.user.id
        );

        if (registrationIndex === -1) {
            return res.status(400).json({
                success: false,
                message: 'You are not registered for this event'
            });
        }

        // Check if event has started
        if (new Date() >= event.startDate) {
            return res.status(400).json({
                success: false,
                message: 'Cannot unregister after event has started'
            });
        }

        // Remove registration
        event.registeredUsers.splice(registrationIndex, 1);
        await event.save();

        res.status(200).json({
            success: true,
            message: 'Successfully unregistered from the event'
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Submit event feedback
// @route   POST /api/notice-board/events/:id/feedback
// @access  Private
exports.submitEventFeedback = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if event is completed
        if (event.status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Feedback can only be submitted for completed events'
            });
        }

        // Find user's registration
        const registration = event.registeredUsers.find(
            r => r.user.toString() === req.user.id
        );

        if (!registration) {
            return res.status(400).json({
                success: false,
                message: 'You were not registered for this event'
            });
        }

        if (!registration.attended) {
            return res.status(400).json({
                success: false,
                message: 'Feedback can only be submitted if you attended the event'
            });
        }

        // Add feedback
        registration.feedback = {
            rating,
            comment,
            submittedAt: new Date()
        };

        await event.save();

        res.status(200).json({
            success: true,
            message: 'Feedback submitted successfully'
        });

    } catch (error) {
        next(error);
    }
};

// =================== JARGON OF THE WEEK ===================

// @desc    Get jargon of the week
// @route   GET /api/notice-board/jargon-of-week
// @access  Private
exports.getJargonOfWeek = async (req, res, next) => {
    try {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        let jargon = await Jargon.findOne({
            isJargonOfWeek: true,
            jargonOfWeekDate: { $gte: startOfWeek, $lt: endOfWeek }
        })
        .populate('relatedTerms', 'term acronym')
        .populate('synonyms', 'term')
        .populate('antonyms', 'term');

        // If no jargon set for this week, get a random one
        let isRandom = false;
        if (!jargon) {
            const randomJargons = await Jargon.aggregate([
                { $match: { isActive: true } },
                { $sample: { size: 1 } }
            ]);
            
            if (randomJargons.length > 0) {
                jargon = await Jargon.findById(randomJargons[0]._id)
                    .populate('relatedTerms', 'term acronym')
                    .populate('synonyms', 'term')
                    .populate('antonyms', 'term');
                isRandom = true;
            }
        }

        // Get previous weeks' jargons
        const previousJargons = await Jargon.find({
            isJargonOfWeek: true,
            jargonOfWeekDate: { $lt: startOfWeek }
        })
        .sort({ jargonOfWeekDate: -1 })
        .limit(4)
        .select('term acronym category difficulty jargonOfWeekDate');

        res.status(200).json({
            success: true,
            data: {
                currentWeek: {
                    jargon,
                    isRandom,
                    weekStart: startOfWeek,
                    weekEnd: endOfWeek
                },
                previousWeeks: previousJargons
            }
        });

    } catch (error) {
        next(error);
    }
};

// =================== LEADERBOARD ===================

// @desc    Get leaderboard
// @route   GET /api/notice-board/leaderboard
// @access  Private
exports.getLeaderboard = async (req, res, next) => {
    try {
        const { type = 'points', period = 'all', limit = 10 } = req.query;

        let dateFilter = {};
        const now = new Date();

        // Set date filter based on period
        switch (period) {
            case 'week':
                const weekStart = new Date(now);
                weekStart.setDate(now.getDate() - now.getDay());
                weekStart.setHours(0, 0, 0, 0);
                dateFilter = { createdAt: { $gte: weekStart } };
                break;
            case 'month':
                const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                dateFilter = { createdAt: { $gte: monthStart } };
                break;
            case 'year':
                const yearStart = new Date(now.getFullYear(), 0, 1);
                dateFilter = { createdAt: { $gte: yearStart } };
                break;
            default:
                // All time - no date filter
                break;
        }

        let sortField;
        let aggregation = [];

        switch (type) {
            case 'streak':
                sortField = 'currentStreak';
                break;
            case 'time':
                sortField = 'totalTimeSpent';
                break;
            case 'badges':
                aggregation = [
                    { $match: { role: 'student', isActive: true } },
                    {
                        $project: {
                            fullName: 1,
                            profilePicture: 1,
                            assignedLevel: 1,
                            points: 1,
                            badgeCount: { $size: '$badges' }
                        }
                    },
                    { $sort: { badgeCount: -1 } },
                    { $limit: parseInt(limit) }
                ];
                break;
            default:
                sortField = 'points';
        }

        let leaderboard;

        if (aggregation.length > 0) {
            leaderboard = await User.aggregate(aggregation);
        } else {
            leaderboard = await User.find({
                role: 'student',
                isActive: true
            })
            .select('fullName profilePicture assignedLevel points currentStreak longestStreak totalTimeSpent badges')
            .sort({ [sortField]: -1 })
            .limit(parseInt(limit));
        }

        // Add rank
        const rankedLeaderboard = leaderboard.map((user, index) => ({
            rank: index + 1,
            id: user._id,
            fullName: user.fullName,
            profilePicture: user.profilePicture,
            assignedLevel: user.assignedLevel,
            points: user.points,
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
            totalTimeSpent: user.totalTimeSpent,
            badgeCount: user.badgeCount || (user.badges?.length || 0)
        }));

        // Find current user's rank
        const currentUser = await User.findById(req.user.id);
        let userRank = null;

        if (type === 'badges') {
            const userBadgeCount = currentUser.badges?.length || 0;
            const higherRanked = await User.countDocuments({
                role: 'student',
                isActive: true,
                $expr: { $gt: [{ $size: '$badges' }, userBadgeCount] }
            });
            userRank = higherRanked + 1;
        } else {
            const userValue = currentUser[sortField] || 0;
            const higherRanked = await User.countDocuments({
                role: 'student',
                isActive: true,
                [sortField]: { $gt: userValue }
            });
            userRank = higherRanked + 1;
        }

        res.status(200).json({
            success: true,
            data: {
                leaderboard: rankedLeaderboard,
                currentUser: {
                    rank: userRank,
                    id: currentUser._id,
                    fullName: currentUser.fullName,
                    profilePicture: currentUser.profilePicture,
                    points: currentUser.points,
                    currentStreak: currentUser.currentStreak,
                    badgeCount: currentUser.badges?.length || 0
                },
                type,
                period
            }
        });

    } catch (error) {
        next(error);
    }
};

// =================== NOTICE BOARD OVERVIEW ===================

// @desc    Get notice board overview (dashboard)
// @route   GET /api/notice-board/overview
// @access  Private
exports.getNoticeBoardOverview = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        // Get pinned/important announcements
        const importantAnnouncements = await Announcement.find({
            status: 'published',
            publishAt: { $lte: new Date() },
            $or: [
                { expiresAt: null },
                { expiresAt: { $gt: new Date() } }
            ],
            $or: [
                { isPinned: true },
                { priority: 'urgent' },
                { priority: 'high' }
            ]
        })
        .sort({ isPinned: -1, priority: -1, publishAt: -1 })
        .limit(5)
        .select('title excerpt type priority isPinned publishAt');

        // Get upcoming events
        const upcomingEvents = await Event.find({
            status: 'upcoming',
            startDate: { $gte: new Date() }
        })
        .sort({ startDate: 1 })
        .limit(3)
        .select('title type startDate endDate isOnline location');

        // Get jargon of the week
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const jargonOfWeek = await Jargon.findOne({
            isJargonOfWeek: true,
            jargonOfWeekDate: { $gte: startOfWeek }
        }).select('term acronym definition.simple category');

        // Get top 5 leaderboard
        const topLearners = await User.find({
            role: 'student',
            isActive: true
        })
        .sort({ points: -1 })
        .limit(5)
        .select('fullName profilePicture points currentStreak');

        // Get unread count
        const unreadAnnouncements = await Announcement.countDocuments({
            status: 'published',
            publishAt: { $lte: new Date() },
            $or: [
                { expiresAt: null },
                { expiresAt: { $gt: new Date() } }
            ],
            'readBy.user': { $ne: req.user.id }
        });

        // Get user's registered events
        const myUpcomingEvents = await Event.find({
            'registeredUsers.user': req.user.id,
            status: 'upcoming',
            startDate: { $gte: new Date() }
        })
        .sort({ startDate: 1 })
        .limit(3)
        .select('title startDate type');

        res.status(200).json({
            success: true,
            data: {
                importantAnnouncements,
                upcomingEvents,
                jargonOfWeek,
                leaderboard: topLearners.map((user, index) => ({
                    rank: index + 1,
                    fullName: user.fullName,
                    profilePicture: user.profilePicture,
                    points: user.points,
                    streak: user.currentStreak
                })),
                unreadAnnouncements,
                myUpcomingEvents,
                quickStats: {
                    totalAnnouncements: await Announcement.countDocuments({ status: 'published' }),
                    totalUpcomingEvents: await Event.countDocuments({ status: 'upcoming' })
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = exports;