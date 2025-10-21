const express = require('express');
const router = express.Router();
const controller = require('../controllers/treatmentHistoryController');

// CREATE treatment history
router.post('/add', controller.create);

// GET by ID
router.post('/get/:id', controller.getById);

// GET by appointment ID
router.post('/appointment/:appointment_id', controller.getByAppointment);

// Get histories by user ID
router.post('/user', controller.getByUser);

// UPDATE
router.post('/update/:id', controller.update);

// DELETE
router.post('/delete/:id', controller.delete);

module.exports = router;
