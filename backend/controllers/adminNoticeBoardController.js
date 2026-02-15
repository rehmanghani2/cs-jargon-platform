const Announcement = require('../models/Announcement');
const Event = require('../models/Event');
const User = require('../models/User');
const Notification = require('../models/Notification');

// =================== ANNOUNCEMENTS ===================

// @desc    Create announcement
// @route   POST /api/admin/announcements
// @access  Private/Admin
exports.createAnnouncement = async (req, res, next) => {
    try {
        const announcement = await Announcement.create({
            ...req.body,
            createdBy: req.user.id
        });

        // If published immediately, notify users
        if (announcement.status === 'published' && announcement.publishAt <= new Date()) {
            await notifyUsersAboutAnnouncement(announcement);
        }

        res.status(201).json({
            success: true,
            message: 'Announcement created successfully',
            data: { announcement }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Update announcement
// @route   PUT /api/admin/announcements/:id
// @access  Private/Admin
exports.updateAnnouncement = async (req, res, next) => {
    try {
        const announcement = await Announcement.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                lastUpdatedBy: req.user.id
            },
            { new: true, runValidators: true }
        );

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Announcement updated successfully',
            data: { announcement }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Delete announcement
// @route   DELETE /api/admin/announcements/:id
// @access  Private/Admin
exports.deleteAnnouncement = async (req, res, next) => {
    try {
        const announcement = await Announcement.findByIdAndDelete(req.params.id);

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Announcement deleted successfully'
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Pin/unpin announcement
// @route   PUT /api/admin/announcements/:id/pin
// @access  Private/Admin
exports.togglePinAnnouncement = async (req, res, next) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        announcement.isPinned = !announcement.isPinned;
        await announcement.save();

        res.status(200).json({
            success: true,
            message: `Announcement ${announcement.isPinned ? 'pinned' : 'unpinned'}`
        });

    } catch (error) {
        next(error);
    }
};

// =================== EVENTS ===================

// @desc    Create event
// @route   POST /api/admin/events
// @access  Private/Admin
exports.createEvent = async (req, res, next) => {
    try {
        const event = await Event.create({
            ...req.body,
            createdBy: req.user.id
        });

        // If published immediately, notify users
        if (event.status === 'upcoming') {
            await notifyUsersAboutEvent(event);
        }

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: { event }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Update event
// @route   PUT /api/admin/events/:id
// @access  Private/Admin
exports.updateEvent = async (req, res, next) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Notify registered users if significant changes
        if (req.body.startDate || req.body.location || req.body.status === 'cancelled') {
            await notifyRegisteredUsersAboutEventUpdate(event);
        }

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            data: { event }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Delete event
// @route   DELETE /api/admin/events/:id
// @access  Private/Admin
exports.deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Notify registered users
        if (event.registeredUsers.length > 0) {
            for (const registration of event.registeredUsers) {
                await Notification.create({
                    recipient: registration.user,
                    type: 'announcement',
                    title: 'Event Cancelled',
                    message: `The event "${event.title}" has been cancelled.`,
                    priority: 'high'
                });
            }
        }

        await event.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Mark attendance for event
// @route   PUT /api/admin/events/:id/attendance
// @access  Private/Admin
exports.markEventAttendance = async (req, res, next) => {
    try {
        const { attendees } = req.body; // Array of user IDs

        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Mark attendance
        for (const userId of attendees) {
            const registration = event.registeredUsers.find(
                r => r.user.toString() === userId
            );
            if (registration) {
                registration.attended = true;
            }
        }

        await event.save();

        // Award points to attendees
        for (const userId of attendees) {
            if (event.pointsAwarded > 0) {
                await User.findByIdAndUpdate(userId, {
                    $inc: { points: event.pointsAwarded }
                });
            }
        }

        res.status(200).json({
            success: true,
            message: `Marked ${attendees.length} attendees`
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Add event resources
// @route   POST /api/admin/events/:id/resources
// @access  Private/Admin
exports.addEventResources = async (req, res, next) => {
    try {
        const { resources } = req.body;

        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        event.resources.push(...resources);
        await event.save();

        // Notify registered users
        for (const registration of event.registeredUsers) {
            await Notification.create({
                recipient: registration.user,
                type: 'announcement',
                title: 'Event Resources Available',
                message: `Resources for "${event.title}" are now available.`,
                link: `/events/${event._id}`,
                priority: 'medium'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Resources added successfully'
        });

    } catch (error) {
        next(error);
    }
};

// Helper functions
async function notifyUsersAboutAnnouncement(announcement) {
    const filter = { isActive: true, isEmailVerified: true };
    
    if (announcement.targetAudience !== 'all') {
        filter.assignedLevel = announcement.targetAudience;
    }

    const users = await User.find(filter).select('_id');

    for (const user of users) {
        await Notification.create({
            recipient: user._id,
            type: 'announcement',
            title: announcement.title,
            message: announcement.excerpt || announcement.content.substring(0, 100),
            link: `/announcements/${announcement._id}`,
            priority: announcement.priority
        });
    }
}

async function notifyUsersAboutEvent(event) {
    const users = await User.find({ 
        isActive: true, 
        isEmailVerified: true 
    }).select('_id');

    for (const user of users) {
        await Notification.create({
            recipient: user._id,
            type: 'announcement',
            title: `New Event: ${event.title}`,
            message: `${event.shortDescription || event.description.substring(0, 100)}`,
            link: `/events/${event._id}`,
            priority: 'medium'
        });
    }
}

async function notifyRegisteredUsersAboutEventUpdate(event) {
    for (const registration of event.registeredUsers) {
        await Notification.create({
            recipient: registration.user,
            type: 'announcement',
            title: 'Event Updated',
            message: `"${event.title}" has been updated. Please check the details.`,
            link: `/events/${event._id}`,
            priority: 'high'
        });
    }
}

module.exports = exports;