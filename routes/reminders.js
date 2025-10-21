const express = require('express');
const router = express.Router();
const controller = require('../controllers/reminderController');

// Create reminder
router.post('/create', controller.create);

// Get reminders by user
router.post('/get', controller.getByUser);

// Update a reminder
router.post('/update/:reminder_id', controller.update);

// Delete a reminder
router.post('/delete/:reminder_id', controller.delete);

module.exports = router;
