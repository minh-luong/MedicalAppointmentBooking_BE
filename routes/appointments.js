const express = require('express');
const router = express.Router();
const controller = require('../controllers/appointmentController');

// Create new appointment
router.post('/create', controller.create);

// Get appointment by ID
router.post('/get/:id', controller.getById);

// Get upcoming appointments for a user
router.post('/upcoming/user/', controller.getUpcomingByUser);

// Get appointments for a doctor
router.post('/doctor', controller.getByDoctor);

// Update time of appointment
router.post('/update/time/:id', controller.updateTime);

// Cancel appointment
router.post('/cancel/:id', controller.cancel);

// Delete appointment
router.post('/delete/:id', controller.delete);

module.exports = router;
