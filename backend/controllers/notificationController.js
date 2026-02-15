const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const skip = (page - 1) * limit;

        // Get user-specific and global notifications
        const query = {
            $or: [
                { recipient: req.user.id },
                { isGlobal: true }
            ],
            $or: [
                { expiresAt: { $gt: new Date() } },
                { expiresAt: null }
            ]
        };

        const total = await Notification.countDocuments(query);

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const unreadCount = await Notification.countDocuments({
            ...query,
            isRead: false
        });

        res.status(200).json({
            success: true,
            data: {
                notifications,
                unreadCount,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            {
                _id: req.params.id,
                $or: [
                    { recipient: req.user.id },
                    { isGlobal: true }
                ]
            },
            {
                isRead: true,
                readAt: new Date()
            },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { notification }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            {
                $or: [
                    { recipient: req.user.id },
                    { isGlobal: true }
                ],
                isRead: false
            },
            {
                isRead: true,
                readAt: new Date()
            }
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            recipient: req.user.id,
            isGlobal: false
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found or cannot be deleted'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully'
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get unread count
// @route   GET /api/notifications/unread-count
// @access  Private
exports.getUnreadCount = async (req, res, next) => {
    try {
        const count = await Notification.countDocuments({
            $or: [
                { recipient: req.user.id },
                { isGlobal: true }
            ],
            isRead: false,
            $or: [
                { expiresAt: { $gt: new Date() } },
                { expiresAt: null }
            ]
        });

        res.status(200).json({
            success: true,
            data: { unreadCount: count }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Create announcement (Admin)
// @route   POST /api/notifications/announcement
// @access  Private/Admin
exports.createAnnouncement = async (req, res, next) => {
    try {
        const { title, message, priority, expiresAt } = req.body;

        const notification = await Notification.create({
            isGlobal: true,
            type: 'announcement',
            title,
            message,
            priority: priority || 'medium',
            expiresAt: expiresAt ? new Date(expiresAt) : null
        });

        res.status(201).json({
            success: true,
            data: { notification }
        });

    } catch (error) {
        next(error);
    }
};