const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { getUserNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationControllers');

const router = express.Router();

router.get('/', protect, getUserNotifications);
router.patch('/mark-all-read', protect, markAllAsRead);
router.patch('/:notificationId/read', protect, markAsRead);

module.exports = router;
