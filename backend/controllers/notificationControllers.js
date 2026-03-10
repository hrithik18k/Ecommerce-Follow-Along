const Notification = require('../models/notificationModel');

const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20); // Get latest 20 notifications
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, user: req.user._id },
            { isRead: true },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user._id, isRead: false },
            { isRead: true }
        );
        res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getUserNotifications, markAsRead, markAllAsRead };
