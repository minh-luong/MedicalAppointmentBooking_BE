const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificationController');

// Create new notification
router.post('/create', controller.create);

// Get all notifications
router.post('/', controller.getAll);

// Get unread notification count
router.post('/unread-count', controller.getUnreadCount);

module.exports = router;